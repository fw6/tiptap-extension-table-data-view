<script lang="ts" context="module">
    import { createTable, getCoreRowModel, getFacetedUniqueValues, type Cell, type ColumnDef, type RowData, type RowSelectionState } from '@tanstack/table-core'

    declare module '@tanstack/table-core' {
        type CellSelectionState = Record<string, true>

        interface ColumnMeta<TData extends RowData, TValue> {
            field: FieldConfig
        }

        interface TableState {
            /**
             * contains all selected cell Ids except current selecting range, once current selecting range is finished it moves to selectedCellIds
             */
            selectedCellIds: CellSelectionState
            /**
             * contains cell Ids of currently selecting range. It is a state when user is currently performing range selection
             */
            currentSelectedCellIds: CellSelectionState
            /**
             * State which tells whether user is performing range selection
             */
            isSelectingCells: boolean
        }
    }
</script>

<script lang="ts">
    import type { Editor, NodeViewProps } from '@tiptap/core'
    import { debounce } from 'lodash-es'
// import Selecto from 'selecto'

    import CellStub from './components/Cell.svelte'
    import { Range as RangeFeature } from './features/range-selection'

    import { onMount } from 'svelte'
    import type { Action } from 'svelte/action'
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
            selectedCellIds: {},
            currentSelectedCellIds: {},
            isSelectingCells: false,
            columnPinning: {},
            columnOrder: [],
            columnVisibility: {},
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: (updater) => {
            if (typeof updater === 'function') {
                rowSelection = updater(rowSelection)
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
        features: [
            RangeFeature,
        ],
    })

    $: {
        console.log('rowSelection:', rowSelection)
    }

    const isInvisibleCell = (cell: Cell<RowDataType, CellValueType>) => {
        const value = cell.getValue()
        if (typeof value === 'string' && ['#.1', '#.2', '#.3'].includes(value)) {
            // 行列被合并单元格，不显示
            return true
        }

        return false
    }

    onMount(() => {
        // const selecto = new Selecto({
        //     keyContainer: containerElementRef,
        //     dragContainer: containerElementRef,
        //     selectableTargets: [
        //         () => [...containerElementRef.querySelectorAll<HTMLTableCellElement>('table tbody tr td')]
        //     ],
        //     hitRate: 0,
        //     selectByClick: true,
        //     selectFromInside: true,
        //     continueSelect: false,
        //     continueSelectWithoutDeselect: true,
        //     toggleContinueSelect: 'shift',
        //     toggleContinueSelectWithoutDeselect: [['ctrl', 'meta']],
        //     ratio: 0,
        // })
        // selecto.on('select', (e) => {
        //     e.added.forEach((el, i) => {
        //         el.classList.add('selected')
        //         if (i === 0) el.classList.add('selected-first')
        //     })
        //     e.removed.forEach((el) => {
        //         el.classList.remove('selected')
        //         el.classList.remove('selected-first')
        //     })
        // });
    })

    const events: Action<HTMLTableElement> = (tableEle) => {
        let selecting = false;
        console.log(table._features);
        const findClosestCell = (target: Element) => {
            if (target.tagName === 'TD') return target as HTMLTableCellElement
            return target.closest('td')
        }

        const clearSelection = () => {
            tableEle.querySelectorAll('td.selected').forEach((el) => {
                el.classList.remove('selected')
                el.classList.remove('selected-first')
            })
        }

        const handleMousedown = (e: MouseEvent) => {
            clearSelection();
            selecting = true;
            const startElement = document.elementFromPoint(e.x, e.y);
            const startCell = startElement && findClosestCell(startElement);
            console.log('start:', startCell);

            if (startCell) {
                const column = table.getColumn(startCell.dataset.columnId!)!;
                const row = table.getRow(startCell.dataset.rowId!);
                console.log(column.getTitle() + row.index + 1);

                startCell.classList.add('selected');
            }
        }
        const handleMouseup = (e: MouseEvent) => {
            selecting = false;
            const endElement = document.elementFromPoint(e.x, e.y);
            const endCell = endElement && findClosestCell(endElement);
            console.log('end:', endCell);
            if (endCell) endCell.classList.toggle('selected');
        }
        const handleMousemove = debounce((e: MouseEvent) => {
            if (!selecting) return;
            const endElement = document.elementFromPoint(e.x, e.y);
            const endCell = endElement && findClosestCell(endElement);
            console.log('move:', endCell);
            if (endCell) endCell.classList.toggle('selected');
        }, 100)

        tableEle.addEventListener('mousedown', handleMousedown);
        tableEle.addEventListener('mousemove', handleMousemove);
        tableEle.addEventListener('mouseup', handleMouseup);

        return {
            destroy() {
                tableEle.removeEventListener('mousedown', handleMousedown);
                tableEle.removeEventListener('mousemove', handleMousemove);
                tableEle.removeEventListener('mouseup', handleMouseup);
            },
        }
    };
</script>

<div class="table-dataview-nodeview" class:selected bind:this={containerElementRef}>
    <table class="inner-table" use:events draggable={false}>
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
            {#each table.getRowModel().rows as row (row.id)}
                <tr data-row-id={row.id} class:selected={rowSelection[row.index]}>
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

            tbody {
                tr.selected {
                    background-color: red;
                }
            }
        }
    }
</style>
