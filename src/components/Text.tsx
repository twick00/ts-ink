import React from 'react'
import chalk from 'chalk'

const Text = ({
  bold,
  italic,
  underline,
  strikethrough,
  children,
  _unstable__transformChildren
}: {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  children: any
  _unstable__transformChildren: (children: any) => any
}) => {
  const transformChildren = (children: string) => {
    if (bold) {
      children = chalk.bold(children)
    }

    if (italic) {
      children = chalk.italic(children)
    }

    if (underline) {
      children = chalk.underline(children)
    }

    if (strikethrough) {
      children = chalk.strikethrough(children)
    }

    if (_unstable__transformChildren) {
      children = _unstable__transformChildren(children)
    }

    return children
  }

  return (
    <span
      style={{ flexDirection: 'row' }}
  // @ts-ignore
      _unstable__transformChildren={transformChildren}
    >
      {children}
    </span>
  )
}

Text.defaultProps = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  _unstable__transformChildren: undefined
}

export default Text
