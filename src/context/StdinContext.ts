import React from 'react'
import { noop } from 'lodash'
import { ReadStream } from 'tty'

export default React.createContext<{
  stdin?: ReadStream
  setRawMode: (isEnabled?: boolean) => void
  isRawModeSupported: boolean
}>({
  stdin: undefined,
  setRawMode: undefined,
  isRawModeSupported: undefined
})
