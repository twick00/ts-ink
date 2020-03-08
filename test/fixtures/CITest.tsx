import React from 'react'
import { Box, Text, Static, Color, render } from '../../src'

const CITest = () => {
  const [state, setState] = React.useState({ items: [], counter: 0 })

  const onTimeout = () => {
    if (state.counter > 4) {
      return
    }
    setState(prevState => {
      return {
        counter: prevState.counter + 1,
        items: [...prevState.items, `#${prevState.counter + 1}`]
      }
    })
  }

  React.useEffect(() => {
    const timer = setTimeout(onTimeout, 100)
    return () => clearTimeout(timer)
  })

  return (
    <Box>

      <Static>
        {state.items.map((item) => (
          <Box key={item}>{item}</Box>
        ))}
      </Static>
      <Box>Counter: {state.counter}</Box>
    </Box>
  )
}

render(<CITest/>)
