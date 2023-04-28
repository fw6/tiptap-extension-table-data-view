<script lang="ts">
    import type { CellContext } from '@tanstack/table-core'
    import IMask from 'imask/esm/imask'
    import 'imask/esm/masked/number'
    import { onMount, tick } from 'svelte'

    import type { DataType } from '../../types'

    export let editing = false
    export let info: CellContext<DataType[], DataType>

    let cellFieldRef: HTMLInputElement

    let fieldValue = ''

    $: {
        if (cellFieldRef) {
            if (editing) cellFieldRef.select()
            else cellFieldRef.blur()
        }
    }

    onMount(() => {
        const value = info.getValue()
        fieldValue = typeof value === 'string' ? value : ''

        const mask = IMask(cellFieldRef, {
            mask: '¥num',
            blocks: {
                num: {
                    mask: Number,
                    thousandsSeparator: ' ',
                },
            },
        })

        tick().then(() => {
            mask.updateValue()
            mask.updateControl()
        })

        return () => {
            mask.destroy()
        }
    })
</script>

<input bind:this={cellFieldRef} type="text" class="number-cell-field" readonly={!editing} bind:value={fieldValue} />

<style lang="postcss">
    .number-cell-field {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        resize: none;
        margin: 0;
        padding: 0;
        font-size: inherit;
        font-family: inherit;
        background-color: transparent;
    }
</style>
