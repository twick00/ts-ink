import ReactReconciler, { HostConfig } from 'react-reconciler'
import {
  appendChildNode,
  createNode,
  createTextNode,
  insertBeforeNode,
  removeChildNode,
  setAttribute,
  setStyle,
  setTextContent
} from './dom'
import { isNumber, isString } from 'lodash'
import { InkElement, InkRootElement } from '../types'

type Props = {
  children: any
  style: object
} & { [key in string]: any }

type InkHostConfig = HostConfig<
  string,
  Props,
  InkRootElement,
  InkElement,
  Pick<InkElement, 'style' | 'nodeName' | 'nodeValue' | 'yogaNode'>,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

const NO_CONTEXT = true

const inkHostConfig: InkHostConfig = {
  appendChild: appendChildNode,
  appendChildToContainer: appendChildNode,
  appendInitialChild: appendChildNode,
  cancelDeferredCallback: () => {},
  clearTimeout: () => {},
  commitTextUpdate(node, oldText, newText) {
    setTextContent(node, newText)
  },
  commitUpdate: (node, updatePayload, type, oldProps, newProps) => {
    for (const [key, value] of Object.entries(newProps)) {
      if (key === 'children') {
        if (typeof value === 'string' || typeof value === 'number') {
          if (type === 'div') {
            // Text node must be wrapped in another node, so that text can be aligned within container
            // If there's no such node, a new one must be created
            if (node.childNodes.length === 0) {
              const textNode = createNode('div');
              setTextContent(textNode, value);
              appendChildNode(node, textNode);
            } else {
              setTextContent(node.childNodes[0], value);
            }
          }

          if (type === 'span') {
            setTextContent(node, value);
          }
        }
      } else if (key === 'style') {
        setStyle(node, value);
      } else if (key === 'unstable__transformChildren') {
        node.unstable__transformChildren = value; // eslint-disable-line camelcase
      } else if (key === 'unstable__static') {
        node.unstable__static = true; // eslint-disable-line camelcase
      } else {
        setAttribute(node, key, value);
      }
    }
  },
  createInstance: (type, newProps) => {
    const node = createNode(type)

    for (const [key, value] of Object.entries(newProps)) {
      if (key === 'children') {
        if (typeof value === 'string' || typeof value === 'number') {
          if (type === 'div') {
            // Text node must be wrapped in another node, so that text can be aligned within container
            const textNode = createNode('div')
            setTextContent(textNode, value)
            appendChildNode(node, textNode)
          }

          if (type === 'span') {
            setTextContent(node, value)
          }
        }
      } else if (key === 'style') {
        setStyle(node, value)
      } else if (key === 'unstable__transformChildren') {
        node.unstable__transformChildren = value // eslint-disable-line camelcase
      } else if (key === 'unstable__static') {
        node.unstable__static = true // eslint-disable-line camelcase
      } else {
        setAttribute(node, key, value)
      }
    }

    return node
  },
  createTextInstance: createTextNode,
  finalizeInitialChildren: (node, type, props, rootNode) => {
    if (node.unstable__static) {
      rootNode.isStaticDirty = true
    }
    return undefined
  },
  resetTextContent(instance: InkElement): void {
    if (instance.textContent) {
      instance.textContent = ''
    }

    if (instance.childNodes.length > 0) {
      for (const childNode of instance.childNodes) {
        removeChildNode(instance, childNode)
      }
    }
  },
  getChildHostContext: () => NO_CONTEXT,
  getPublicInstance: instance => instance,
  getRootHostContext: () => NO_CONTEXT,
  insertBefore: insertBeforeNode,
  insertInContainerBefore: insertBeforeNode,
  isPrimaryRenderer: true,
  noTimeout: () => {},
  now: Date.now,
  prepareForCommit: () => {},
  prepareUpdate: (node, type, oldProps, newProps, rootNode) => {
    if (node.unstable__static) {
      rootNode.isStaticDirty = true
    }
    return true
  },
  removeChild: removeChildNode,
  removeChildFromContainer: removeChildNode,
  resetAfterCommit: rootNode => {
    if (rootNode.isStaticDirty) {
      rootNode.isStaticDirty = false
      rootNode.onImmediateRender()
      return
    }
    rootNode.onRender()
  },
  scheduleDeferredCallback: () => {},
  setTimeout: () => {},
  shouldDeprioritizeSubtree: (type, nextProps) => {
    return !!nextProps.hidden
  },
  shouldSetTextContent: (type, props) => {
    return (
      typeof props.children === 'string' || typeof props.children === 'number'
    )
  },
  supportsHydration: false,
  supportsMutation: true,
  supportsPersistence: false
}
export default ReactReconciler(inkHostConfig)
