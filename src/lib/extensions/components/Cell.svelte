<script lang="ts">
    import type { CellContext } from '@tanstack/table-core'
    import type { ComponentType, SvelteComponentTyped } from 'svelte'
    import { fade } from 'svelte/transition'

    import { FIELD_TYPE, type DataType, type FieldConfig } from '../types'
    import { AutoSerialField, DatetimeField, NumberField, TextField } from './CellFields'

    export let info: CellContext<DataType[], DataType>

    let component: ComponentType<
        SvelteComponentTyped<{
            info: CellContext<DataType[], DataType>
            editing: boolean
        }>
    > | null = null

    let field: FieldConfig | undefined
    $: {
        field = info.column.columnDef.meta?.field
        if (field) {
            switch (field.type) {
                case FIELD_TYPE.AUTO_SERIAL:
                    component = AutoSerialField
                    break
                case FIELD_TYPE.TEXT:
                    component = TextField
                    break
                case FIELD_TYPE.NUMBER:
                    component = NumberField
                    break
                case FIELD_TYPE.DATETIME:
                    component = DatetimeField
                    break
                case FIELD_TYPE.SINGLE_SELECT:
                case FIELD_TYPE.MULTI_SELECT:
                case FIELD_TYPE.CHECKBOX:
                case FIELD_TYPE.USER:
                case FIELD_TYPE.PHONE_NUMBER:
                case FIELD_TYPE.EMAIL:
                case FIELD_TYPE.HYPER_LINK:
                default:
                    console.warn('Not implemented')
                    component = null
                    break
            }
        } else {
            component = null
        }
    }
</script>

<td class="cell-stub" rowSpan={info.cell.rowSpan} colSpan={info.cell.colSpan} class:range-anchor={info.cell.getIsRangeAnchor()} class:range-last={info.cell.getIsRangeLast()} class:range-covered={info.cell.getIsInRange()} class:active={info.cell.getIsInRange()} data-cell-title={info.cell.getTitle()} data-cell-id={info.cell.id} data-row-id={info.row.id} data-column-id={info.column.id}>
    <svelte:component this={component} {info} editing={info.cell.getIsEditingRangeAnchor()} />
    {#if info.cell.getIsRangeLast()}
        <span class="cell-last-cornor" transition:fade={{delay: 50, duration: 100}} />
    {/if}
</td>

<style lang="postcss">
    .cell-stub {
        position: relative;
        transition: background-color 0.1s linear 0.05s;
        cursor: cell;

        &.range-anchor {
            outline: 1px solid blue;
        }

        &.range-covered:not(&.range-anchor) {
            background-color: rgba(0, 0, 255, 0.1);
        }

        .cell-last-cornor {
            position: absolute;
            right: -5px;
            bottom: -5px;
            width: 4px;
            height: 4px;
            background-color: blue;
            cursor: crosshair;
            padding: 2px;
            box-sizing: content-box;
            background-clip: content-box;
            z-index: 2;
        }
    }
</style>
