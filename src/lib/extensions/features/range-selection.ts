/**
 * @module extensions/features/range-selection
 * @reference
 * - https://www.w3schools.com/googlesheets/google_sheets_ranges.php
 */

import { makeStateUpdater, type Cell, type Column, type OnChangeFn, type Row, type RowData, type Table, type TableFeature, type Updater } from '@tanstack/table-core';
import { nanoid } from 'nanoid';

declare module '@tanstack/table-core' {
    interface TableState extends RangeTableState { }

    interface InitialTableState extends Partial<RangeTableState> { }

    /**
     * FIXME
     * No type exports named `FeatureOptions`, temporarily using `CoreOptions` instead.
     */
    interface CoreOptions<TData extends RowData> extends RangeOptions<TData> { }

    interface Table<TData extends RowData> extends RangeInstance<TData> { }
    interface Row<TData extends RowData> extends RangeRow<TData> { }
    interface Column<TData extends RowData, TValue> extends RangeColumn<TData, TValue> { }
    interface Cell<TData extends RowData, TValue> extends RangeCell<TData, TValue> { }
}

export type RangeState = Record<string, true>;

export interface RangeTableState {
    /**
     * contains all selected cell Ids except current selecting range, once current selecting range is finished it moves to selectedCellIds
     */
    range: RangeState

    /**
     * contains cell Ids of currently selecting range. It is a state when user is currently performing range selection
     */
    currentRange: RangeState

    /**
     * State which tells whether user is performing range selection
     */
    isChangingRange: boolean
}

export interface RangeOptions<TData> {
    onRangeChange?: OnChangeFn<RangeState>
}

export interface RangeRow<TData> {
    /**
     * 判断当前行，是否有内容被选中
     */
    getIsSelected: () => boolean
}

export interface RangeColumn<TData, TValue> {
    /**
     * 返回当前列的title（用字母表表示的26进制数字，如第1列为A，第2列为B）
     */
    getTitle: () => string
}
export interface RangeCell<TData, TValue> {
    getIsSelected: () => boolean
}

export interface RangeInstance<TData extends RowData> {
    /**
     * 当前工作表唯一标识
     */
    sheetId: string

    setRangeState: (updater: Updater<RangeState>) => void
    resetRangeState: (defaultState?: boolean) => void
}

export const Range: TableFeature = {
    getInitialState: (state): RangeTableState => {
        return {
            range: {},
            currentRange: {},
            isChangingRange: false,
          ...state,
        }
    },

    getDefaultOptions: <TData extends RowData>(
        table: Table<TData>
      ): RangeOptions<TData> => {
        return {
            onRangeChange: makeStateUpdater('range', table),
        }
    },
    createTable: <TData extends RowData>(table: Table<TData>): RangeInstance<TData> => {
        return {
            sheetId: nanoid(),
            setRangeState: updater => table.options.onRangeChange?.(updater),
            resetRangeState(defaultState) {
                table.setRangeState(() => defaultState ? {} : table.initialState.range);
            },
        }
    },
    createRow: <TData extends RowData>(row: Row<TData>, table: Table<TData>): RangeRow<TData> => {
        return {
            getIsSelected() {
                return false;
            },
        };
    },
    createColumn: <TData extends RowData, TValue>(
        column: Column<TData, TValue>,
        table: Table<TData>,
    ): RangeColumn<TData, TValue> => {
        return {
            getTitle: () => {
                const index = table.getAllColumns().findIndex(col => col.id === column.id);
                return columnNumberToTitle(index);
            },
        };
    },
    createCell: <TData extends RowData, TValue>(
        cell: Cell<TData, TValue>,
        column: Column<TData, TValue>,
        row: Row<TData>,
        table: Table<TData>,
    ): RangeCell<TData, TValue> => {
        return {
            // TODO
            getIsSelected: () => false,
        }
    },
};

/**
 * A -> 1
 * B -> 2
 * C -> 3
 * ...
 * Z -> 26
 * AA -> 27
 * AB -> 28
 */
const columnNumberToTitle = (columnNumber: number) => {
    const sb = [];
    while (columnNumber !== 0) {
        columnNumber--;
        sb.push(String.fromCharCode(columnNumber % 26 + 'A'.charCodeAt(0)));
        columnNumber = Math.floor(columnNumber / 26);
    }
    return sb.reverse().join('');
}
const columnTitleToNumber = (columnTitle: string) => {
    let number = 0;
    const len = columnTitle.length;
    for (let i = 0; i < len; i++) {
        number = columnTitle[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1 + number * 26;
    }
    return number;
}
