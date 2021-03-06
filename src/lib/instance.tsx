import React from 'react'
import { throttle } from 'lodash'
import { Options } from '../types'
import reconciler from './reconciler'
import createRenderer from './renderer'
import logUpdate, { LogUpdate } from 'log-update'
import { isCI } from 'ci-info'
import ansiEscapes from 'ansi-escapes'
import instances from './instances'
import signalExit from 'signal-exit'
import * as dom from './dom'
import App from '../components/App'
import { InkRootElement } from '../types'
import autoBind from 'auto-bind'
import ReactReconciler from 'react-reconciler'

export default class Instance {
  rootNode: InkRootElement
  renderer: Function | undefined
  container: ReactReconciler.FiberRoot
  exitPromise: Promise<any>
  resolveExit: Function | undefined
  rejectExit: Function | undefined
  options: Options
  log: LogUpdate
  throttledLog: LogUpdate
  isUnmounted: boolean
  lastOutput: string
  fullStaticOutput: string
  unsubscribeExit: Function

  constructor(options: Options) {
    autoBind(this)

    this.options = options
    this.rootNode = dom.createNode('root')

    this.rootNode.onRender = options.debug
      ? this.onRender
      : throttle(this.onRender, 16, {
          leading: true,
          trailing: true
        })

    this.rootNode.onImmediateRender = this.onRender

    this.renderer = createRenderer({
      terminalWidth: options.stdout.columns
    })

    this.log = logUpdate.create(options.stdout)
    this.throttledLog = options.debug
      ? this.log
      : throttle(this.log, undefined, {
          leading: true,
          trailing: true
        })

    // Ignore last render after unmounting a tree to prevent empty output before exit
    this.isUnmounted = false

    // Store last output to only rerender when needed
    this.lastOutput = ''

    // This variable is used only in debug mode to store full static output
    // so that it's rerendered every time, not just new static parts, like in non-debug mode
    this.fullStaticOutput = ''

    this.container = reconciler.createContainer(this.rootNode, false, false)

    this.exitPromise = new Promise((resolve, reject) => {
      this.resolveExit = resolve
      this.rejectExit = reject
    })

    // Unmount when process exits
    this.unsubscribeExit = signalExit(this.unmount, { alwaysLast: false })
  }

  onRender() {
    if (this.isUnmounted) {
      return
    }

    const { output, outputHeight, staticOutput } = this.renderer(this.rootNode)

    // If <Static> output isn't empty, it means new children have been added to it
    const hasStaticOutput = staticOutput && staticOutput !== '\n'

    if (this.options.debug) {
      if (hasStaticOutput) {
        this.fullStaticOutput += staticOutput
      }

      this.options.stdout.write(this.fullStaticOutput + output)
      return
    }
    debugger
    if (isCI) {
      if (hasStaticOutput) {
        this.options.stdout.write(staticOutput)
      }

      this.lastOutput = output
      return
    }

    if (hasStaticOutput) {
      this.fullStaticOutput += staticOutput
    }

    if (outputHeight >= this.options.stdout.rows) {
      this.options.stdout.write(
        ansiEscapes.clearTerminal + this.fullStaticOutput + output
      )
      this.lastOutput = output
      return
    }

    // To ensure static output is cleanly rendered before main output, clear main output first
    if (hasStaticOutput) {
      this.log.clear()
      this.options.stdout.write(staticOutput)
    }

    this.throttledLog(output)
  }

  render(node: React.ReactNode) {
    const tree = (
      <App
        stdin={this.options.stdin}
        stdout={this.options.stdout}
        exitOnCtrlC={this.options.exitOnCtrlC}
        onExit={this.unmount}
      >
        {node}
      </App>
    )
    reconciler.updateContainer(tree, this.container, undefined, undefined)
  }

  unmount(error?: Error | string | number) {
    if (this.isUnmounted) {
      return
    }

    this.onRender()
    this.unsubscribeExit()

    // CIs don't handle erasing ansi escapes well, so it's better to
    // only render last frame of non-static output
    if (isCI) {
      this.options.stdout.write(this.lastOutput + '\n')
    } else if (!this.options.debug) {
      this.log.done()
    }

    this.isUnmounted = true

    reconciler.updateContainer(null, this.container, undefined, undefined)
    instances.delete(this.options.stdout)

    if (error instanceof Error) {
      this.rejectExit(error)
    } else {
      this.resolveExit()
    }
  }

  waitUntilExit() {
    return this.exitPromise
  }
}
