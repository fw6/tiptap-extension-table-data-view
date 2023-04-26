<script lang="ts">
    import type { CellContext } from '@tanstack/table-core'
    import dayjs from 'dayjs'
    import IMask from 'imask/esm/imask'
    import 'imask/esm/masked/date'
    import { onMount } from 'svelte'

    import { tick } from 'svelte'
    import type { DataType } from '../../types/data'

    export let info: CellContext<DataType[], DataType>
    export let editing = false

    let cellFieldRef: HTMLInputElement
    /** 输入框绑定的值 */
    let fieldValue = ''

    $: {
        if (cellFieldRef) {
            if (editing) cellFieldRef.select()
            else cellFieldRef.blur()
        }
    }

    onMount(() => {
        const value = info.getValue()
        const timestamp = typeof value === 'number' ? value : undefined
        // 将日期时间戳转为格式化的日期字符串
        fieldValue = dayjs(timestamp).format('YYYY-MM-DD')

        const mask = IMask(cellFieldRef, {
            mask: Date,
            pattern: 'Y-`m-`d',
            blocks: {
                d: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31,
                    maxLength: 2,
                },
                m: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                Y: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: 9999,
                },
            },
            format: (date) => {
                return dayjs(date).format('YYYY-MM-DD')
            },
            parse: (str) => {
                return dayjs(str).toDate()
            },
            min: new Date(1900, 0, 1),
            max: new Date(9999, 0, 1),
            lazy: false, // visible placeholder
            overwrite: true,
            autofix: false,
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

<input bind:this={cellFieldRef} type="text" class="datetime-cell-field" readonly={!editing} bind:value={fieldValue} />

<style lang="postcss">
    .datetime-cell-field {
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

        &:invalid {
            color: red;
            outline: 1px solid red;
        }
    }
</style>
