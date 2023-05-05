import { FIELD_TYPE, type DataSource, type FieldConfig } from "../types"

/**
 * 表格的数据，每一项代表一行，每一项的每一项代表一列。
 *
 * 列的值为如下值时，表示
 * - #.1 左合并
 * - #.2 上合并
 * - #.3 上左合并
 */
export const dataSource: DataSource = [
    ['1.1', '1', '1999-09-09', '1.4'],
    ['#2', '3', '#3.2', '2.4'],
    ['3.1', '3.2', '2024-02-20', '#.113'],
]

/**
 * 表格列的配置描述，具体项类型描述参考：`FieldConfig`
 *
 * 这里是4列，第一列为自动续号，第二列文本，第三列日期，第四列数字。
 * 其中自动序号传值会被忽略。
 */
export const columns: FieldConfig[] = [
    {
        fieldId: 'serial_1',
        fieldName: '🔢自动序号',
        type: FIELD_TYPE.AUTO_SERIAL,
        size: 300,
        property: {
            type: 'auto_increment_number'
        },
    },
    {
        fieldId: 'text_1',
        fieldName: '😊文本',
        type: FIELD_TYPE.TEXT,
        size: 300,
    },
    {
        fieldId: 'datetime_1',
        fieldName: '📅日期',
        type: FIELD_TYPE.DATETIME,
        size: 300,
        property: {
            formatter: 'YYYY-MM-DD',
        },
    },
    {
        fieldId: 'number_1',
        fieldName: '🪙数字',
        type: FIELD_TYPE.NUMBER,
        size: 300,
        property: {
            formatter: '0',
        },
    },
]
