import Yoga from 'yoga-layout'
import { measureText } from '../textUtils'
import { applyStyle } from './applyStyle'
import { InkElement, InkStyle } from '../types'
import { isString } from 'lodash'
import { assertDefined } from '../shared'
import { RenderInstance } from '../instance'

// Helper utilities implementing some common DOM methods to simplify reconciliation code
export const createNode: (tagName: string) => InkElement = tagName => ({
  nodeName: tagName.toUpperCase(),
  style: {},
  attributes: {},
  childNodes: [],
  parentNode: null,
  textContent: null,
  yogaNode: Yoga.Node.create()
})

export const appendChildNode = (node: InkElement, childNode: InkElement) => {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode)
  }

  childNode.parentNode = node

  node.childNodes.push(childNode)
  node.yogaNode.insertChild(childNode.yogaNode, node.yogaNode.getChildCount())
}

export const insertBeforeNode = (
  node: InkElement,
  newChildNode: InkElement,
  beforeChildNode: InkElement
) => {
  if (newChildNode.parentNode) {
    removeChildNode(newChildNode.parentNode, newChildNode)
  }

  newChildNode.parentNode = node

  const index = node.childNodes.indexOf(beforeChildNode)
  if (index >= 0) {
    node.childNodes.splice(index, 0, newChildNode)
    node.yogaNode.insertChild(newChildNode.yogaNode, index)
    return
  }

  node.childNodes.push(newChildNode)
  node.yogaNode.insertChild(
    newChildNode.yogaNode,
    node.yogaNode.getChildCount()
  )
}

export const removeChildNode = (node: InkElement, removeNode: InkElement) => {
  removeNode.parentNode.yogaNode.removeChild(removeNode.yogaNode)
  removeNode.parentNode = null

  const index = node.childNodes.indexOf(removeNode)
  if (index >= 0) {
    node.childNodes.splice(index, 1)
  }
}

export const setStyle = (node: InkElement, style: InkStyle) => {
  node.style = style
  applyStyle(node.yogaNode, style)
}

export const setAttribute = (node: InkElement, key, value) => {
  node.attributes[key] = value
}

export const createTextNode = text => {
  const node = {
    nodeName: '#text',
    style: {},
    nodeValue: text,
    yogaNode: Yoga.Node.create()
  }

  setTextContent(node, text)

  return node
}

export const setTextContent = (node: InkElement, input: unknown) => {
  const text = !isString(input) ? String(input) : input

  let width = 0
  let height = 0

  if (text.length > 0) {
    const dimensions = measureText(text)
    width = dimensions.width
    height = dimensions.height
  }

  if (node.nodeName === '#text') {
    node.nodeValue = text
    node.yogaNode.setWidth(width)
    node.yogaNode.setHeight(height)
  } else {
    node.textContent = text

    node.yogaNode.setWidth((node.style.width as number) || width)
    node.yogaNode.setHeight((node.style.height as number) || height)
  }
}
