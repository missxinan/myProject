import store from '@/store'

export default {
  // eslint-disable-next-line no-unused-vars
  inserted(el, binding, vnode) {
    console.log(el, binding, vnode)
    const { value } = binding
    const roles = store.getters && store.getters.roles
    // eslint-disable-next-line comma-spacing
    console.log(roles , 'roles权限管理')
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
