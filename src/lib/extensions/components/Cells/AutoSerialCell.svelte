<script lang="ts">
    import type { CellContext } from '@tanstack/table-core'

    import type { DataType } from '../../types/data'

    export let info: CellContext<DataType[], DataType>
    export let editing = false
</script>

<div class="auto-serial-cell-field" class:editing>{(info.row.index + 1).toString()}</div>
