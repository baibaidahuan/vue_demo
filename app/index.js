import Vue from 'vue/dist/vue';
import Stage from './views/stage.vue';
import VueRouter from 'vue-router';

import iView from 'iview';
import 'iview/dist/styles/iview.css'

Vue.use(iView);
Vue.use(VueRouter);

import testForm from './views/testForm.vue'
import test from './views/test.vue'

const routes = [
	{ path: '/test', component: test },
	{ path: '/testForm', component: testForm }
]

const router = new VueRouter({
	routes
})

new Vue({
	el: '#app',
	components: { Stage },
	router
})