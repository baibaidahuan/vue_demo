<style lang="less" scoped>
	.layout-header{
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
	}
	.layout-header-menu{
		padding: 0 20px;
	}
	.layout-logo{
		background: #39d;
		border-radius: 4px;
		float: left;
		height: 40px;
		margin-top: 10px;
		vertical-align: inherit;
	}
	.layout-logo img{
		vertical-align: inherit;
	}
	.layout-nav{
		// width: 420px;
		// margin: 0 auto;
		float: right;
	}
</style>

<template>
	<div class="layout-header">
		<Menu mode="horizontal" active-name="1" class="layout-header-menu">
			<a href="" class="layout-logo">
				<img src="/neucloud_logo.png" alt="">
			</a>
			<div class="layout-nav">
				<Menu-item name="1">
					<Icon type="ios-navigate"></Icon>
					指南
				</Menu-item>
				<Menu-item name="2">
					<Icon type="ios-keypad"></Icon>
					组件
				</Menu-item>
				<Submenu name="3">
					<template slot="title">
					<Icon type="stats-bars"></Icon>
					统计分析
					</template>
					<Menu-group title="使用">
						<Menu-item name="3-1">新增和启动</Menu-item>
						<Menu-item name="3-2">活跃分析</Menu-item>
						<Menu-item name="3-3">时段分析</Menu-item>
					</Menu-group>
					<Menu-group title="留存">
						<Menu-item name="3-4">用户留存</Menu-item>
						<Menu-item name="3-5">流失用户</Menu-item>
					</Menu-group>
				</Submenu>
			</div>
		</Menu>
	</div>
</template>

<script>
	export default {

	}
</script>
