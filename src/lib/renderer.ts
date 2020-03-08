import { setStyle } from './dom'
import { InkElement } from '../types'
import Yoga from 'yoga-layout'
import calculateWrappedText from '../textUtils/calculateWrappedText'
import Output from './output'
import { renderNodeToOutput } from './renderNodeToOutput'

const findStaticNode: (node: InkElement) => InkElement = node => {
  if (node.unstable__static) {
    return node
  }
  for (const childNode of node.childNodes) {
    if (childNode.unstable__static) {
      return childNode
    }
    if (
      Array.isArray(childNode.childNodes) &&
      childNode.childNodes.length > 0
    ) {
      return findStaticNode(childNode)
    }
  }
}

export default ({ terminalWidth = 100 }) => {
  return (node: InkElement) => {
    setStyle(node, {
      width: terminalWidth
    })

    node.yogaNode.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR)
    calculateWrappedText(node)
    node.yogaNode.calculateLayout(undefined, undefined, Yoga.DIRECTION_LTR)
    const output = new Output({
      width: node.yogaNode.getComputedWidth(),
      height: node.yogaNode.getComputedHeight()
    })

    renderNodeToOutput(node, output, { skipStaticElements: true })

    const staticNode = findStaticNode(node)
    let staticOutput

    if (staticNode) {
      staticOutput = new Output({
        width: staticNode.yogaNode.getComputedWidth(),
        height: staticNode.yogaNode.getComputedHeight()
      })
      renderNodeToOutput(staticNode, staticOutput, {
        skipStaticElements: false
      })
    }

    const { output: generatedOutput, height: outputHeight } = output.get()

    return {
      output: generatedOutput,
      outputHeight,
      // Newline at the end is needed, because static output doesn't have one, so
      // interactive output will override last line of static output
      staticOutput: staticOutput ? `${staticOutput.get().output}\n` : undefined
    }
  }
}
