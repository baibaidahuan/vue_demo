<template>
	<div>
		<p>{{ json }}</p>

		<Form ref="json" :model="json" :rules="rule" :label-width="150">

			<Form-item label="加载类型">
				<Row>
					<Col span="10">
						<Select v-model="json.type">
							<Option value="kafka">kafka</Option>
						</Select>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="ioConfig_topic" prop="vld_topic">
				<Row>
					<Col span="10">
						<Input type="text" v-model="json.ioConfig.topic" placeholder="请输入topic"></Input>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="bootstrap_servers">
				<Row>
					<Col span="10">
						<Input type="text" v-model="json.ioConfig.consumerProperties['bootstrap.servers']" placeholder="请输入servers"></Input>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="ioConfig_replicas" prop="vld_replicas">
				<Input-number v-model="json.ioConfig.replicas" :min="1" :max="3"></Input-number>
			</Form-item>

			<Form-item label="目标数据源" prop="vld_dataSource">
				<Row>
					<Col span="10">
						<Input type="text" v-model="json.dataSchema.dataSource" placeholder="请输入目标数据源"></Input>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="时间分片粒度">
				<Row>
					<Col span="10">
						<Select v-model="json.dataSchema.granularitySpec.segmentGranularity">
							<Option value="HOUR">hour</Option>
							<Option value="DAY">day</Option>
							<Option value="WEEK">week</Option>
							<Option value="MONTH">month</Option>
						</Select>
					</Col>
				</Row>
			</Form-item>

			<dataSchemaParser type="string" @on-change="dataSchemaParserChange" @on-metrics-change="metricsChange"/>

			<Form-item label="reportParseExceptions">
				<i-switch v-model="json.tuningConfig.reportParseExceptions">
					<span slot="open">开</span>
					<span slot="close">关</span>
				</i-switch>
			</Form-item>

			<Form-item>
				<Button type="primary" @click="handleSubmit('json')">提交</Button>
			</Form-item>
		</Form>

		<Modal
			title="format脚本配置"
			width="800"
			v-model="showModal"
			class="vertical-center-modal"
			@on-ok="doSubmit">
			<editor v-model="jsonStr" @init="editorInit" lang="javascript" theme="monokai" height="400"></editor>
		</Modal>
	</div>
</template>

<script>
	import dataSchemaParser from './components/dataSchemaParser.vue'
	import editor from 'vue2-ace-editor'
	import axios from 'axios'

	export default {
		data() {
			return {
				showModal: false,
				error: null,
				json: {
					"type": "kafka",
					"ioConfig": {
						"topic": "",
						"consumerProperties": {
							"bootstrap.servers": "172.24.4.185:9092"
						},
						"taskCount": 1,
						"taskDuration": "PT10M",
						"startDelay": "PT5S",
						"period": "PT30S",
						"useEarliestOffset": "false",
						"completionTimeout": "PT10M",
						"replicas": 1
					},
					"dataSchema": {
						"dataSource": "",
						"granularitySpec": {
							"type": "uniform",
							"segmentGranularity": "DAY",
							"queryGranularity": "NONE"
						},
						"parser": {},
						"metricsSpec": []
					},
					"tuningConfig": {
						"type": "kafka",
						"maxRowsInMemory": 100000,
						"maxRowsPerSegment": 5000000,
						"intermediatePersistPeriod": "PT10M",
						"maxPendingPersists": 0,
						"indexSpec": {
							"bitmap": {
								"type": "concise"
							},
							"dimensionCompression":"lz4",
							"metricCompression":"lz4"
						},
						"buildV9Directly": true,
						"handoffConditionTimeout": 0,
						"reportParseExceptions": false
					},
					"vld_topic": "",
					"vld_replicas": 1,
					"vld_dataSource": ""
				},
				rule: {
					// type: { trigger: 'change', required: true, message: '请选择类型' },
					vld_topic: { required: true, message: '请输入topic', trigger: 'blur' },
					vld_replicas: {required: true, message: '请输入replicas'},
					vld_dataSource: {required: true, message: '请输入目标数据源', trigger: 'blur'}
				}
			}
		},
		watch: {
			"json.ioConfig.topic": function(newVal,oldVal) {
				this.json.vld_topic = newVal;
			},
			"json.ioConfig.replicas": function(newVal,oldVal) {
				this.json.vld_replicas = newVal;
			},
			"json.dataSchema.dataSource": function(newVal,oldVal) {
				this.json.vld_dataSource = newVal;
			}
		},
		methods: {
			editorInit() {
				require('vue2-ace-editor/node_modules/brace/mode/javascript');
				require('vue2-ace-editor/node_modules/brace/theme/monokai');
			},
			dataSchemaParserChange(dataSchema) {
				this.json.dataSchema.parser = { ...dataSchema }
			},
			metricsChange(metrics) {
				this.json.dataSchema.metricsSpec = metrics;
			},
			handleSubmit(name) {
				this.$refs[name].validate((valid) => {
					if (!valid) {
						return;
					}
					this.error = null;

					this.json.vld_topic = undefined;
					this.json.vld_replicas = undefined;
					this.json.vld_dataSource = undefined;
					// delete this.jsonBak.vld_intervals;
					this.showModal = true;
					// alert('提交成功!');
				})
				// this.showModal = true;
			},
			doSubmit() {
				axios.get(`/api/druid/indexer/v1/supervisor/${this.json.dataSchema.dataSource}`).then((res) => {
					console.log(res,res.status);
					if(res.status == 200) {
						this.$Message.info('该条数据已存在');
						return;
					}
				}).catch((error) => {
					console.log(error);
					if(error) {
						axios.post('/api/druid/indexer/v1/supervisor', this.json, {
							headers: {'Content-Type': 'application/json'}
						}).then((response) => {
							console.log(response);
						}).catch((error) => {
							console.log(error)
						})
					}
				})
			}
		},
		computed: {
			jsonStr() {
				return JSON.stringify(this.json,null,"\t");
			}
		},
		components: {
			dataSchemaParser, editor
		}
	}
</script>

