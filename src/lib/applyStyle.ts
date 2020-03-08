import Yoga from 'yoga-layout';
import { flow } from 'lodash';
import { InkNode } from '../types'

const applyPositionStyles = ({node, style}: {node: InkNode, style: any}) => {
  if (!style.position) {
    // TODO: Make sure NaN works
    // @ts-ignore
    node.setPositionType(NaN);
  }

  if (style.position === 'absolute') {
    node.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
  }
  return {node, style}
};

const applyMarginStyles = ({node, style}: {node: InkNode, style: any}) => {
  node.setMargin(Yoga.EDGE_START, style.marginLeft || style.marginX || style.margin || 0);
  node.setMargin(Yoga.EDGE_END, style.marginRight || style.marginX || style.margin || 0);
  node.setMargin(Yoga.EDGE_TOP, style.marginTop || style.marginY || style.margin || 0);
  node.setMargin(Yoga.EDGE_BOTTOM, style.marginBottom || style.marginY || style.margin || 0);
  return {node, style}
};

const applyPaddingStyles = ({node, style}: {node: InkNode, style: any}) => {
  node.setPadding(Yoga.EDGE_LEFT, style.paddingLeft || style.paddingX || style.padding || 0);
  node.setPadding(Yoga.EDGE_RIGHT, style.paddingRight || style.paddingX || style.padding || 0);
  node.setPadding(Yoga.EDGE_TOP, style.paddingTop || style.paddingY || style.padding || 0);
  node.setPadding(Yoga.EDGE_BOTTOM, style.paddingBottom || style.paddingY || style.padding || 0);
  return {node, style}
};

const applyFlexStyles = ({node, style}: {node: InkNode, style: any}) => {
  node.setFlexGrow(style.flexGrow || 0);
  node.setFlexShrink(typeof style.flexShrink === 'number' ? style.flexShrink : 1);

  if (style.flexDirection === 'row') {
    node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
  }

  if (style.flexDirection === 'row-reverse') {
    node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW_REVERSE);
  }

  if (style.flexDirection === 'column') {
    node.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
  }

  if (style.flexDirection === 'column-reverse') {
    node.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN_REVERSE);
  }

  if (typeof style.flexBasis === 'number') {
    node.setFlexBasis(style.flexBasis);
  } else if (typeof style.flexBasis === 'string') {
    node.setFlexBasisPercent(parseInt(style.flexBasis, 10));
  } else {
    // This should be replaced with node.setFlexBasisAuto() when new Yoga release is out
    node.setFlexBasis(NaN);
  }

  if (style.alignItems === 'stretch' || !style.alignItems) {
    node.setAlignItems(Yoga.ALIGN_STRETCH);
  }

  if (style.alignItems === 'flex-start') {
    node.setAlignItems(Yoga.ALIGN_FLEX_START);
  }

  if (style.alignItems === 'center') {
    node.setAlignItems(Yoga.ALIGN_CENTER);
  }

  if (style.alignItems === 'flex-end') {
    node.setAlignItems(Yoga.ALIGN_FLEX_END);
  }

  if (style.justifyContent === 'flex-start' || !style.justifyContent) {
    node.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
  }

  if (style.justifyContent === 'center') {
    node.setJustifyContent(Yoga.JUSTIFY_CENTER);
  }

  if (style.justifyContent === 'flex-end') {
    node.setJustifyContent(Yoga.JUSTIFY_FLEX_END);
  }

  if (style.justifyContent === 'space-between') {
    node.setJustifyContent(Yoga.JUSTIFY_SPACE_BETWEEN);
  }

  if (style.justifyContent === 'space-around') {
    node.setJustifyContent(Yoga.JUSTIFY_SPACE_AROUND);
  }
  return {node, style}
};

const applyDimensionStyles = ({node, style}: {node: InkNode, style: any}) => {
  if (typeof style.width === 'number') {
    node.setWidth(style.width);
  } else if (typeof style.width === 'string') {
    node.setWidthPercent(parseInt(style.width, 10));
  } else {
    node.setWidthAuto();
  }

  if (typeof style.height === 'number') {
    node.setHeight(style.height);
  } else if (typeof style.height === 'string') {
    node.setHeightPercent(parseInt(style.height, 10));
  } else {
    node.setHeightAuto();
  }

  if (typeof style.minWidth === 'string') {
    node.setMinWidthPercent(parseInt(style.minWidth, 10));
  } else {
    node.setMinWidth(style.minWidth || 0);
  }

  if (typeof style.minHeight === 'string') {
    node.setMinHeightPercent(parseInt(style.minHeight, 10));
  } else {
    node.setMinHeight(style.minHeight || 0);
  }
  return {node, style}
};

const styleNode = flow([
  applyPositionStyles,
  applyMarginStyles,
  applyPaddingStyles,
  applyFlexStyles,
  applyDimensionStyles
])

export const applyStyle = (node: InkNode, style = {}) => {
  styleNode({node, style})
};
