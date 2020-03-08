import React, { ReactNode } from 'react'

type StaticProps = {
  children?: ReactNode
  [key: string]: any
}

const childrenToArray = (children: ReactNode) =>
  Array.isArray(children) ? children : [children]

const Static = ({ children, ...otherProps }: StaticProps) => {
  const [lastIndex, setLastIndex] = React.useState<null | number>(null)

  React.useEffect(() => {
    saveLastIndex(children)
  }, [children, otherProps])

  const saveLastIndex = (children: ReactNode) => {
    const nextIndex = React.Children.count(children)
    if (lastIndex !== nextIndex) {
      setLastIndex(nextIndex)
    }
  }
  let newChildren = childrenToArray(children).slice(lastIndex)
  if (typeof lastIndex === 'number') {
    newChildren = childrenToArray(children).slice(lastIndex)
  }

  return (
    <div
      // @ts-ignore
      _unstable__static={true}
      style={{
        position: 'absolute',
        flexDirection: 'column',
        ...otherProps
      }}
    >
      {newChildren}
    </div>
  )
}
export default Static