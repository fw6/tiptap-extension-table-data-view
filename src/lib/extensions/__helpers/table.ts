import { createColumnHelper, createTable, getCoreRowModel } from "@tanstack/table-core";
import { FIELD_TYPE, type DataSource, type FieldConfig } from "../types";

const columnHelper = createColumnHelper<DataSource[number]>();

export const getColumns = (columnFieldConfig: FieldConfig[]) => {
    return columnFieldConfig.flatMap((config, i) => {

        return columnHelper.accessor((row) => {
            const _cellValue = row[i];

            switch (config.type) {
                case FIELD_TYPE.TEXT:
                    return typeof _cellValue === 'string' ? _cellValue : '';
                default:
                    break;
            }

            return _cellValue.toString();
        }, {
            id: config.fieldId,
            header: config.fieldName,
        });
    })
};

export const getTable = (data: DataSource, columnFieldConfig: FieldConfig[]) => {
    return createTable({
        data,
        columns: getColumns(columnFieldConfig),
        state: {},
        renderFallbackValue: '',
        onStateChange: () => {
            console.log('onStateChange');
        },
        getCoreRowModel: getCoreRowModel(),
    });
}
