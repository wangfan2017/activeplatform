import {
	createRouter,
	createWebHashHistory
} from "vue-router";
import store from "@/store";

import layout from "@/layout";
import permissions from "./modules/permissions";
import Layout from "@/layout";

/**
 * 私有路由表
 */
export const privateRoutes = [
	permissions]
/**
 * 公开路由表
 */
export const publicRoutes = [

	{
		path: "/login",
		component: () => import("@/views/login/index")
	},
	{
		path: '/',
		component: Layout,
		redirect: 'home',
		children: [
			{
				path: '/home',
				component: () => import('@/views/home'),
				name: 'Index',
				meta: { title: '首页', icon: 'home', affix: true }
			}
		]
	},
	{
		path: "/active",
		component: Layout,
		alwaysShow: true, // will always show the root menu
		name: "active",
		meta: {
			title: "活动管理",
			icon: "permission"
		},
		children: [
			{
				path: "/temp",
				name: "temp",
				component: () => import("@/views/active/template"),
				meta: { title: "模版管理", icon: "box"  },
			},
			{
				path: "/actlist",
				name: "actlist",
				component: () => import("@/views/active/index"),
				meta: { title: "活动管理", icon: "pageDown"  },
			},
			{
				path: "/actenroll",
				name: "actenroll",
				component: () => import("@/views/active/enrolllst"),
				meta: { title: "报名列表", icon: "pageDown"  },
			},
		]
	},
	{
		path: "/system",
		component: Layout,
		alwaysShow: true, // will always show the root menu
		name: "system",
		meta: {
			title: "系统管理",
			icon: "permission"
		},
		children: [
			{
				path: "/operater",
				name: "operater",
				component: () => import("@/views/system/operater"),
				meta: { title: "用户管理", icon: "box"  },
			},
			{
				path: "/role",
				name: "role",
				component: () => import("@/views/system/role"),
				meta: { title: "角色管理", icon: "pageDown"  },
			},
			{
				path: "/permission",
				name: "permission",
				component: () => import("@/views/system/permission"),
				meta: { title: "权限管理", icon: "pageDown"  },
			},
		]
	}
];

/**
 * 初始化路由表
 */
export function resetRouter() {
	if (store.getters.hasRoles) {
		const menus = store.getters.roles;
		menus.forEach(menu => {
			const url = menu.url;
			const i = url.lastIndexOf("/");
			const name = url.substring(i + 1, url.length);
			router.removeRoute(name);
		});
	}
}

const router = createRouter({
	history: createWebHashHistory(),
	routes: publicRoutes

});

export default router;