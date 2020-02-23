import { YogaNode } from 'yoga-layout'

export type InkNode = YogaNode

export type InkStyle = {
  width?: number
  height?: number
} & { [key in string]: string | symbol | object | number }

export interface InkElement {
  unstable__static?: unknown //Probably not necessary anymore
  unstable__transformChildren?: unknown
  nodeName: string
  nodeValue?: string | unknown
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
