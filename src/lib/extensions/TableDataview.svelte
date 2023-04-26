<script lang="ts" context="module">
    import { createTable, getCoreRowModel, getFacetedUniqueValues, type Cell, type CellContext, type ColumnDef, type Header, type RowData, type RowSelectionState, type TableState } from '@tanstack/table-core'

    declare module '@tanstack/table-core' {
        interface ColumnMeta<TData extends RowData, TValue> {
            field: FieldConfig
        }
    }
</script>

<script lang="ts">
    import type { Editor, NodeViewProps } from '@tiptap/core'
    import type { ComponentType } from 'svelte'

    import CellStub from './components/CellStub.svelte'

    import { columns, dataSource } from './fixtures/mock1'
    import type { FieldConfig } from './types'
    import type { DataType } from './types/data'

    export let editor: Editor
    export let getPos: (() => number) | boolean
    export let node: NodeViewProps['node']
    export let selected = false

    type RowDataType = DataType[]
    type CellValueType = DataType

    let ref: HTMLElement
    export function forwardRef() {
        return ref
    }

    let rowSelection: RowSelectionState = {}

    let table = createTable({
        data: dataSource,
        enablePinning: false,
        columns: columns.reduce<ColumnDef<RowDataType, CellValueType>[]>((total, col, index) => {
            const columnDef: ColumnDef<RowDataType, CellValueType> = {
                accessorKey: index.toString(), // 用于从data中找到value（数组为索引，对象为key）
                id: col.fieldId,
                header: col.fieldName,
                meta: {
                    field: col,
                },
                // cell: (info) => {
                //     return info.getValue()
                // },
                enablePinning: false,
            }

            total.push(columnDef)
            return total
        }, []),
        state: {
            columnPinning: {},
            columnOrder: [],
            columnVisibility: {},
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            if (typeof updater === 'function') {
                updater(rowSelection)
            } else rowSelection = updater
        },
        renderFallbackValue: '',
        onStateChange: () => {
            console.log('onStateChange')
        },
        getCoreRowModel: getCoreRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    })

    const isInvisibleCell = (cell: Cell<RowDataType, CellValueType>) => {
        const value = cell.getValue()
        if (typeof value === 'string' && ['#.1', '#.2', '#.3'].includes(value)) {
            // 行列被合并单元格，不显示
            return true
        }

        return false
    }

    $: {
        // TODO: let table reactive
        // table.setOptions((prev) => ({
        //     ...prev,
        //     data: dataSource,
        //     columns: getColumns(columns),
        // }))
        // table = table
    }
</script>

<div class="table-dataview-nodeview" class:selected bind:this={ref}>
    <table class="inner-table">
        <thead>
            {#each table.getHeaderGroups() as headerGroup}
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
            {#each table.getRowModel().rows as row}
                <tr>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        {#if !isInvisibleCell(cell)}
                            <CellStub info={cell.getContext()} />
                        {/if}
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
