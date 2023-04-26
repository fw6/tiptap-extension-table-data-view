import type { FieldHyperLink, FieldUser } from "./field";

/**
 * 某个字段的具体内容
 *
 * 特殊情况：
 * - `#.1` 行合并
 * - `#.2` 列合并
 * - `#.3` 行列合并
 *
 * |    字段类型   |    value结构    |    描述    |
 * |    :---     |    :---         |    :---   |
 * |多行文本|string|值|
 * |数字|string|值|
 * |单选|string|选项ID|
 * |多选|string[|包含多个选项ID的数组|
 * |日期|number|Unix时间戳|
 * |复选框|boolean|布尔值|
 * |人员|FieldUser|具体类型参考：`FieldUser`|
 * |电话号码|string|符合正则表达式(\+)?\d*的字符串|
 * |邮箱|string|符合正则表达式\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*的字符串|
 * |超链接|FieldHyperLink|具体结构参考: `FieldHyperLink`|
 * |自动序号|string|由自动编号规则组成的字符串|
 */
export type DataType = string | boolean | string[] | FieldUser[] | FieldHyperLink | `#.${1 | 2 | 3}`;

/**
 * 表格内容的数据
 */
export type DataSource = DataType[][];
