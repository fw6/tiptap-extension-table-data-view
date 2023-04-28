<script lang="ts">
    import { clickoutside } from '@svelte-put/clickoutside'
    import type { CellContext } from '@tanstack/table-core'
    import type { ComponentType, SvelteComponentTyped } from 'svelte'

    import { FIELD_TYPE, type DataType, type FieldConfig } from '../types'
    import { AutoSerialField, DatetimeField, NumberField, TextField } from './CellFields'

    export let info: CellContext<DataType[], DataType>

    let active = false
    let editing = false
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

    const onClick = (e: MouseEvent) => {
        active = true

        if (e.detail > 1) {
            editing = true
        }
    }

    const onClickOutside = () => {
        active = false
        editing = false
    }
</script>

<td class="cell-stub" data-cell-id={info.cell.id} data-row-id={info.row.id} data-column-id={info.column.id} class:active use:clickoutside on:clickoutside={onClickOutside} on:click={onClick}>
    <svelte:component this={component} {info} {editing} />
</td>

<style lang="postcss">
    .cell-stub {
        &.active {
            position: relative;
            outline: 1px solid blue;
            caret-color: blue;

            &::after {
                position: absolute;
                content: '';
                right: -3px;
                bottom: -3px;
                width: 4px;
                height: 4px;
                background-color: blue;
                box-shadow: 0 0 0px 0.5px white;
            }
        }

        :global(&.selected) {
            background-color: pink;
        }
        :global(&.selected.selected-first) {
            background-color: cyan;
        }
    }
</style>
