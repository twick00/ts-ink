import { InkNode } from '../types'

export default function(yogaNode: InkNode) {
  // TODO: Check what this returns with undefined
  // https://github.com/vadimdemedes/ink/blob/master/src/get-max-width.js
  return (
    yogaNode.getComputedWidth() - yogaNode.getComputedPadding(undefined) * 2
  )
}
