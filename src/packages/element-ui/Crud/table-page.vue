<template>
    <div :class="b('pagination')"
         v-if="pageFlag && vaildData(crud.tableOption.page,true)">
        <el-pagination
                class="pagination"
                background
                :current-page.sync="defaultPage.currentPage"
                :page-size="defaultPage.pageSize"
                :page-sizes="defaultPage.pageSizes"
                :layout="defaultPage.layout"
                :total="defaultPage.total"
                @size-change="sizeChange"
                @current-change="currentChange"
        ></el-pagination>
    </div>
</template>

<script>
    import create from "../../common/create";
    import {deepClone, vaildData} from "../../utils/util";

    export default create({
        name: "table-page",
        inject:  ["crud"],
        props: {
            page: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data () {
            return {
                defaultPage: {
                    total: 0, // 总页数
                    pagerCount: 7,//超过多少条隐藏
                    currentPage: 1, // 当前页数
                    pageSize: 10, // 每页显示多少条
                    pageSizes: [10, 20, 30, 40, 50, 100],
                    layout: 'total, sizes, prev, pager, next, jumper',
                    background: true // 背景颜色
                }
            }
        },
        computed: {
            pageFlag () {
                return this.defaultPage.total != 0
            }
        },
        watch: {
            page: {
                handler () {
                    this.pageInit();
                },
                deep: true,
            }
        },
        created () {
            this.pageInit();
        },
        methods: {
            vaildData,
            // 初始化分页数据
            pageInit() {
                this.defaultPage = Object.assign(this.defaultPage, this.page, {
                    total: Number(this.page.total || this.defaultPage.total),
                    pagerCount: Number(this.page.pagerCount || this.defaultPage.pagerCount),
                    currentPage: Number(this.page.currentPage || this.defaultPage.currentPage),
                    pageSize: Number(this.page.pageSize || this.defaultPage.pageSize)
                })
                this.updateValue();
            },
            // 更新分页数据
            updateValue() {
                const pageData = deepClone(this.defaultPage)
                delete pageData.background
                delete pageData.layout
                delete pageData.pageSizes
                delete pageData.pagerCount
                this.crud.$emit("update:page", this.defaultPage);
                this.$emit("update:pageData", pageData);
            },

            // 页大小回调
            sizeChange(val) {
                this.defaultPage.currentPage = 1;
                this.defaultPage.pageSize = val;
                this.updateValue();
                this.crud.onLoad();
                this.$emit("size-change", val);
            },
            // 页码回调
            currentChange(val) {
                this.updateValue();
                this.crud.onLoad();
                this.$emit("current-change", val);
            },
        }
    })
</script>

<style scoped>

</style>