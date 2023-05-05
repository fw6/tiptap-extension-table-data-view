<script lang="ts" context="module">
    import { createTable, getCoreRowModel, getFacetedUniqueValues, type Cell, type ColumnDef, type Row, type RowData, type TableState } from '@tanstack/table-core'

    declare module '@tanstack/table-core' {
        type CellSelectionState = Record<string, true>

        interface TableMeta<TData extends RowData> {
            updateData: (rowIndex: number, colIndex: number, value: DataType) => void

            // TODO
            // updateColumns: (colIndex: number, value: FieldConfig) => void
        }

        interface ColumnMeta<TData extends RowData, TValue> {
            field: FieldConfig
        }
    }
</script>

<script lang="ts">
    import type { Editor, NodeViewProps } from '@tiptap/core'
    import CellStub from './components/Cell.svelte'
    import { Ranges } from './features/ranges'
    import { Spanning } from './features/spanning'

    import { rangeSelection } from './actions/range-selection'
    import { columns, dataSource } from './fixtures/mock1'
    import type { DataType, FieldConfig } from './types'

    export let editor: Editor
    export let getPos: (() => number) | boolean
    export let node: NodeViewProps['node']
    export let selected = false

    type RowDataType = DataType[]
    type CellValueType = DataType

    let containerElementRef: HTMLElement
    export function forwardRef() {
        return containerElementRef
    }

    let tableState: Partial<TableState> = {
        ranges: ['A1:A1'],
        rangeAnchor: 'A1',

        columnPinning: {},
        columnOrder: [],
        columnVisibility: {},
        rowSelection: {},
    };

    let data = dataSource;

    const table = createTable<RowDataType>({
        data,
        enablePinning: false,
        columns: columns.reduce<ColumnDef<RowDataType, CellValueType>[]>((total, col, index) => {
            const columnDef: ColumnDef<RowDataType, CellValueType> = {
                accessorKey: index.toString(), // 用于从data中找到value（数组为索引，对象为key）
                id: col.fieldId,
                header: col.fieldName,
                meta: {
                    field: col,
                },
                enablePinning: false,
            }

            total.push(columnDef)
            return total
        }, []),
        state: tableState,
        onStateChange: (updater: any) => {
            if (updater instanceof Function) {
                tableState = updater(tableState)
            } else tableState = updater;

            table.setOptions(prev => ({
                ...prev,
                state: tableState,
            }));

            // rerender
            rows = table.getRowModel().rows;
            headerGroups = table.getHeaderGroups();
        },
        enableRowSelection: true,
        renderFallbackValue: '',
        getRowId: (_, idx) => idx.toString(),
        getCoreRowModel: getCoreRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
        features: [
            Ranges,
            Spanning,
        ],

        meta: {
            updateData(rowIndex, colIndex, value) {
                data = data.map((row, index) => {
                    if (index === rowIndex) {
                        row[colIndex] = value
                    }
                    return row
                })
            },
        },
    })

    let rows = table.getRowModel().rows;
    let headerGroups = table.getHeaderGroups();

    const isInvisibleCell = (cell: Cell<RowDataType, unknown>) => {
        const value = cell.getValue() as CellValueType;
        if (typeof value === 'string' && ['#.1', '#.2', '#.3'].includes(value)) {
            // 行列被合并单元格，不显示
            return true
        }

        return false
    }
</script>

<div class="table-dataview-nodeview" class:selected bind:this={containerElementRef}>
    <table class="inner-table" use:rangeSelection={{ table }} draggable={false}>
        <thead>
            {#each headerGroups as headerGroup}
                <tr>
                    {#each headerGroup.headers as header}
                        <th colSpan={header.colSpan}>
                            {#if !header.isPlaceholder}
                                {header.column.columnDef.header}
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </thead>

        <tbody>
            {#each rows as row (row.id)}
                <tr data-row-id={row.id}>
                    {#each row.getSpanningCells() as cell (cell.id)}
                        <CellStub info={cell.getContext()} />
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="postcss">
    .table-dataview-nodeview {
        &.selected {
            outline: 1px solid cyan;
        }

        .inner-table {
            width: 100%;
            margin: 0;
        }
    }
</style>
