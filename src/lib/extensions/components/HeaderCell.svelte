<script lang="ts">
    import { clickoutside } from '@svelte-put/clickoutside'
    import type { Header } from "@tanstack/table-core"

    import type { DataType, FieldConfig } from "../types"
    import FieldOptions from './FieldOptions.svelte'

    export let header: Header<DataType[], unknown>

    let fieldConfig: FieldConfig | undefined = header.column.columnDef.meta?.field
    $: {
        fieldConfig = header.column.columnDef.meta?.field
    }

    let visibleOptions = false;
</script>

<th
    class="header-cell"
    style:width={header.getSize() + 'px'}
    colSpan={header.colSpan}
    use:clickoutside
    on:clickoutside={() => visibleOptions = false}
>
    <div class="resizer" class:resizing={header.column.getIsResizing()} on:mousedown={header.getResizeHandler()}></div>

    <div
        class="content"
        class:visible-options={visibleOptions}
        on:mousedown={() => visibleOptions = false}
    >
        <span class="select-arrow" on:mousedown|stopPropagation={() => visibleOptions = !visibleOptions}>⬇️</span>

        {#if !header.isPlaceholder && fieldConfig}
            {fieldConfig.fieldName}
        {/if}
    </div>

    {#if fieldConfig}
        <FieldOptions visible={visibleOptions} {fieldConfig} />
    {/if}
</th>

<style lang="postcss">
    .header-cell {
        position: sticky;
        top: 0;
        background: #fff;

        .resizer {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 5px;
            background: rgba(0, 0, 0, 0.5);
            cursor: col-resize;
            user-select: none;
            touch-action: none;
            opacity: 0;

            &.resizing {
                background: blue;
                opacity: 1;
            }
        }

        &:hover > .resizer {
            opacity: 1;
        }

        .content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            &:hover, &.visible-options {
                .select-arrow {
                    opacity: 1;
                }
            }

            .select-arrow {
                float: right;
                width: 32px;
                height: 100%;
                text-align: center;
                opacity: 0;
            }

            &.visible-options .select-arrow, .select-arrow:hover {
                background-color: rgba(0, 0, 0, 0.12);
            }
        }
    }
</style>
