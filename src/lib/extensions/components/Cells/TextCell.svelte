<script lang="ts">
    import type { CellContext } from '@tanstack/table-core'
    import { onMount } from 'svelte'

    import type { DataType } from '../../types/data'

    export let info: CellContext<DataType[], DataType>
    export let editing = false

    let cellFieldRef: HTMLInputElement | undefined

    let fieldValue: string | undefined = ''

    $: {
        if (editing && cellFieldRef) cellFieldRef.select()
    }

    onMount(() => {
        const value = info.getValue()
        fieldValue = typeof value === 'string' ? value : undefined
    })
</script>

<input bind:this={cellFieldRef} maxlength="999" type="text" class="text-cell-field" readonly={!editing} bind:value={fieldValue} />

<style lang="postcss">
    .text-cell-field {
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
    }
</style>
