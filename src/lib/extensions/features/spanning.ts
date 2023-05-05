import type { Cell, Row, RowData, RowModel, Table, TableFeature } from "@tanstack/table-core";
import { memo } from '@tanstack/table-core';

declare module '@tanstack/table-core' {
    interface FeatureOptions<TData extends RowData> extends SpanningOptions<TData> { }

    interface Row<TData extends RowData> extends SpanningRow<TData> { }

    interface Cell<TData extends RowData, TValue> extends SpanningCell<TData, TValue> { }
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

    createRow: <TData extends RowData>(
        row: Row<TData>,
        table: Table<TData>
    ): SpanningRow<TData> => {
        return {
            getSpanningCells: memo(
                () => [row.getAllCells()],
                (allCells) => {
                    allCells.forEach(cell => {
                        const colSpan = 0;
                        const rowSpan = 0;
                        const cellValue = cell.getValue();

                        console.log('cellValue', cellValue, cell.getTitle());

                        // const { } = cell.colSpan;
                    })

                    // TODO
                    return allCells;
                },
                {
                    key: process.env.NODE_ENV === 'production' && 'row.getSpanningCells',
                    debug: () => table.options.debugAll ?? table.options.debugRows,
                }
            ),
        }
    },
};
