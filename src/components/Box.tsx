/* eslint-disable camelcase */
import React, { PureComponent, ReactNode } from 'react'

type BoxProps = {
  margin?: number
  marginX?: number
  marginY?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  padding?: number
  paddingX?: number
  paddingY?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  width?: number
  minWidth?: number
  height?: number
  minHeight?: number
  flexGrow?: number
  flexShrink?: number
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  flexBasis?: number | string
  alignItems?: 'stretch' | 'flex-start' | 'center' | 'flex-end'
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
  textWrap?:
    | 'wrap'
    | 'truncate'
    | 'truncate-start'
    | 'truncate-middle'
    | 'truncate-end'
  unstable__transformChildren?: Function
  children?: ReactNode
}

const Box = (props: BoxProps) => {
  const { children, unstable__transformChildren, ...style } = props
  const nodeRef = React.useRef()

  return (
    <div
      ref={nodeRef}
      style={style}
      // @ts-ignore
      unstable__transformChildren={unstable__transformChildren}
    >
      {children}
    </div>
  )
}

Box.defaultProps = {
  flexDirection: 'row',
  flexGrow: 0,
  flexShrink: 1
}

export default Box