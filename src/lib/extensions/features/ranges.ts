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

    interface FeatureOptions<TData extends RowData> extends RangeOptions<TData> { }

    interface Table<TData extends RowData> extends RangeInstance<TData> { }
    interface Row<TData extends RowData> extends RangeRow<TData> { }
    interface Column<TData extends RowData, TValue> extends RangeColumn<TData, TValue> { }
    interface Cell<TData extends RowData, TValue> extends RangeCell<TData, TValue> { }
}

export interface RangeTableState {
    /**
     * Ranges are represented in A1 notation.
     */
    ranges: string[]

    rangeAnchor: string;

    isEditingRangeAnchor: boolean;
}

export interface RangeOptions<TData> {
    onRangesChange?: OnChangeFn<string[]>
    onRangeAnchorChange?: OnChangeFn<string>
}

export interface RangeRow<TData> {
    /**
     * 判断当前行，是否有内容被选中
     */
    getIsInRange: () => boolean

    /**
     * 返回当前行的title（第1行为1，第2行为2）
     */
    getTitle: () => string;
}

export interface RangeColumn<TData, TValue> {
    /**
     * 返回当前列的title（用字母表表示的26进制数字，如第1列为A，第2列为B）
     */
    getTitle: () => string

    getIsInRange: () => boolean
}
export interface RangeCell<TData, TValue> {
    getIsInRange: () => boolean
    getTitle: () => string
    getIsRangeAnchor: () => boolean;
    getIsRangeLast: () => boolean;
    getIsEditingRangeAnchor: () => boolean;
}

export interface RangeInstance<TData extends RowData> {
    /**
     * 当前工作表唯一标识
     */
    sheetId: string

    setRangesState: (ranges: string[]) => void
    resetRangesState: (defaultState?: boolean) => void

    setRangeAnchorState: (updater: Updater<string>) => void

    __cache: Record<string, any>;
}

const defaultRanges = ['A1:A1'];
const rangeReg = new RegExp(`^([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)$`);

