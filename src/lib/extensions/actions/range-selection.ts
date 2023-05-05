import type { Table } from '@tanstack/table-core';
import { debounce } from 'lodash-es';
import type { Action } from 'svelte/action';
import type { DataType } from '../types';

type RangeSelectionOptions = {
    table: Table<DataType[]>
}

export const rangeSelection: Action<HTMLTableElement, RangeSelectionOptions> = (tableEle, options) => {
    const tbodyEle = tableEle.querySelector('tbody');
    if (!options || !tbodyEle) {
        console.error('options is required');
        return {};
    }
    let table = options.table;

    let selecting = false;
    let anchorCell: HTMLTableCellElement | null = null;
    let lastCell: HTMLTableCellElement | null = null;

    const ranges: string[] = [];
    let anchorMark = '';
    let privAnchorMark = '';

    let lastMark = '';

    let isEditing = false;

    let useShiftKey = false;
    let useCtrlKey = false;

    const findClosestCell = (target: Element) => {
        if (target.tagName === 'TD') return target as HTMLTableCellElement
        return target.closest('td')
    }

    const handleMousedown = (e: MouseEvent) => {
        selecting = true;
        useShiftKey = e.shiftKey;
        useCtrlKey = e.ctrlKey;

        if (useShiftKey) {
            anchorCell = tbodyEle.querySelector<HTMLTableCellElement>('td.range-anchor');

            if (!anchorCell) {
                const ele = document.elementFromPoint(e.x, e.y);
                anchorCell = ele && findClosestCell(ele);
                if (!anchorCell) return;
            }
        } else {
            ranges.splice(0, ranges.length);

            const startElement = document.elementFromPoint(e.x, e.y);
            anchorCell = startElement && findClosestCell(startElement);
        }

        if (anchorCell) {
            anchorMark = anchorCell.dataset.cellTitle || 'A1';
        }

        table.setRangeAnchorState(anchorMark);

        if (privAnchorMark === anchorMark) {
            if (isEditing) return;
            isEditing = e.detail > 1;
        } else {
            isEditing = false;
        }

        table.setState((old) => ({
            ...old,
            isEditingRangeAnchor: isEditing,
        }));

        privAnchorMark = anchorMark;
    }
    const handleMousemove = debounce((e: MouseEvent) => {
        if (!selecting) return;

        const endElement = document.elementFromPoint(e.x, e.y);
        lastCell = endElement && findClosestCell(endElement);

        if (lastCell) {
            lastMark = lastCell.dataset.cellTitle!;
        }

        if (lastMark === anchorMark && isEditing) return;

        if (isEditing) {
            isEditing = false;
            table.setState((old) => ({
                ...old,
                isEditingRangeAnchor: isEditing,
            }));
        }

        if (!useCtrlKey) {
            ranges.splice(0, ranges.length, `${anchorMark}:${lastMark}`);
        }

        table.setRangesState(ranges);
        e.preventDefault();
    }, 100, { leading: false, trailing: true, maxWait: 200 })

    const handleMouseup = (e: MouseEvent) => {
        selecting = false;

        if (isEditing) return;

        const endElement = document.elementFromPoint(e.x, e.y);
        lastCell = endElement && findClosestCell(endElement);

        if (lastCell) {
            lastMark = lastCell.dataset.cellTitle!;
        }

        if (!useCtrlKey) ranges.splice(0, ranges.length, `${anchorMark}:${lastMark}`);
        else ranges.push(anchorMark + lastMark);

        table.setRangesState(ranges);
    }

    tbodyEle.addEventListener('mousedown', handleMousedown);
    tbodyEle.addEventListener('mousemove', handleMousemove);
    tbodyEle.addEventListener('mouseup', handleMouseup);
    return {
        update(options) {
            if (options.table) table = options.table;
        },
        destroy() {
            tbodyEle.removeEventListener('mousedown', handleMousedown);
            tbodyEle.removeEventListener('mousemove', handleMousemove);
            tbodyEle.removeEventListener('mouseup', handleMouseup);
        },
    }
}
