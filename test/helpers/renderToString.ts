import { render } from '../../src'
import { WriteStream } from 'tty'
import { ReactElement } from 'react'

// Fake process.stdout
class Stream implements Partial<WriteStream> {
  output: string
  columns: number
  constructor({columns}: {columns?: number}) {
    this.output = '';
    this.columns = columns || 100;
  }


  write(str: string): boolean
  write(str: string, encoding?: string): boolean
  write(str: string, encoding?: string, cb?: Function): boolean {
    this.output = str;
    return true
  }

  get() {
    return this.output;
  }
}
const renderToString = (node: ReactElement|any, {columns}: {columns?: number} = {}) => {
  const stream = new Stream({columns});

  render(node, {
    stdout: stream,
    debug: true,
    experimental: true
  });

  return stream.get();
};

export default renderToString