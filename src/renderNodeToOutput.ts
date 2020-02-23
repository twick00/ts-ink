import { InkElement } from './types'
import Output from './experimental/output'
import widestLine from 'widest-line'
import { getMaxWidth, wrapText } from './textUtils'

const isAllTextNodes = node => {
  if (node.nodeName === '#text') {
    return true;
  }

  if (node.nodeName === 'SPAN') {
    if (node.textContent) {
      return true;
    }

    if (Array.isArray(node.childNodes)) {
      return node.childNodes.every(isAllTextNodes);
    }
  }

  return false;
};

const squashTextNodes = node => {
  // If parent container is `<Box>`, text nodes will be treated as separate nodes in
  // the tree and will have their own coordinates in the layout.
  // To ensure text nodes are aligned correctly, take X and Y of the first text node
  // and use them as offset for the rest of the nodes
  // Only first node is taken into account, because other text nodes can't have margin or padding,
  // so their coordinates will be relative to the first node anyway
  const offsetX = node.childNodes[0].yogaNode.getComputedLeft();
  const offsetY = node.childNodes[0].yogaNode.getComputedTop();

  let text = '\n'.repeat(offsetY) + ' '.repeat(offsetX);

  for (const childNode of node.childNodes) {
    let nodeText;

    if (childNode.nodeName === '#text') {
      nodeText = childNode.nodeValue;
    }

    if (childNode.nodeName === 'SPAN') {
      nodeText = childNode.textContent || squashTextNodes(childNode);
    }

    // Since these text nodes are being concatenated, `Output` instance won't be able to
    // apply children transform, so we have to do it manually here for each text node
    if (childNode.unstable__transformChildren) {
      nodeText = childNode.unstable__transformChildren(nodeText);
    }

    text += nodeText;
  }

  return text;
};

export const renderNodeToOutput = (
  node: InkElement,
  output: Output,
  {
    offsetX = 0,
    offsetY = 0,
    transformers = [],
    skipStaticElements
  }: {
    offsetX?: number
    offsetY?: number
    transformers?: any[]
    skipStaticElements?: boolean
  }
) => {
  if (node.unstable__static && skipStaticElements) {
    return
  }
  const {yogaNode} = node
  const x = offsetX + yogaNode.getComputedLeft()
  const y = offsetY + yogaNode.getComputedTop()
  let newTransformers = transformers;
  if (node.unstable__transformChildren) {
    newTransformers = [node.unstable__transformChildren, ...transformers];
  }

  // Nodes with only text inside
  if (node.textContent) {
    let text = node.textContent;

    // Since text nodes are always wrapped in an additional node, parent node
    // is where we should look for attributes
    if (node.parentNode.style.textWrap) {
      const currentWidth = widestLine(text);
      const maxWidth = getMaxWidth(node.parentNode.yogaNode);

      if (currentWidth > maxWidth) {
        text = wrapText(text, maxWidth, {
          textWrap: node.parentNode.style.textWrap as string
        });
      }
    }

    output.write(x, y, text, {transformers: newTransformers});
    return;
  }

  // Text nodes
  if (node.nodeName === '#text') {
    output.write(x, y, node.nodeValue, {transformers: newTransformers});
    return;
  }

  // Nodes that have other nodes as children
  if (Array.isArray(node.childNodes) && node.childNodes.length > 0) {
    const isFlexDirectionRow = node.style.flexDirection === 'row';

    if (isFlexDirectionRow && node.childNodes.every(isAllTextNodes)) {
      let text = squashTextNodes(node);

      if (node.style.textWrap) {
        const currentWidth = widestLine(text);
        const maxWidth = getMaxWidth(yogaNode);

        if (currentWidth > maxWidth) {
          text = wrapText(text, maxWidth, {
            textWrap: node.style.textWrap as string
          });
        }
      }

      output.write(x, y, text, {transformers: newTransformers});
      return;
    }

    for (const childNode of node.childNodes) {
      renderNodeToOutput(childNode, output, {
        offsetX: x,
        offsetY: y,
        transformers: newTransformers,
        skipStaticElements
      });
    }
  }
}
