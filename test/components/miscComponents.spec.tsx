import EventEmitter from 'events'
import React from 'react'
import { Box, render, Static, StdinContext } from '../../src'
import { Input } from '../fixtures/Input'
import { MockStdin } from '../helpers/mockStdin'
import { run } from '../helpers'
import stripAnsi from 'strip-ansi'
import exp from 'constants'

describe('Misc components', () => {
  class MyEmitter extends EventEmitter.EventEmitter {
    setEncoding: () => void
    setRawMode: (isEnabled?: boolean) => void
    isTTY: boolean
    resume: Function
    pause: Function
  }

  it('should disable raw mode when all input components are unmounted', async () => {
    const stdout = {
      write: jest.fn(),
      columns: 100
    }
    const setRawMode = jest.fn((set: boolean) => {})
    const resume = jest.fn()
    const pause = jest.fn()

    const stdin = new MockStdin({
      setEncoding: () => {},
      setRawMode: setRawMode,
      isTTY: true,
      resume: resume,
      pause: pause
    })

    const options = {
      stdout,
      stdin,
      debug: true
    }

    const Test = ({
      renderFirstInput,
      renderSecondInput
    }: {
      renderFirstInput?: boolean
      renderSecondInput?: boolean
    }) => (
      <StdinContext.Consumer>
        {({ setRawMode }) => (
          <>
            {renderFirstInput && <Input setRawMode={setRawMode} />}
            {renderSecondInput && <Input setRawMode={setRawMode} />}
          </>
        )}
      </StdinContext.Consumer>
    )

    const { rerender } = render(
      <Test renderFirstInput renderSecondInput />,
      options
    )
    expect(stdin.setRawMode).toHaveBeenCalledTimes(1)
    expect(setRawMode).lastCalledWith(true)
    expect(resume).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()

    rerender(<Test renderFirstInput />)

    expect(setRawMode).nthCalledWith(1, true)
    expect(resume).toHaveBeenCalledTimes(1)
    expect(pause).not.toHaveBeenCalled()

    rerender(<Test />)

    expect(stdin.setRawMode).toHaveBeenCalledTimes(2)
    expect(setRawMode).lastCalledWith(false)
    expect(resume).toHaveBeenCalledTimes(1)
    expect(pause).toHaveBeenCalledTimes(1)
  })

  it('should throw if raw mode is not supported and setRawMode(true) is used', () => {
    const stdout = {
      write: jest.fn(),
      columns: 100
    }

    const setRawMode = jest.fn((set: boolean) => {})
    const resume = jest.fn()
    const pause = jest.fn()
    const stdin = new MockStdin({
      setRawMode,
      pause,
      resume,
      isTTY: false,
      setEncoding: () => {}
    })

    const didCatchInMount = jest.fn()
    const didCatchInUnmount = jest.fn()

    const options = {
      stdout,
      stdin,
      debug: true
    }

    const Test = () => (
      <StdinContext.Consumer>
        {({ setRawMode }) => (
          <Input
            setRawMode={setRawMode}
            onCaughtMount={didCatchInMount}
            onCaughtUnmount={didCatchInUnmount}
          />
        )}
      </StdinContext.Consumer>
    )

    const { unmount } = render(<Test />, options)
    unmount()

    expect(didCatchInMount).toHaveBeenCalledTimes(1)
    expect(didCatchInUnmount).toHaveBeenCalledTimes(1)
    expect(setRawMode).not.toHaveBeenCalled()
    expect(resume).not.toHaveBeenCalled()
    expect(pause).not.toHaveBeenCalled()
  })

  it('should render different components if stdin is TTY or not', () => {
    const stdout = {
      write: jest.fn(),
      columns: 100
    }
    const setRawMode = jest.fn((isEnabled: boolean) => {})
    const resume = jest.fn()
    const pause = jest.fn()
    const stdin = new MockStdin({
      setEncoding: () => {},
      setRawMode: setRawMode,
      isTTY: false,
      resume: resume,
      pause: pause
    })

    const options = {
      stdout,
      stdin,
      debug: true
    }

    function Test({
      renderFirstInput,
      renderSecondInput
    }: {
      renderFirstInput?: boolean
      renderSecondInput?: boolean
    }) {
      return (
        <StdinContext.Consumer>
          {({ isRawModeSupported, setRawMode }) => (
            <>
              {isRawModeSupported && renderFirstInput && (
                <Input setRawMode={setRawMode} />
              )}
              {isRawModeSupported && renderSecondInput && (
                <Input setRawMode={setRawMode} />
              )}
            </>
          )}
        </StdinContext.Consumer>
      )
    }

    const { rerender } = render(
      <Test renderFirstInput renderSecondInput />,
      options
    )

    expect(setRawMode).not.toHaveBeenCalled()
    expect(resume).not.toHaveBeenCalled()
    expect(pause).not.toHaveBeenCalled()

    rerender(<Test renderFirstInput />)

    expect(setRawMode).not.toHaveBeenCalled()
    expect(resume).not.toHaveBeenCalled()
    expect(pause).not.toHaveBeenCalled()

    rerender(<Test />)

    expect(setRawMode).not.toHaveBeenCalled()
    expect(resume).not.toHaveBeenCalled()
    expect(pause).not.toHaveBeenCalled()
  })

  it('should reset props when its removed from the element', () => {
    const stdout = {
      write: jest.fn(),
      columns: 100
    }
    const Dynamic = ({ remove }: {remove?: boolean}) => (
      <Box flexDirection="column" justifyContent="flex-end" height={remove ? undefined : 4}>
        x
      </Box>
    )
    const { rerender } = render(<Dynamic/>, {
      stdout,
      debug: true,
    })
    expect(stdout.write).toHaveBeenLastCalledWith('\n\n\nx')
    rerender(<Dynamic remove/>)
    expect(stdout.write).toHaveBeenLastCalledWith('x')
  })
})
