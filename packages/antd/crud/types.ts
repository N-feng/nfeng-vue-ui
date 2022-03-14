import { TableColumnType } from 'ant-design-vue'

// type NewFormItem = Omit<FormItem, 'name' | 'names' | 'label' | 'row' | 'newline' | 'hide'>

export type BodyCellParams = {
    record: any
    column: TableColumn
    index: number
    text: any
}

export type TableColumn = {
    editable?: boolean | ((prop: BodyCellParams) => boolean)
    title?: string
    key?: TableColumnType['key']
    dataIndex?: TableColumnType['dataIndex'] | ((editable: boolean) => TableColumnType['dataIndex'])
    fixed?: TableColumnType['fixed']
    width?: string | number | undefined
    minWidth?: TableColumnType['minWidth']
    maxWidth?: TableColumnType['maxWidth']
    resizable?: TableColumnType['resizable']
    customRender?: TableColumnType['customRender']
    sorter?: TableColumnType['sorter']
    ellipsis?: TableColumnType['ellipsis']
    align?: TableColumnType['align']
    required?: boolean
    // item?: NewFormItem | ((prop: BodyCellParams) => NewFormItem)
    [key: string]: any
}

export type Key = string | number