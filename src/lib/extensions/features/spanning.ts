import type { Cell, Row, RowData, RowModel, Table, TableFeature } from "@tanstack/table-core";
import { memo } from '@tanstack/table-core';

declare module '@tanstack/table-core' {
    interface FeatureOptions<TData extends RowData> extends SpanningOptions<TData> { }

    interface Table<TData extends RowData> extends SpanningInstance<TData> { }

    interface Row<TData extends RowData> extends SpanningRow<TData> { }

    interface Cell<TData extends RowData, TValue> extends SpanningCell<TData, TValue> { }
}

interface SpanningInstance<TData extends RowData> {
    getSpanningData: () => unknown[][];
}

interface SpanningCell<TData extends RowData, TValue> {
    colSpan: number
    rowSpan: number
}
interface SpanningRow<TData extends RowData> {
    getSpanningCells: () => Cell<TData, unknown>[];
}

export interface SpanningOptions<TData> {
    enableSpanning?: boolean
}

export const Spanning: TableFeature = {
    getDefaultOptions: <TData extends RowData>(table: Table<TData>): SpanningOptions<TData> => {
        return {
            enableSpanning: false,
        }
    },

    createTable: <TData extends RowData>(table: Table<TData>): SpanningInstance<TData> => {
        return {
            getSpanningData: () => table.getRowModel().rows.map((row) => row.getAllCells().map(cell => {
                return cell.getValue();
            })),
        };
    },

    createRow: <TData extends RowData>(
        row: Row<TData>,
        table: Table<TData>
    ): SpanningRow<TData> => {
        /**
         * 1. 需要table增加option: `getRowId: (_, idx) => idx.toString()`
         */
        return {
            getSpanningCells: memo(
                () => [table.options.data, row.getAllCells()],
                (_data, allCells) => {
                    // 上一个有效的单元格，作为向左查找的目标指针
                    let left = 0;
                    // 记录右侧指针位置，用于向左查找🫱
                    let right = 0;
                    // 用于向上查找🔝
                    // let _top = row.index;

                    const cells = allCells.flatMap((cell, index) => {
                        cell.colSpan ||= 1;
                        cell.rowSpan ||= 1;

                        const cellValue = cell.getValue();
                        right = index;

                        if (cellValue === '#.1') {
                            // 左⬅️
                            const prevCell = allCells[left]

                            if (prevCell) {
                                prevCell.colSpan += 1;
                            }
                            return [];
                        } else if (cellValue === '#.2') {
                            // 上⬆️
                            let prevRowIndex = row.index;

                            while (--prevRowIndex > -1) {
                                const topRow = table.getRow(prevRowIndex.toString());
                                const topCells = topRow.getAllCells();
                                const topCell = topCells[index];
                                if (!topCell) throw new Error(`Invalid table data: cell at ${prevRowIndex} not found`);

                                if (topCell.getValue() !== '#.2') {
                                    topCell.rowSpan += 1;
                                    break;
                                }
                            }

                            return [];
                        } else if (cellValue === '#.3') {
                            // 上左⬆️⬅️
                            return [];
                        }

                        left = index;
                        return [cell];
                    })

                    // TODO
                    return cells;
                },
                {
                    key: process.env.NODE_ENV === 'production' && 'row.getSpanningCells',
                    debug: () => table.options.debugAll ?? table.options.debugRows,
                }
            ),
        }
    },
};
