<template>
	<Menu active-name="5" width="auto" :open-names="['5']" accordion>
		<Submenu name="1">
			<template slot="title">
				<Icon type="ios-navigate"></Icon>
				导航一
			</template>
			<Menu-item name="1-1">选项 1</Menu-item>
			<Menu-item name="1-2">选项 2</Menu-item>
			<Menu-item name="1-3">选项 3</Menu-item>
		</Submenu>
		<Submenu name="2">
			<template slot="title">
				<Icon type="ios-keypad"></Icon>
				导航二
			</template>
			<Menu-item name="2-1">选项 1</Menu-item>
			<Menu-item name="2-2">选项 2</Menu-item>
		</Submenu>
		<Submenu name="3">
			<template slot="title">
				<Icon type="ios-analytics"></Icon>
				导航三
			</template>
			<Menu-group title="选项 1">
				<Menu-item name="3-1">item 1</Menu-item>
				<Menu-item name="3-2">item 2</Menu-item>
			</Menu-group>
			<Menu-group title="选项 2">
				<Menu-item name="3-3">item 3</Menu-item>
				<Menu-item name="3-4">item 4</Menu-item>
			</Menu-group>
		</Submenu>
		<Menu-item name="4">
			<Icon type="person-stalker"></Icon>
			<router-link to="/testForm">用户</router-link>
		</Menu-item>
		<Menu-item name="5">
			<Icon type="document-text"></Icon>
			<router-link to="/test">表单</router-link>
		</Menu-item>
	</Menu>
</template>

<style lang="less" scoped>
	// .aa {
	// 	color: #657180;
	// }
</style>

<script>
	export default {

	}
</script>