export const Ranges: TableFeature = {
    getInitialState: (state): RangeTableState => {
        return {
            ranges: defaultRanges,
            rangeAnchor: 'A1',
            isEditingRangeAnchor: false,
            ...state,
        }
    },

    getDefaultOptions: <TData extends RowData>(
        table: Table<TData>
      ): RangeOptions<TData> => {
        return {
            onRangesChange: makeStateUpdater('ranges', table),
            onRangeAnchorChange: makeStateUpdater('rangeAnchor', table),
        }
    },
    createTable: <TData extends RowData>(table: Table<TData>): RangeInstance<TData> => {
        const _swapRange = (range: string) => {
            if (table.__cache.rangeSwapMap[range]) return table.__cache.rangeSwapMap[range] as string;

            const execArr = rangeReg.exec(range)
            if (!execArr) throw new Error('range format error')

            const [, startColumn, startRow, endColumn, endRow] = execArr;

            const startColumnNumber = columnTitleToNumber(startColumn);
            const endColumnNumber = columnTitleToNumber(endColumn);
            const startRowNumber = parseInt(startRow);
            const endRowNumber = parseInt(endRow);
            let newRange: string | undefined;

            if (startColumnNumber <= endColumnNumber && startRowNumber <= endRowNumber) {
                newRange = range;
            }
            else if (startColumnNumber >= endColumnNumber && startRowNumber > endRowNumber) {
                newRange = `${endColumn}${endRow}:${startColumn}${startRow}`;
            }
            else if (startColumnNumber < endColumnNumber && startRowNumber > endRowNumber) {
                newRange = `${startColumn}${endRow}:${endColumn}${startRow}`;
            }
            else if (startColumnNumber > endColumnNumber && startRowNumber <= endRowNumber) {
                newRange = `${endColumn}${startRow}:${startColumn}${endRow}`;
            }

            table.__cache.rangeSwapMap[range] = newRange || range;
            return table.__cache.rangeSwapMap[range] as string;
        }

        return {
            __cache: {},
            sheetId: nanoid(),

            setRangesState: ranges => {
                if (!table.__cache.rangeSwapMap) table.__cache.rangeSwapMap = {};

                const newRanges = ranges.map(_swapRange);

                table.options.onRangesChange?.(newRanges);
            },
            resetRangesState(defaultState) {
                table.setRangesState(defaultState ? defaultRanges : table.initialState.ranges);
            },

            setRangeAnchorState: updater => table.options.onRangeAnchorChange?.(updater),
        }
    },
    createRow: <TData extends RowData>(row: Row<TData>, table: Table<TData>): RangeRow<TData> => {
        return {
            getTitle() {
                return (row.index + 1).toString();
            },
            getIsInRange() {
                const ranges = table.getState().ranges
                if (!ranges) return false;
                const rowTitle = row.getTitle();
                const rowReg = new RegExp(`^([A-Z]+)(${rowTitle})$`);
                if (!table.__cache.cellsInRange) table.__cache.cellsInRange = {};

                return ranges.some(r => {
                    if (!table.__cache.cellsInRange[r]) {
                        table.__cache.cellsInRange[r] = cellsInRange(r);
                    }

                    return (table.__cache.cellsInRange[r] as string[]).some(c => rowReg.test(c));
                });
            },
        };
    },
    createColumn: <TData extends RowData, TValue>(
        column: Column<TData, TValue>,
        table: Table<TData>,
    ): RangeColumn<TData, TValue> => {
        return {
            getTitle: () => {
                if (!table.__cache.columnTitleMap) table.__cache.columnTitleMap = {};
                const index = table.getAllColumns().findIndex(col => col.id === column.id);

                if (!table.__cache.columnTitleMap[index]) {
                    table.__cache.columnTitleMap[index] = columnNumberToTitle(index + 1);
                }

                return table.__cache.columnTitleMap[index] as string;
            },

            getIsInRange: () => {
                const ranges = table.getState().ranges
                if (!ranges) return false;
                const colTitle = column.getTitle();
                const colReg = new RegExp(`^(${colTitle})([1-9]\\d*)$`);

                if (!table.__cache.cellsInRange) table.__cache.cellsInRange = {};

                return ranges.some(r => {
                    if (!table.__cache.cellsInRange[r]) {
                        table.__cache.cellsInRange[r] = cellsInRange(r);
                    }

                    return (table.__cache.cellsInRange[r] as string[]).some(c => colReg.test(c));
                });
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
            getTitle() {
                return column.getTitle() + row.getTitle();
            },
            getIsRangeAnchor() {
                const state = table.getState();
                const cellTitle = cell.getTitle();

                return cellTitle === state.rangeAnchor;
            },
            getIsInRange: () => {
                const ranges = table.getState().ranges;
                if (!ranges) return false;
                const cellTitle = cell.getTitle();

                if (!table.__cache.cellsInRange) table.__cache.cellsInRange = {};

                return ranges.some(r => {
                    if (!table.__cache.cellsInRange[r]) {
                        table.__cache.cellsInRange[r] = cellsInRange(r);
                    }

                    return (table.__cache.cellsInRange[r] as string[]).some(c => c === cellTitle);
                });
            },
            getIsRangeLast: () => {
                const ranges = table.getState().ranges;
                if (!ranges) return false;
                const cellTitle = cell.getTitle();
                return ranges.some(r => {
                    const [_, last] = r.split(':');
                    return last === cellTitle;
                });
            },
            getIsEditingRangeAnchor: () => {
                return cell.getIsRangeAnchor() && table.getState().isEditingRangeAnchor;
            },
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

const cellsInRange = (range: string) => {
    const execArr = rangeReg.exec(range);
    if (!execArr) return [];
    const res = [];
    const [, startColumn, startRow, endColumn, endRow] = execArr;
    const startColumnNumber = columnTitleToNumber(startColumn);
    const endColumnNumber = columnTitleToNumber(endColumn);
    const startRowNumber = parseInt(startRow);
    const endRowNumber = parseInt(endRow);
    for (let i = startColumnNumber; i <= endColumnNumber; i++) {
        for (let j = startRowNumber; j <= endRowNumber; j++) {
            res.push(columnNumberToTitle(i) + j);
        }
    }
    return res;
}
