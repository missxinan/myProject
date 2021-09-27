
"use strict";
import Vue from "vue";
export default function treeToArray(
  data
) {
  let tmp = data
  Array.from(tmp).forEach(function(record) {
    if (record.subCategorys && record.subCategorys.length == 0) {
		delete record.subCategorys
    }else{
		treeToArray(record.subCategorys)
	}
	
  });
  return tmp;
}