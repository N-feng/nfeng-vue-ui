export default function useDic() {
    const getOptions = (column, dic) => {
        if (column.dicName) {
            return dic[column.dicName] || [];
        } else {
            return column.options;
        }
    }

    return {
        getOptions
    }
}