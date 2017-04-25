<template>
	<div>
		<p>{{ formJson }}</p>

		<Form ref="formJson" :model="formJson" :rules="rule" :label-width="150">

			<Form-item label="加载类型" v-bind:title="explain.type" prop="type">
				<Row>
					<Col span="10">
						<Select v-model="type">
							<Option value="index">local</Option>
							<Option value="index_hadoop">hdfs</Option>
						</Select>
					</Col>
				</Row>
			</Form-item>

			<ioConfig :type="type" @on-change="ioConfigChange"/>

			<Form-item label="目标数据源" v-bind:title="explain.dataSource" prop="vld_dataSource">
				<Row>
					<Col span="10">
						<Input type="text" v-model="formJson.spec.dataSchema.dataSource"></Input>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="时间分片粒度" v-bind:title="explain.segmentGranularity">
				<Row>
					<Col span="10">
						<Select v-model="formJson.spec.dataSchema.granularitySpec.segmentGranularity">
							<Option value="HOUR">hour</Option>
							<Option value="DAY">day</Option>
							<Option value="WEEK">week</Option>
							<Option value="MONTH">month</Option>
						</Select>
					</Col>
				</Row>
			</Form-item>

			<Form-item label="时间段">
				<Row>
					<Col span="10">
						<Date-picker v-model="intervals" format="yyyy-MM-dd" type="daterange" placement="bottom-start" placeholder="选择日期" @on-change="dateChange" :editable="false"></Date-picker>
					</Col>
				</Row>
			</Form-item>

			<dataSchemaParser :type="type" @on-change="dataSchemaParserChange" @on-metrics-change="metricsChange"/>

			<tuningConfig :type="type" @on-change="tuningConfigChange"/>

			<Form-item>
				<Button type="primary" @click="handleSubmit('formJson')">提交</Button>
			</Form-item>
		</Form>

		<Alert type="error" v-if="error">{{error}}</Alert>

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
	import editor from 'vue2-ace-editor'
	import ioConfig from './components/ioConfig.vue'
	import dataSchemaParser from './components/dataSchemaParser.vue'
	import tuningConfig from './components/tuningConfig.vue'
	import axios from 'axios'

	const _ = require('lodash/lang');

	let types = {
		'index':'index',
		'index_hadoop':'hadoop'
	}

	export default {
		data () {
			return {
				explain: {
					type: "导入数据的方式,例如从Hadoop导入要选择hdfs",
					dataSource: "String类型,导入到druid中的数据库源名称,类似于关系型数据库中数据表的名称",
					segmentGranularity: "segment的存储粒度,比如以day为创建粒度,那么就会一天创建一个segment"
				},
				error: null,
				showModal: false,
				type: "index_hadoop",
				intervals: ["", ""],
				jsonBak: {},
				formJson:{
					"type": "index_hadoop",
					"spec": {
						"ioConfig": {},
						"dataSchema": {
							"dataSource": "fakedata__test_intervals_little",
							"granularitySpec": {
								"segmentGranularity": "DAY",
								"rollup": "false",
								"intervals": []
							},
							"parser": {},
							"metricsSpec": []
						},
						"tuningConfig": {}
					},
					"hadoopDependencyCoordinates": [
						"org.apache.hadoop:hadoop-client:2.6.0-cdh5.9.0"
					],
					"vld_dataSource": "fakedata__test_intervals_little"
				},
				rule: {
					type: { trigger: 'change', required: true, message: '请选择类型' },
					vld_dataSource: { trigger: 'blur', required: true, message: '请输入dataSource' }
					// vld_intervals: { trigger: 'change', required: true, type: 'date', message: '请选择日期' }
				}
			}
		},
		watch: {
			"formJson.spec.dataSchema.dataSource": function(newVal,oldVal) {
				this.formJson.vld_dataSource = newVal;
			},
			// "intervals": function(newVal,oldVal) {
			// 	this.formJson.vld_intervals = newVal;
			// },
			type() {
				this.formJson.type = this.type === 'index' ? 'index' : 'index_hadoop';
			}
		},
		methods: {
			editorInit() {
				require('vue2-ace-editor/node_modules/brace/mode/javascript');
				require('vue2-ace-editor/node_modules/brace/theme/monokai');
			},
			handleSubmit(name) {
				this.jsonBak = _.cloneDeep(this.formJson);

				if(this.jsonBak.spec.dataSchema.parser.parseSpec.format === 'json') {
					this.jsonBak.spec.dataSchema.parser.parseSpec.columns = undefined;
				}
				if(this.jsonBak.type === 'index') {
					this.jsonBak.hadoopDependencyCoordinates = undefined;
				}

				this.$refs[name].validate((valid) => {
					if (!valid) {
						return;
					}
					this.error = null;

					delete this.jsonBak.vld_dataSource;
					// delete this.jsonBak.vld_intervals;
					this.showModal = true;
					// alert('提交成功!');
				})
			},
			doSubmit() {
				// console.log(this.jsonBak)
				axios.post('/api/druid/indexer/v1/task', this.jsonBak, {
					headers: {'Content-Type': 'application/json'}
				}).then((response) => {
					console.log(response);
					// alert('提交成功');
				}).catch((error, res) => {
					if(error.response) {
						let { error: msg } = error.response.data;
						this.error = msg;
					}
				});
			},
	        ioConfigChange(config) {
	            this.formJson.spec.ioConfig = {
	                type: this._type,
	                [this.type === 'index' ? 'firehose' : 'inputSpec']: config
	            }
	        },
	        dateChange(date) {
	            this.formJson.spec.dataSchema.granularitySpec.intervals = [date.join('/')]
	        },
	        dataSchemaParserChange(dataSchema) {
	            this.formJson.spec.dataSchema.parser = {
	                type: this._type == 'hadoop' ? 'hadoopyString' : 'string',
	                ...dataSchema
	            }
	        },
	        metricsChange(metrics) {
	            this.formJson.spec.dataSchema.metricsSpec = metrics;
	        },
	        tuningConfigChange(config) {
	            this.formJson.spec.tuningConfig = {
	                type: this._type,
	                ...config
	            }
	        }
		},
		computed: {
			_type() {
				return types[this.type]
			},
			jsonStr() {
				return JSON.stringify(this.jsonBak,null,"\t");
			}
		},
		components: {
			editor, ioConfig, dataSchemaParser, tuningConfig
		}
	}
</script>
