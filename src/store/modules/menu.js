/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { menuAllList } from "@/api/menu";

const state = {
	menus: [],
}

const mutations = {
	UPDATE_MENUS: (state, data) => {
		state.menus = data
	}
}

const actions = {
	updateMenu({ commit }) {
		let token = JSON.parse(sessionStorage.getItem("tokenData"));
		if (token) {
			return new Promise((resolve, reject) => {
				let urlArr = [];
				menuAllList({ roleIdList: token.details.roleIds }).then(res => {
					res.data = res.data || [];
					res.data.forEach(item => {
						if (item.subMenus && item.subMenus.length) {
							item.subMenus.forEach(t => {
								urlArr.push(t.url);
							});
						} else {
							urlArr.push(item.url);
						}
					});
					sessionStorage.setItem("userPages", JSON.stringify(urlArr));
					res.data.unshift({
						path: '/',
						menuName: '首页',
						icon: 'dashboard',
						url: '/'
					})
					commit('UPDATE_MENUS', res.data)
				});
			})
		}
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}

