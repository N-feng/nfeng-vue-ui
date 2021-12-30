export default function () {
    return {
        computed: {
            rowKey () {
                return this.tableOption.rowKey || "id";
            }
        }
    }
}