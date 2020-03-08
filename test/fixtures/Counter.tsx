import * as React from 'react'
import { Box, Color, render, Static, Text } from '../../src'

function Counter() {
  const [counter, setCounter] = React.useState<number>(0)
  const counterRef = React.useRef<NodeJS.Timeout>()

  React.useEffect(() => {
    counterRef.current = setInterval(() => {
      if (counter === 50) {
        process.exit(0)
      }
      setCounter(counterVal => {
        return counterVal + 1
      })
    }, 10)
    return () => clearInterval(counterRef.current)
  })

  return (
    <Box flexDirection={'column'}>
      <Text>Hello World</Text>
      <Static>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
          <Color blue key={index}>
            {index}: {value}
          </Color>
        ))}
      </Static>
    </Box>
  )
}

render(<Counter/>, { experimental: true })
