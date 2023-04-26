<script lang="ts">
    import { MyEditor, TableDataview } from '$lib'
    import type { Content, Extensions } from '@tiptap/core'
    const content: Content = {
        type: 'doc',
        content: [
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'table data view',
                    },
                ],
            },
            {
                type: 'table_dataview',
            },
            {
                type: 'paragraph',
                content: [
                    {
                        type: 'text',
                        text: 'plain table',
                    },
                ],
            },
            {
                type: 'table',
                content: [
                    {
                        type: 'tableRow',
                        content: [
                            {
                                type: 'tableHeader',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [298],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableHeader',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [318],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableHeader',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'tableRow',
                        content: [
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [298],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [318],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'tableRow',
                        content: [
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [298],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [318],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: '1111',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'tableRow',
                        content: [
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [298],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [318],
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                            {
                                type: 'tableCell',
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                },
                                content: [
                                    {
                                        type: 'paragraph',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }

    const extensions: Extensions = [TableDataview]
</script>

<div class="table-dataview" style:padding="24px">
    <a href="/">Back</a><br />
</div>

<div class="app">
    <MyEditor {content} {extensions} />
</div>
