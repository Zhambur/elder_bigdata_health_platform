import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



// 全局引入ECharts
import * as echarts from "echarts";
import VChart from "vue-echarts";

const app = createApp(App);
app.use(ElementPlus)



// 注册ECharts组件
app.component("VChart", VChart);

// 将echarts挂载到全局
app.config.globalProperties.$echarts = echarts;

app.mount("#app");
