<script context="module" lang="ts">
    import { createEventDispatcher, type ComponentType, type SvelteComponentTyped } from 'svelte'
    import type { SVGAttributes } from 'svelte/elements'

    export type SvgIcon = ComponentType<SvelteComponentTyped<SVGAttributes<EventTarget>>>

    export type Toolbar =
        | {
              icon: SvgIcon
              title: string
              action: (props: { editor: Editor }) => boolean
              isActive?: (props: { editor: Editor }) => boolean
          }
        | { type: 'divider' }
        | ComponentType<SvelteComponentTyped<{ editor: Editor; readOnly?: boolean }>>
</script>

<script lang="ts">
    import { Editor, type Content, type Extensions } from '@tiptap/core'
    import { Table } from '@tiptap/extension-table'
    import { TableCell } from '@tiptap/extension-table-cell'
    import { TableHeader } from '@tiptap/extension-table-header'
    import { TableRow } from '@tiptap/extension-table-row'
    import { TextStyle } from '@tiptap/extension-text-style'
    import { Underline } from '@tiptap/extension-underline'
    import { StarterKit, type StarterKitOptions } from '@tiptap/starter-kit'

    import { onMount } from 'svelte'
    import '../styles.css'
    import MenuBar from './MenuBar.svelte'

    export let editor: Editor | undefined = undefined
    export let readOnly = false
    export let extensions: Extensions = []
    export let starterKitOptions: Partial<StarterKitOptions> | undefined = undefined
    export let content: Content = null
    export let additionalToolbars: Toolbar[] = []

    let editorRootElement: HTMLElement

    const dispatcher = createEventDispatcher<{
        create: { editor: Editor }
    }>()

    $: editor && editor.setEditable(!readOnly)
    $: editor && editor.commands.setContent(content)

    onMount(() => {
        editor = new Editor({
            element: editorRootElement,
            content,
            extensions: [
                StarterKit.configure(starterKitOptions),
                TextStyle,
                Underline,
                Table.configure({
                    resizable: true,
                    // lastColumnResizable: false,
                }),
                TableCell,
                TableRow,
                TableHeader,
                ...extensions,
            ],
            onCreate({ editor }) {
                dispatcher('create', { editor })
            },
        })
    })
</script>

<div class="editor" class:readOnly>
    <slot name="header" {editor}>
        {#if editor}
            <MenuBar {readOnly} {editor} {additionalToolbars} />
        {/if}
    </slot>

    <div class="editor__content">
        <div class="editor-root" bind:this={editorRootElement} />
    </div>

    <slot name="footer" {editor} />
</div>

<style lang="postcss">
    .editor {
        display: flex;
        max-height: 30rem;
        color: #0d0d0d;
        background-color: #fff;
        border: 3px solid #0d0d0d;
        border-radius: 0.75rem;
        flex-direction: column;

        :global(.editor__header) {
            align-items: center;
            border-bottom: 3px solid #0d0d0d;
            display: flex;
            flex: 0 0 auto;
            flex-wrap: wrap;
            padding: 0.25rem;
        }

        :global(.editor__content) {
            max-height: 540px;
            padding: 1.25rem 3rem;
            overflow: scroll;
            overflow-x: hidden;
            overflow-y: auto;
            flex: 1 1 auto;
            -webkit-overflow-scrolling: touch;
        }

        :global(.ProseMirror) {
            height: 440px;
        }
    }
</style>
