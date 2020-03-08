import renderToString from '../helpers/renderToString'
import {Box, Text, Color} from '../../src'
import * as React from 'react'
import { useState } from 'react'

describe('Box component', () => {
  it('should render text nodes correctly', () => {
    const output = renderToString(<Box>Hello World</Box>)
    expect(output).toEqual('Hello World')
  })

  it('should render multiple text nodes correctly', () => {
    const output = renderToString(
      <Box>
        {'Hello'} {'World'}
      </Box>
    )
    expect(output).toEqual('Hello World')
  })

  it('should render layout correctly', () => {
    const output = renderToString(
      <Box flexDirection={'column'}>
        {'Hello'}
        {'World'}
      </Box>
    )
    expect(output).toEqual('Hello\nWorld')
  })

  it('should be nestable in a component', () => {
    const World = () => <Box>World</Box>
    const output = renderToString(
      <Box>
        Hello <World />
      </Box>
    )
    expect(output).toEqual('Hello World')
  })
  it('should render correctly with fragment', () => {
    const output = renderToString(
      <Box>
        Hello <>World</>{' '}
        {/* eslint-disable-line react/jsx-no-useless-fragment */}
      </Box>
    )
    expect(output).toEqual('Hello World')
  })
  it('should wrap when columns are smaller than text', () => {
    const output = renderToString(<Box textWrap="wrap">Hello World</Box>, {
      columns: 7
    })
    expect(output).toEqual('Hello\nWorld')
  })
  it('should not wrap when columns are larger than text', () => {
    const output = renderToString(<Box textWrap="wrap">Hello World</Box>, {
      columns: 20
    })
    expect(output).toEqual('Hello World')
  })
  it('should render truncate prop correctly', () => {
    const output = renderToString(<Box textWrap="truncate">Hello World</Box>, {
      columns: 7
    })
    expect(output).toEqual('Hello …')
  })
  it('should render truncate-middle prop correctly', () => {
    const output = renderToString(
      <Box textWrap="truncate-middle">Hello World</Box>,
      { columns: 7 }
    )
    expect(output).toEqual('Hel…rld')
  })
  it('should squash empty texts nodes on edges', () => {
    const output = renderToString(
      <Box flexDirection="column">
        <Box>Hello World</Box>
        {''}
      </Box>
    )
    expect(output).toEqual('Hello World')
  })
  it('should render numbers correctly', () => {
    const output = renderToString(<Box>{1}</Box>)
    expect(output).toEqual('1')
  })
  it('should correctly apply transformChildren', () => {
    const output = renderToString(
      <Box unstable__transformChildren={(str: string) => `[${str}]`}>
        <Box unstable__transformChildren={(str: string) => `{${str}}`}>
          hello world
        </Box>
      </Box>
    )
    expect(output).toEqual('[{hello world}]')
  })
  it('should squash multiple nested text nodes', () => {
    const output = renderToString(
      <Box unstable__transformChildren={(str: string) => `[${str}]`}>
        <Box unstable__transformChildren={(str: string) => `{${str}}`}>
          hello
          <Text> world</Text>
        </Box>
      </Box>
    )
    expect(output).toEqual('[{hello world}]')
  })
  it('should correctly apply useState and useLayoutEffect', () => {
    const WithHooks = () => {
      const [value, setValue] = useState('Hello')

      React.useLayoutEffect(() => {
        setValue('World')
      })

      return <Color>{value}</Color>
    }
    const output = renderToString(<WithHooks />)
    expect(output).toEqual('World')
  })
})
