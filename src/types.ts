import { Chalk } from 'chalk'
import { YogaNode } from 'yoga-layout'
import { ReadStream, WriteStream } from 'tty'


export type InkNode = YogaNode

export type InkStyle = {
  width?: number
  height?: number
} & { [key in string]: string | symbol | object | number }

export interface InkElement {
  unstable__static?: unknown //Probably not necessary anymore
  unstable__transformChildren?: Function
  nodeName: string
  nodeValue?: string
  yogaNode: InkNode
  childNodes?: InkElement[]
  style: InkStyle
  attributes?: { [key in string]: string | symbol | object | boolean }
  textContent?: string | null
  parentNode?: InkElement | null
}

export type InkRootElement = InkElement & {
  isStaticDirty?: boolean
  onImmediateRender?: () => void
  onRender?: () => void
}

export interface Options {
  debug?: boolean
  exitOnCtrlC?: boolean
  onRender?: Function
  stdout?: WriteStream
  stdin?: ReadStream
  write?: Function
}

export type ColorPropMethods = {
  hsl: (args: [number, number, number]) => Chalk
  hsv: (args: [number, number, number]) => Chalk
  hwb: (args: [number, number, number]) => Chalk
  rgb: (args: [number, number, number]) => Chalk
  bgHsl: (args: [number, number, number]) => Chalk
  bgHsv: (args: [number, number, number]) => Chalk
  bgHwb: (args: [number, number, number]) => Chalk
  bgRgb: (args: [number, number, number]) => Chalk
  hex: (args: [string]) => Chalk
  keyword: (args: [string]) => Chalk
  bgHex: (args: [string]) => Chalk
  bgKeyword: (args: [string]) => Chalk
}

export type ColorProps = {
  hsl?: [number, number, number]
  hsv?: [number, number, number]
  hwb?: [number, number, number]
  rgb?: [number, number, number]
  bgHsl?: [number, number, number]
  bgHsv?: [number, number, number]
  bgHwb?: [number, number, number]
  bgRgb?: [number, number, number]
  hex?: string
  keyword?: string
  bgHex?: string
  bgKeyword?: string
  bold?: boolean
  dim?: boolean
  italic?: boolean
  underline?: boolean
  inverse?: boolean
  hidden?: boolean
  strikethrough?: boolean
  visible?: boolean
  black?: boolean
  red?: boolean
  green?: boolean
  yellow?: boolean
  blue?: boolean
  magenta?: boolean
  cyan?: boolean
  white?: boolean
  gray?: boolean
  grey?: boolean
  blackBright?: boolean
  redBright?: boolean
  greenBright?: boolean
  yellowBright?: boolean
  blueBright?: boolean
  magentaBright?: boolean
  cyanBright?: boolean
  whiteBright?: boolean
  bgBlack?: boolean
  bgRed?: boolean
  bgGreen?: boolean
  bgYellow?: boolean
  bgBlue?: boolean
  bgMagenta?: boolean
  bgCyan?: boolean
  bgWhite?: boolean
  bgGray?: boolean
  bgGrey?: boolean
  bgBlackBright?: boolean
  bgRedBright?: boolean
  bgGreenBright?: boolean
  bgYellowBright?: boolean
  bgBlueBright?: boolean
  bgMagentaBright?: boolean
  bgCyanBright?: boolean
  bgWhiteBright?: boolean
}