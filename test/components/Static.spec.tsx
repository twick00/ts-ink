import React from 'react'
import { Box, render, Color, Static } from '../../src'
import { renderToString, run } from '../helpers'
import stripAnsi from 'strip-ansi'

describe('Static component', () => {
  it('should render static output correctly', () => {
    const output = renderToString(
      <Box>
        <Static paddingBottom={1}>
          <Box key="a">A</Box>
          <Box key="b">B</Box>
          <Box key="c">C</Box>
        </Static>

        <Box marginTop={1}>X</Box>
      </Box>
    )

    expect(output).toEqual('A\nB\nC\n\n\nX')
  })

  it('should skip previous output when rendering new static output', () => {
    const stdout = {
      write: jest.fn(),
      columns: 100
    }
    const Dynamic = ({ items }: { items: string[] }) => (
      <Static>
        {items.map(item => (
          <Box key={item}>{item}</Box>
        ))}
      </Static>
    )
    const { rerender } = render(<Dynamic items={['A']} />, {
      stdout,
      debug: true
    })

    expect(stdout.write).toHaveBeenLastCalledWith('A\n')
    rerender(<Dynamic items={['A', 'B']} />)
    expect(stdout.write).toHaveBeenLastCalledWith('A\nB\n')
  })
  it('should correctly render only last frame when run in CI', async () => {
    const output = await run('CITest.tsx', {
      env: { CI: true }
    })

    expect(stripAnsi(output)).toEqual(
      ['#1', '#2', '#3', '#4', '#5', 'Counter: 5'].join('\r\n') + '\r\n'
    )
  })
})
