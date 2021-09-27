<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>-->
    <template v-if="!item.subMenus || !item.subMenus.length">
      <!-- <app-link :to="resolvePath(item.url)"> -->
      <div @click="itemClick(item)">
        <el-menu-item :index="resolvePath(item.url)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="item.icon" :title="item.menuName"/>
        </el-menu-item>
      </div>
      <!-- </app-link> -->
    </template>
    <template v-else>
      <el-submenu ref="subMenu" :index="resolvePath(item.url)" popper-append-to-body>
        <template slot="title">
          <item :icon="item.icon"  :title="item.menuName"/>
        </template>
        <sidebar-item
          v-for="child in item.subMenus"
          :key="child.url"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.url)"
          class="nest-menu"
        />
      </el-submenu>
    </template>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    itemClick(item) {
      console.log(item);
      // this.$router.push('/menu/menu')
      this.$router.push(item.url);
    },
    // hasOneShowingChild(children = [], parent) {
    //   const showingChildren = children.filter(item => {
    //     if (item.hidden) {
    //       return false;
    //     } else {
    //       // Temp set(will be used if only has one showing child)
    //       this.onlyOneChild = item;
    //       return true;
    //     }
    //   });

    //   // When there is only one child router, the child router is displayed by default
    //   if (showingChildren.length === 1) {
    //     return true;
    //   }

    //   // Show parent if there are no child router to display
    //   if (showingChildren.length === 0) {
    //     this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
    //     return true;
    //   }

    //   return false;
    // },
    resolvePath(routePath) {
      if (!routePath) {
        return this.basePath;
      }
      return routePath;
      // if (isExternal(routePath)) {
      //   return routePath;
      // }
      // if (isExternal(this.basePath)) {
      //   return this.basePath;
      // }
      // return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
