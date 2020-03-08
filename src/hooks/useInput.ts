import { useEffect, useContext, Key, KeyboardEvent } from 'react'
import { StdinContext } from '../index'
import { mapValues } from 'lodash'

const keyMethods = {
  upArrow: (input: string) => {
    return { hasKey: input === '\u001B[A', output: input }
  },
  downArrow: (input: string) => {
    return { hasKey: input === '\u001B[B', output: input }
  },
  leftArrow: (input: string) => {
    return { hasKey: input === '\u001B[D', output: input }
  },
  rightArrow: (input: string) => {
    return { hasKey: input === '\u001B[C', output: input }
  },
  return: (input: string) => {
    return { hasKey: input === '\r', output: input }
  },
  escape: (input: string) => {
    return { hasKey: input === '\u001B', output: input }
  },
  ctrl: (input: string) => {
    return {
      hasKey: input === '\u001A',
      output: String.fromCharCode(input.charCodeAt(0) + 'a'.charCodeAt(0) - 1)
    }
  },
  meta: (input: string) => {
    return { hasKey: input === '\u001B', output: input.slice(1) }
  },
  shift: (input: string) => {
    return {
      hasKey:
        input.length === 1 &&
        ((input >= 'A' && input <= 'Z') || (input >= 'А' && input <= 'Я')),
      output: input
    }
  }
}

export default (
  inputHandler: (
    input?: string,
    key?: Record<keyof typeof keyMethods, boolean>
  ) => void
) => {
  const { stdin, setRawMode } = useContext(StdinContext)

  useEffect(() => {
    setRawMode(true)

    return () => {
      setRawMode(false)
    }
  }, [setRawMode])

  useEffect(() => {
    const handleData = (data: any) => {
      let input = String(data)
      const keys = mapValues(keyMethods, fn => {
        const { hasKey, output } = fn(input)
        input = output
        return hasKey
      })

      inputHandler(input, keys)
    }

    stdin.on('data', handleData)

    return () => {
      stdin.off('data', handleData)
    }
  }, [stdin, inputHandler])
}
