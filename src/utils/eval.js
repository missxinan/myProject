"use strict";
import Vue from "vue";
export default function treeToArray(
    data,
    expandAll,
    parent = null,
    level = null
) {
    let tmp = [];
    Array.from(data).forEach(function(record) {
        let _level = 1;
        if (level !== undefined && level !== null) {
            _level = level + 1;
        }
        if (record._expanded === undefined) {
            Vue.set(record, "_expanded", expandAll);
        }
        if (parent) {
            Vue.set(record, "parent", parent);
        }
        Vue.set(record, "_level", _level);
        // 如果有父元素
        tmp.push(record);
        if (record.subMenus && record.subMenus.length > 0) {
            const subMenus = treeToArray(record.subMenus, expandAll, record, _level);
            tmp = tmp.concat(subMenus);
        }
        // if (record.subCategorys && record.subCategorys.length > 0) {
        //     const subMenus = treeToArray(record.subCategorys, expandAll, record, _level);
        //     tmp = tmp.concat(subMenus);
        // }
    });
    return tmp;
}