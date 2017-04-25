<style lang="less" scoped>
	.layout{
		background: #f5f7f9;
	}
	.layout-content{
		min-height: 490px;
		margin: 20px;
		overflow: hidden;
		background: #fff;
		border-radius: 4px;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
	}
	.layout-content-main{
		padding: 20px;
	}
</style>

<template>
	<div class="layout">
		<UI-Header/>

		<div class="layout-content">
			<Row>
				<i-col span="4">
					<UI-Menu/>
				</i-col>
				<i-col span="20">
					<div class="layout-content-main">
						<Row>
							<Col span="16" offset="4">
								<!-- 内容区域 -->
								<router-view></router-view>
							</Col>
						</Row>
					</div>
				</i-col>
			</Row>
		</div>

		<UI-Footer/>
	</div>
</template>

<script>
	import UIHeader from '../components/header.vue'
	import UIMenu from '../components/menu.vue'
	import UIFooter from '../components/footer.vue'

	export default {
		components: {
			UIHeader, UIMenu, UIFooter
		}
	}
</script>

