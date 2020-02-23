import React, { PureComponent } from 'react'
import { noop } from 'lodash'
import { ReadStream, WriteStream } from 'tty'
import { render } from '../render'
import Text from './Text'
import { Options } from '../shared'
import cliCursor from 'cli-cursor';


export default class App extends PureComponent<Options & {onExit: (error?: Error) => void}, undefined> {
  // Determines if TTY is supported on the provided stdin
  rawModeEnabledCount
  isRawModeSupported() {
    return this.props.stdin.isTTY
  }

  constructor(props) {
    super(props)
    this.rawModeEnabledCount = 0;
  }

  render() {
    return this.props.children
  }

  componentDidMount() {
    cliCursor.hide(this.props.stdout)
  }

  componentWillUnmount() {
    cliCursor.show(this.props.stdout)

    // ignore calling setRawMode on an handle stdin it cannot be called
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false)
    }
  }

  componentDidCatch(error) {
    this.handleExit(error)
  }

  handleSetRawMode = isEnabled => {
    const { stdin } = this.props

    if (!this.isRawModeSupported()) {
      if (stdin === process.stdin) {
        throw new Error(
          'Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
        )
      } else {
        throw new Error(
          'Raw mode is not supported on the stdin provided to Ink.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
        )
      }
    }

    stdin.setEncoding('utf8')

    if (isEnabled) {
      // Ensure raw mode is enabled only once
      if (this.rawModeEnabledCount === 0) {
        stdin.addListener('data', this.handleInput)
        stdin.resume()
        stdin.setRawMode(true)
      }

      this.rawModeEnabledCount++
      return
    }

    // Disable raw mode only when no components left that are using it
    if (--this.rawModeEnabledCount === 0) {
      stdin.setRawMode(false)
      stdin.removeListener('data', this.handleInput)
      stdin.pause()
    }
  }

  handleInput = input => {
    // Exit on Ctrl+C
    if (input === '\x03' && this.props.exitOnCtrlC) {
      this.handleExit()
    }
  }

  handleExit = (error?:Error) => {
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false)
    }

    this.props.onExit(error)
  }
}
