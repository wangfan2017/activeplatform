/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/layout";

export default {
	path: "/adminAuth",
	component: Layout,
	redirect: "/adminAuth/getRoleList",
	alwaysShow: true, // will always show the root menu
	name: "adminAuth",
	meta: {
		title: "权限管理",
		icon: "permission"
	}
};