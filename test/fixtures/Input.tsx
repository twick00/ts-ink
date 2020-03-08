import React from 'react'
import { Box } from '../../src/components'
import { isFunction } from 'lodash'

export function Input({
  setRawMode,
  onCaughtMount,
  onCaughtUnmount
}: {
  setRawMode: (mode: boolean) => void
  onCaughtMount?: (e: any) => unknown
  onCaughtUnmount?: (e: any) => unknown
}) {
  //Todo: Correct location of setRawMode()
  if(isFunction(onCaughtMount)) {
    try {
      setRawMode(true)
    } catch (e) {
      onCaughtMount(e)
    }
  } else {
    setRawMode(true)
  }

  React.useEffect(() => {
    return () => {
      if(isFunction(onCaughtUnmount)){
        try {
          setRawMode(false)
        } catch (e) {
          onCaughtUnmount(e)
        }
      } else {
        setRawMode(false)
      }
    }
  })
  return <Box>Test</Box>
}
