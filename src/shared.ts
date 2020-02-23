import { ReadStream, WriteStream } from 'tty'
import { ReactChildren } from 'react'


export interface Options {
  debug?: boolean
  children?: ReactChildren
  exitOnCtrlC?: boolean
  experimental?: boolean
  onRender?: Function
  stdout?: WriteStream
  stdin?: ReadStream
  write?: Function
}

export function stubFunction(...all): any {
  console.log(all)
  throw new Error('HEY DUMMY, FIX ME')
}

export function assertDefined(value) {
  if(!value) {
    throw new Error('YO, THATS UNDEFINED')
  }
  return true
}