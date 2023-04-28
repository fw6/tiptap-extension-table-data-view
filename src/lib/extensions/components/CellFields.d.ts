import type { CellContext } from '@tanstack/table-core';
import { SvelteComponentTyped } from 'svelte';
import type { DataType } from '../types';

type FieldProps = {
    info: CellContext<DataType[], DataType>
    editing: boolean
}

export class AutoSerialField extends SvelteComponentTyped<CellProps> { }
export class DatetimeField extends SvelteComponentTyped<CellProps> { }
export class NumberField extends SvelteComponentTyped<CellProps> { }
export class TextField extends SvelteComponentTyped<CellProps> { }
