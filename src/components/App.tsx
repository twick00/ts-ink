import React, { PureComponent } from 'react'
import { AppContext, StdoutContext, StdinContext } from '../context'
import { Options } from '../types'
import cliCursor from 'cli-cursor'

export default class App extends PureComponent<
  Options & { onExit: (error?: Error) => void },
  undefined
> {
  // Determines if TTY is supported on the provided stdin
  rawModeEnabledCount: number //Counter
  isRawModeSupported() {
    return this.props.stdin.isTTY
  }

  constructor(props: Readonly<Options & { onExit: (error?: Error) => void }>) {
    super(props)
    this.rawModeEnabledCount = 0
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          exit: this.handleExit
        }}
      >
        <StdinContext.Provider
          value={{
            stdin: this.props.stdin,
            setRawMode: this.handleSetRawMode,
            isRawModeSupported: this.isRawModeSupported()
          }}
        >
          <StdoutContext.Provider
            value={{
              stdout: this.props.stdout
            }}
          >
            {this.props.children}
          </StdoutContext.Provider>
        </StdinContext.Provider>
      </AppContext.Provider>
    )
  }

  componentDidMount() {
    cliCursor.hide(this.props.stdout /*?*/)
  }

  componentWillUnmount() {
    cliCursor.show(this.props.stdout)

    // ignore calling setRawMode on an handle stdin it cannot be called
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false)
    }
  }

  componentDidCatch(error?: Error) {
    //The only reason this is a class component
    this.handleExit(error)
  }

  handleSetRawMode = (isEnabled?: boolean) => {
    const { stdin } = this.props
    if (!this.isRawModeSupported()) {
      if (stdin === process.stdin) {
        throw new Error(
          //TODO: update this
          'Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default.\nRead about how to prevent this error on https://github.com/vadimdemedes/ink/#israwmodesupported'
        )
      } else {
        throw new Error(
          //TODO: update this
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

  handleInput = (input: string) => {
    // Exit on Ctrl+C
    if (input === '\x03' && this.props.exitOnCtrlC) {
      this.handleExit()
    }
  }

  handleExit = (error?: Error) => {
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false)
    }

    this.props.onExit(error)
  }
}
