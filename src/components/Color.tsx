import React, { ReactNode } from 'react'
import arrify from 'arrify'
import chalk, { Chalk } from 'chalk'
import { ColorProps } from '../types'

const methods = [
  'hex',
  'hsl',
  'hsv',
  'hwb',
  'rgb',
  'keyword',
  'bgHex',
  'bgHsl',
  'bgHsv',
  'bgHwb',
  'bgRgb',
  'bgKeyword'
]

const Color = ({
  children,
  ...colorProps
}: { children?: ReactNode } & Partial<ColorProps>) => {
  if (children === '') {
    return null
  }

  const transformChildren = (children: string) => {
    Object.keys(colorProps).forEach((m: keyof ColorProps) => {
      if (colorProps[m]) {
        const c: any = chalk
        if (methods.includes(m)) {
          children = c[m](...arrify(colorProps[m]))(children)
        } else if (typeof c[m] === 'function') {
          children = c[m](children)
        }
      }
    })


    return children
  }

  return (
    <span
      style={{ flexDirection: 'row' }}
      // @ts-ignore //
      unstable__transformChildren={transformChildren}
    >
      {children}
    </span>
  )
}

export default Color
