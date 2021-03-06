import measureText from './measureText';
import wrapText from './wrapText';
import getMaxWidth from './getMaxWidth';
import { InkElement } from '../types'

// Since we need to know the width of text container to wrap text, we have to calculate layout twice
// This function is executed after first layout calculation to reassign width and height of text nodes
const calculateWrappedText = (node: InkElement) => {
  if (node.textContent && typeof node.parentNode.style.textWrap === 'string') {
    const {yogaNode} = node;
    const parentYogaNode = node.parentNode.yogaNode;
    const maxWidth = getMaxWidth(parentYogaNode);
    const currentWidth = yogaNode.getComputedWidth();

    if (currentWidth > maxWidth) {
      const {textWrap} = node.parentNode.style;
      const wrappedText = wrapText(node.textContent, maxWidth, {textWrap});
      const {width, height} = measureText(wrappedText);

      yogaNode.setWidth(width);
      yogaNode.setHeight(height);
    }

    return;
  }

  if (Array.isArray(node.childNodes) && node.childNodes.length > 0) {
    for (const childNode of node.childNodes) {
      calculateWrappedText(childNode);
    }
  }
};

export default calculateWrappedText;
