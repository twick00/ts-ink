import { renderToString } from '../helpers'
import * as React from 'react'

describe('Fragment component', () => {
  it('should correctly render fragments', () => {
    const output = renderToString(<>Hello World</>)
    expect(output).toEqual('Hello World')
  })
})
