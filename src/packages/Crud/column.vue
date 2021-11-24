<template>
    <div>
        <slot name="header"></slot>
        <!-- 动态列 -->
        <template v-for="column in list">
            <column-slot :key="column.label"
                         :column="column"
                         :column-option="columnOption">
                <template v-for="item in crud.mainSlot"
                          :slot="item"
                          slot-scope="scope">
                    <slot v-bind="scope" :name="item"></slot>
                </template>
            </column-slot>
        </template>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import columnSlot from "./column-slot.vue";
    import {arraySort} from "../../utils/util";

    export default {
        name: "column",
        components: {
            columnSlot
        },
        inject: ["crud"],
        props: {
            columnOption: Array
        },
        computed: {
            list() {
                let result = [...this.columnOption];
                result = arraySort(result, "index", (a, b) => this.crud.objectOption[a.prop]?.index - this.crud.objectOption[b.prop]?.index);
                return result;
            },
        }
    }
</script>

<style scoped>

</style>