import React, {
  Children,
  cloneElement,
  CSSProperties,
  HTMLProps,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';
import { FixedSizeTree as Tree } from 'react-vtree';

export interface VirtualScrollProps {
  className?: string;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
  style?: Omit<CSSProperties, 'style' | 'height'>;
  children: ReactNode;
  itemSize: number;
}

export interface VirtualScrollItemData {
  id: string;
  key: string;
  height: number;
  node: ReactElement;
  isOpenByDefault: boolean;
}

export function VirtualScroll(props: VirtualScrollProps) {
  const { children, className, style, width, height, itemSize } = props;
  const walker = useCallback(
    function* walk(refresh: boolean): Generator<VirtualScrollItemData | string, void> {
      for (const child of Children.toArray(children)) {
        const key = (child as ReactElement).key as string;

        if (key == null) {
          throw new Error();
        }

        if (refresh) {
          const item: VirtualScrollItemData = {
            id: key as string,
            key: key as string,
            height: (child as ReactElement).props.height,
            node: child as ReactElement,
            isOpenByDefault: true,
          };

          yield item;
        } else {
          yield key;
        }
      }
    },
    [children],
  );

  return (
    <Tree<VirtualScrollItemData>
      width={width}
      height={height}
      itemSize={itemSize}
      treeWalker={walker}
      className={className}
      style={style}
    >
      {Node}
    </Tree>
  );
}

const Node = (props: { data: VirtualScrollItemData; style?: CSSProperties }) => {
  const {
    data: { node },
    style,
  } = props;

  return cloneElement(node, {
    style: {
      ...node.props.style,
      ...style,
    },
  });
};

interface VirtualScrollItemProps extends HTMLProps<HTMLDivElement> {
  key: string | number;
  children: ReactNode;
  className?: string;
}

export function VirtualScrollItem({
  className,
  style,
  children,
  ...props
}: VirtualScrollItemProps) {
  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
}
