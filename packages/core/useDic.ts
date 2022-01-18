function isBasicType(val) {
    return typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean'
}

export default function useDic() {

    // 获取枚举库对应的枚举数据
    const getDic = (column, dic) => {
        if (column.dicName) {
            return dic[column.dicName] || [];
        } else {
            return column.options;
        }
    }

    // 获取下拉数据
    const getOptions = (propMap, options) => {
        return (options as any[]).map((row) => {
            const option = {
                label: isBasicType(row) ? row : row[propMap.label],
                value: isBasicType(row) ? row : row[propMap.value],
                item: row,
            }
            if (!isBasicType(row)) {
                if ('disabled' in row) {
                    option['disabled'] = row['disabled']
                }
                if ('title' in row) {
                    option['title'] = row['title']
                }
                if ('key' in row) {
                    option['key'] = row['key']
                }
            }
            return option
        })
    }

    return {
        getDic,
        getOptions
    }
}