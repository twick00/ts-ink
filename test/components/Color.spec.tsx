import renderToString from '../helpers/renderToString'
import chalk from 'chalk'
import React from 'react'
import { Box, Color, render } from '../../src'

describe('Color component', () => {
  it('should ensure wrap-ansi does not trim leading whitespace', () => {
    //Todo: verify WallabyJs issue
    const output = renderToString(chalk.red(' ERROR'))
    expect(output).toEqual(chalk.red(' ERROR'))
  })

  it('should not error when empty', () => {
    const output = renderToString(<Color />)
    expect(output).toEqual('')
  })

  it('should replace child node with text', () => {
    const jestFn = jest.fn()

    const Dynamic = ({ replace }: { replace?: string }) => (
      <Box>{replace ? 'x' : <Color green>test</Color>}</Box>
    )

    const { rerender } = render(<Dynamic />, {
      stdout: {
        write: jestFn,
        columns: 100
      },
      debug: true
    })
    expect(jestFn).lastCalledWith(chalk.green('test'))
  })
})
