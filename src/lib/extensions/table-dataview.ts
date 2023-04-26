import { Node } from '@tiptap/core';
import TableDataviewRenderer from './TableDataview.svelte';

export const TableDataview = Node.create({
    name: 'table_dataview',
    group: 'block',
    atom: true,
    allowGapCursor: true,
    isolating: true,
    parseHTML() {
        return [
            {
                tag: 'table[table_dataview]'
            }
        ];
    },
    addAttributes() {
        return {
            source: {
                default: null,
            },
        };
    },
    renderHTML() {
        return [
            'table',
            {
                table_dataview: true,
            }
        ];
    },
    addNodeView() {
        return ({ editor, node, getPos }) => {
            const dom = document.createElement('div');
            const component = new TableDataviewRenderer({
                target: dom,
                props: {
                    editor, node, getPos
                },
            });

            return {
                dom,
                selectNode() {
                    component.$set({ selected: true });
                },
                deselectNode() {
                    component.$set({ selected: false });
                },
                stopEvent() {
                    return true;
                },
                destroy() {
                    component.$destroy();
                },
            };
        };
    },
});
