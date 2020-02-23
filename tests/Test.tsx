'use strict'
import Box from '../src/components/Box'

const React = require('react')
import { render } from '../src/render'
import Color from '../src/components/Color'

class Counter extends React.PureComponent {
  constructor() {
    super()

    this.state = {
      i: 0
    }
  }

  render() {
    return (
      <Box flexDirection={'column'}>
        <Box>
          <Color blue>~/Projects/ink </Color>
        </Box>
        <Box>
          <Color red>λ </Color>
          <Color green>node </Color>
          <Box>media/example</Box>
        </Box>
        <Box>
          <Color>{this.state.i} tests passed</Color>
        </Box>
      </Box>
    )
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.i === 50) {
        process.exit(0) // eslint-disable-line unicorn/no-process-exit
      }

      this.setState(prevState => ({
        i: prevState.i + 1
      }))
    }, 100)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }
}

render(React.createElement(Counter), { experimental: true })
