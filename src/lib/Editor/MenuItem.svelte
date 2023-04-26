<script lang="ts">
    import type { Editor } from '@tiptap/core'

    import type { SvgIcon } from './Editor.svelte'

    export let editor: Editor
    export let isActive: (props: { editor: Editor }) => boolean = () => false
    export let action: (props: { editor: Editor }) => boolean = () => false
    export let title: string | undefined = undefined
    export let icon: SvgIcon
</script>

<button class="menu-item" class:is-active={isActive({ editor })} on:mousedown|preventDefault|stopPropagation on:click={() => action({ editor })} {title}>
    <svelte:component this={icon} />
</button>

<style lang="postcss">
    .menu-item {
        width: 1.75rem;
        height: 1.75rem;
        padding: 0.25rem;
        margin-right: 0.25rem;
        color: #0d0d0d;
        background-color: transparent;
        border: none;
        border-radius: 0.4rem;

        &:hover,
        &.is-active {
            color: #fff;
            background-color: #0d0d0d;
        }
    }
</style>
