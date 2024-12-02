import type { useTable } from './TableContext';
import type { Column, ColumnAlignment } from './Table';
import { useState, useEffect } from 'react';

interface useTableGridStylesParameters<
  E extends HTMLTableCellElement = HTMLTableCellElement
> {
  elementRef: React.RefObject<E | null>;
  align?: ColumnAlignment;
  layout: ReturnType<typeof useTable>['layout'];
  columns: Array<Column>;
}

export default function useTableGridStyles<E extends HTMLTableCellElement>({
  elementRef,
  align,
  layout,
  columns
}: useTableGridStylesParameters<E>): React.CSSProperties {
  const isGridLayout = layout === 'grid';
  const [columnAlignment, setColumnAlignment] = useState<ColumnAlignment>(
    align || 'start'
  );
  const [gridColumnSpan, setGridColumnSpan] = useState<number>(1);
  const [gridRowSpan, setGridRowSpan] = useState<number>(1);

  useEffect(() => {
    if (!isGridLayout) {
      return;
    }

    const element = elementRef.current;
    const column =
      typeof columns !== 'number' && columns[element?.cellIndex ?? -1];

    if (!column) {
      setColumnAlignment(align || 'start');
    } else {
      setColumnAlignment(column.align);
    }

    if (element?.colSpan) {
      setGridColumnSpan(element.colSpan);
    } else {
      setGridColumnSpan(1);
    }

    if (element?.rowSpan) {
      setGridRowSpan(element.rowSpan);
    } else {
      setGridRowSpan(1);
    }
  }, [isGridLayout, columns, align]);

  return isGridLayout
    ? {
        textAlign: columnAlignment,
        gridColumn: gridColumnSpan > 1 ? `span ${gridColumnSpan}` : undefined,
        gridRow: gridRowSpan > 1 ? `span ${gridRowSpan}` : undefined
      }
    : {};
}
