<script lang="ts">
    import type { Editor } from '@tiptap/core'
    import MenuItem from './MenuItem.svelte'

    import IconFormatClear from 'virtual:icons/carbon/text-clear-format'
    import IconBold from 'virtual:icons/ic/twotone-format-bold'
    import IconH1 from 'virtual:icons/material-symbols/format-h1'
    import IconH2 from 'virtual:icons/material-symbols/format-h2'
    import IconItalic from 'virtual:icons/material-symbols/format-italic'
    import IconListBulleted from 'virtual:icons/material-symbols/format-list-bulleted-rounded'
    import IconListOrdered from 'virtual:icons/material-symbols/format-list-numbered'
    import IconParagraph from 'virtual:icons/material-symbols/format-paragraph'
    import IconQuote from 'virtual:icons/material-symbols/format-quote'
    import IconStrike from 'virtual:icons/material-symbols/format-strikethrough'
    import IconCodeBlock from 'virtual:icons/ri/code-box-line'
    import IconCodeView from 'virtual:icons/ri/code-view'

    import IconExportHTML from 'virtual:icons/carbon/html-reference'
    import IconExportJSON from 'virtual:icons/carbon/json-reference'
    import IconExportTxt from 'virtual:icons/carbon/txt-reference'
    import IconHardBreak from 'virtual:icons/material-symbols/format-text-wrap'
    import IconRedo from 'virtual:icons/material-symbols/redo'
    import IconTable from 'virtual:icons/material-symbols/table'
    import IconUndo from 'virtual:icons/material-symbols/undo'
    import type { Toolbar } from './Editor.svelte'

    export let editor: Editor
    export let readOnly = false
    export let additionalToolbars: Toolbar[] = []

    const toolbars: Toolbar[] = [
        {
            icon: IconExportHTML,
            title: 'Export HTML',
            action: ({ editor }) => {
                console.clear()
                console.groupCollapsed('HTML Output')
                const content = editor.getHTML()
                console.log(content)
                const frag = document.createElement('div')
                frag.innerHTML = content
                console.dirxml(frag)
                console.groupEnd()
                return false
            },
        },
        {
            icon: IconExportJSON,
            title: 'Export JSON',
            action: ({ editor }) => {
                const content = editor.getJSON()
                console.clear()
                console.groupCollapsed('JSON Output')
                console.table(content)
                console.log(JSON.stringify(content, null, 4))
                console.groupEnd()
                return false
            },
        },
        {
            icon: IconExportTxt,
            title: 'Export TXT',
            action: ({ editor }) => {
                console.clear()
                console.groupCollapsed('TXT Output')
                console.log(editor.getText())
                console.groupEnd()
                return false
            },
        },
        {
            icon: IconBold,
            title: 'Bold',
            action: ({ editor }) => editor.chain().focus().toggleBold().run(),
            isActive: ({ editor }) => editor.isActive('bold'),
        },
        {
            icon: IconItalic,
            title: 'Italic',
            action: ({ editor }) => editor.chain().focus().toggleItalic().run(),
            isActive: ({ editor }) => editor.isActive('italic'),
        },
        {
            icon: IconStrike,
            title: 'Strike',
            action: ({ editor }) => editor.chain().focus().toggleStrike().run(),
            isActive: ({ editor }) => editor.isActive('strike'),
        },
        {
            icon: IconCodeView,
            title: 'Code',
            action: ({ editor }) => editor.chain().focus().toggleCode().run(),
            isActive: ({ editor }) => editor.isActive('code'),
        },
        {
            type: 'divider',
        },
        {
            icon: IconH1,
            title: 'Heading 1',
            action: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: ({ editor }) => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: IconH2,
            title: 'Heading 2',
            action: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: ({ editor }) => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: IconParagraph,
            title: 'Paragraph',
            action: ({ editor }) => editor.chain().focus().setParagraph().run(),
            isActive: ({ editor }) => editor.isActive('paragraph'),
        },
        {
            icon: IconListBulleted,
            title: 'Bullet List',
            action: ({ editor }) => editor.chain().focus().toggleBulletList().run(),
            isActive: ({ editor }) => editor.isActive('bulletList'),
        },
        {
            icon: IconListOrdered,
            title: 'Ordered List',
            action: ({ editor }) => editor.chain().focus().toggleOrderedList().run(),
            isActive: ({ editor }) => editor.isActive('orderedList'),
        },
        {
            icon: IconCodeBlock,
            title: 'Code Block',
            action: ({ editor }) => editor.chain().focus().toggleCodeBlock().run(),
            isActive: ({ editor }) => editor.isActive('codeBlock'),
        },
        {
            type: 'divider',
        },
        {
            icon: IconQuote,
            title: 'Blockquote',
            action: ({ editor }) => editor.chain().focus().toggleBlockquote().run(),
            isActive: ({ editor }) => editor.isActive('blockquote'),
        },
        {
            type: 'divider',
        },
        {
            icon: IconHardBreak,
            title: 'Hard Break',
            action: ({ editor }) => editor.chain().focus().setHardBreak().run(),
        },
        {
            icon: IconFormatClear,
            title: 'Clear Format',
            action: ({ editor }) => editor.chain().focus().clearNodes().unsetAllMarks().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: IconUndo,
            title: 'Undo',
            action: ({ editor }) => editor.chain().focus().undo().run(),
        },
        {
            icon: IconRedo,
            title: 'Redo',
            action: ({ editor }) => editor.chain().focus().redo().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: IconTable,
            title: 'Insert Table',
            action({ editor }) {
                return editor.commands.insertTable({ rows: 4, cols: 3 })
            },
        },
    ]
</script>

<div class="editor__header" class:readOnly>
    {#each [...toolbars, ...additionalToolbars] as toolbar}
        {#if 'type' in toolbar}
            <div class="divider" />
        {:else if 'icon' in toolbar}
            <MenuItem {editor} {...toolbar} />
        {:else}
            <svelte:component this={toolbar} {editor} {readOnly} />
        {/if}
    {/each}
</div>

<style lang="postcss">
    .divider {
        width: 2px;
        height: 1.25rem;
        margin-right: 0.75rem;
        margin-left: 0.5rem;
        background-color: rgb(0 0 0 / 10%);
    }
</style>
