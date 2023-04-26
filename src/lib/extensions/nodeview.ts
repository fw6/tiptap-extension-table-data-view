// import type { Table } from '@tanstack/table-core';
// import type { Editor } from '@tiptap/core';
// import type { Node } from '@tiptap/pm/model';
// import type { NodeView } from '@tiptap/pm/view';

// import { getTable } from './helpers';
// import type { TableNodeViewOptions } from './types';
// import type { DataSource } from './types/data';

// import './styles.css';

// export class TableDataViewNodeView implements NodeView {
//     dom: HTMLDivElement;
//     table: HTMLTableElement;
//     thead: HTMLTableSectionElement;
//     tbody: HTMLTableSectionElement;

//     editor: Editor;
//     options: TableNodeViewOptions;
//     node: Node;
//     // tanstackTable: Table<DataSource>;
//     getPos: boolean | (() => number);

//     constructor({
//         editor,
//         options,
//         node,
//         getPos,
//     }: {
//         editor: Editor;
//         options: TableNodeViewOptions;
//         node: Node;
//         getPos: boolean | (() => number);
//     }) {
//         this.editor = editor;
//         this.options = options;
//         this.node = node;
//         this.getPos = getPos;

//         // TODO: 从 node 中获取数据
//         // this.tanstackTable = getTable(simplyTestData, simplyTestColumnFieldConfig);

//         this.dom = document.createElement('div');
//         this.dom.className = 'table-dataview';

//         this.table = document.createElement('table');
//         this.thead = document.createElement('thead');
//         this.tbody = document.createElement('tbody');

//         this.table.appendChild(this.thead);
//         this.table.appendChild(this.tbody);
//         this.dom.appendChild(this.table);

//         this.renderContent();
//     }

//     stopEvent() {
//         return true;
//     }

//     protected renderContent() {
//         this.tbody.innerHTML = this.tanstackTable.getRowModel().rows.map(row => {
//             const cells = row.getAllCells().map(cell => `<td key="${cell.id}">${cell.getValue()}</td>`).join('');
//             return `<tr key=${row.id}>${cells}</tr>`;
//         }).join('');
//     }
// }
