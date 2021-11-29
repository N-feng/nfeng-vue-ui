export const detail = (row = {}, column = {}, option = {}, dic = []) => {
    let result = row[column.propName || column.prop];
    // 自定义格式化
    if (column.formatter && typeof column.formatter === 'function') {
        result = column.formatter(row, row[column.prop], result, column);
    }
    return result;
}