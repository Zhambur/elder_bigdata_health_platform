<template> 
  <div class="dashboard">
  <!-- 标题 -->
  <div class="dashboard-header">
    <h1>区域老年人健康大数据多维度分析平台</h1>
    <div class="time">{{ currentTime }}</div>
  </div>
  
  <!-- 内容 -->
  <div class="dashboard-content">

  <!-- 左上：分布饼图 -->
  <div class="chart-container">
    <div class="chart-title">人群分布情况</div>
    <div class="combined-chart">
      <VChart :option="genderDistributionOption" class="chart-half" />
      <VChart :option="ageDistributionOption" class="chart-half" />
    </div>
  </div>

  <!-- 右上：已有风险观测柱状图 -->
  <div class="chart-container">
    <div class="chart-title">已有风险观测</div>
    <VChart :option="existingRiskBarOption" class="chart" @click="handleRiskBarClick"/>
  </div>

  <!-- 左下：指标情况箱线图 -->
  <div class="chart-container">
    <div class="chart-title">健康指标情况</div>
    <VChart :option="healthIndicatorOption" class="chart" />
  </div>

  <!-- 右下：慢病风险柱状图 -->
  <div class="chart-container">
    <div class="chart-title">慢病风险分析</div>
    <VChart :option="riskPredictionOption" class="chart" @click="handleRiskPredictionClick"/>
  </div>
 </div>           //dashboard-content

////////////////////////////////////////////
//第一个表格
    <el-dialog
      v-model="riskDetailDialogVisible"
      :title="`${selectedRisk} 详细数据`"
      width="80%"
      top="5vh"
      custom-class="risk-detail-dialog"
    >
      <el-table
        :data="pagedHealthData"
        border
        style="width: 100%"
        height="50vh"
        v-loading="loadingRiskDetail"
      >
        <el-table-column prop="序号" label="序号" width="80" fixed />
        <el-table-column prop="周" label="周" width="80" />
        <el-table-column prop="性别" label="性别" width="80" />
        <el-table-column prop="年龄" label="年龄" width="100" />
        <el-table-column prop="体质指数" label="体质指数" width="100" />
        <el-table-column prop="腰围" label="腰围" width="100" />
        <el-table-column prop="臀围" label="臀围" width="100" />
        <el-table-column prop="腰臀比" label="腰臀比" width="100" />
        <el-table-column prop="收缩压" label="收缩压" width="100" />
        <el-table-column prop="舒张压" label="舒张压" width="100" />
        <el-table-column prop="血氧" label="血氧" width="100" />
        <el-table-column prop="血糖" label="血糖" width="100" />
        <el-table-column prop="脉率" label="脉率" width="100" />
        <el-table-column prop="体脂" label="体脂率" width="100" />
        <el-table-column prop="总胆固醇" label="总胆固醇" width="100" />
        <el-table-column prop="用力肺活量" label="用力肺活量" width="100" />
        <el-table-column prop="尿酸" label="尿酸" width="100" />
        <el-table-column prop="骨密度" label="骨密度" width="100" />
        <el-table-column prop="睡眠时长" label="睡眠时长" width="100" />
        <el-table-column prop="心率" label="心率" width="100" />
        <el-table-column prop="水分含量" label="水分含量" width="100" />
        <el-table-column prop="基础代谢率" label="基础代谢率" width="100" />
        <el-table-column prop="体温" label="体温" width="100" />
        <el-table-column prop="血红蛋白" label="血红蛋白" width="100" />
        <el-table-column prop="甘油三酯" label="甘油三酯" width="100" />
        <el-table-column prop="高密度脂蛋白胆固醇" label="高密度脂蛋白胆固醇" width="100" />
        <el-table-column prop="低密度脂蛋白胆固醇" label="低密度脂蛋白胆固醇" width="100" />
        <el-table-column prop="尿pH" label="尿pH" width="100" />
        <el-table-column prop="尿比重" label="尿比重" width="100" />
        <el-table-column prop="呼吸频率" label="呼吸频率" width="100" />
      </el-table>

      <!-- 底部操作按钮 -->
      <template #footer>
        <el-button @click="riskDetailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportRiskDetail">导出数据</el-button>
      </template>
    </el-dialog>

<el-pagination
  v-if="1" 
  @current-change="handlePageChange"
  :current-page="currentPage"
  :page-size="pageSize"
  :total="100"
  layout="prev, pager, next, jumper"
/>

///////////////////////////////////////////////////////
//第二个表格
    <el-dialog
      v-model="predictionDetailDialogVisible"
      :title="`${selectedPredictionRisk} 详细数据`"
      width="80%"
      top="5vh"
      custom-class="risk-detail-dialog"
    >
      <el-table
        :data="pagedPredictionData"
        border
        style="width: 100%"
        height="50vh"
        v-loading="loadingPredictionDetail"
      >
        <el-table-column prop="序号" label="序号" width="80" fixed />
        <el-table-column prop="周" label="周" width="80" />
        <el-table-column prop="体质指数" label="体质指数" width="100" />
        <el-table-column prop="腰围" label="腰围" width="100" />
        <el-table-column prop="臀围" label="臀围" width="100" />
        <el-table-column prop="腰臀比" label="腰臀比" width="100" />
        <el-table-column prop="收缩压" label="收缩压" width="100" />
        <el-table-column prop="舒张压" label="舒张压" width="100" />
        <el-table-column prop="血氧" label="血氧" width="100" />
        <el-table-column prop="血糖" label="血糖" width="100" />
        <el-table-column prop="脉率" label="脉率" width="100" />
        <el-table-column prop="体脂" label="体脂率" width="100" />
        <el-table-column prop="总胆固醇" label="总胆固醇" width="100" />
        <el-table-column prop="用力肺活量" label="用力肺活量" width="100" />
        <el-table-column prop="尿酸" label="尿酸" width="100" />
        <el-table-column prop="骨密度" label="骨密度" width="100" />
        <el-table-column prop="睡眠时长" label="睡眠时长" width="100" />
        <el-table-column prop="心率" label="心率" width="100" />
        <el-table-column prop="水分含量" label="水分含量" width="100" />
        <el-table-column prop="基础代谢率" label="基础代谢率" width="100" />
        <el-table-column prop="体温" label="体温" width="100" />
        <el-table-column prop="血红蛋白" label="血红蛋白" width="100" />
        <el-table-column prop="甘油三酯" label="甘油三酯" width="100" />
        <el-table-column prop="高密度脂蛋白胆固醇" label="高密度脂蛋白" width="120" />
        <el-table-column prop="低密度脂蛋白胆固醇" label="低密度脂蛋白" width="120" />
        <el-table-column prop="尿pH" label="尿pH" width="100" />
        <el-table-column prop="尿比重" label="尿比重" width="100" />
        <el-table-column prop="呼吸频率" label="呼吸频率" width="100" />
      </el-table>

      <!-- 底部操作按钮 -->
      <template #footer>
        <el-button @click="predictionDetailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportPredictionDetail">导出数据</el-button>
      </template>
    </el-dialog>
    
    <el-pagination
      @current-change="handlePredictionPageChange"
      :current-page="currentPredictionPage"
      :page-size="pageSize"
      :total="100"
      layout="prev, pager, next, jumper"
    />


  </div>            //dashboard
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ElDialog, ElTable, ElTableColumn ,ElMessage, ElPagination} from 'element-plus';
import axios from "axios";
import Papa from "papaparse";

export default {
  name: "Dashboard",
  setup() {
    const currentTime = ref("");
        // 更新时间
    const updateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };
let timeInterval = null;


///////////////////////////////////////////////////////////////////////////////////////
//加载CSV数据
////////////////////////////////////////////////////////////////////////////////////////
const loadHealthData = async () => {
  try {
    const response = await fetch("/assets/data/health_data_utf8.csv"); 
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        
        existingRiskData_0.value = results.data;
        updateHealthIndicatorChart();
      },
      error: (error) => {
        console.error("CSV解析错误:", error);
      },
      // 确保数值字段被正确解析为数字
      transform: (value, field) => {
        if (INDICATORS.some(ind => ind.field === field)) {
          return isNaN(parseFloat(value)) ? null : parseFloat(value);
        }
        return value;
      }
    });
  } catch (error) {
    console.error("加载CSV文件失败:", error);
  }
};

const existingRiskData = ref([]);
// 加载已有风险数据
const loadExistingRiskData = async () => {
  try {
    const response = await fetch("/assets/data/现有_标签_2_风险观测.csv"); 
    const data = await response.text();
    Papa.parse(data, {
      complete: (result) => {
        
        existingRiskData.value = result.data;
        updateExistingRiskChart();
      },
      header: true,
    });
  } catch (error) {
    console.error("加载已有风险数据失败:", error);
  }
};




const PredictionData = ref([]);
const loadPredictionData = async () => {
  try {
    const response = await fetch("/assets/data/预测_标签.csv"); 
    const csvText = await response.text();
    
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        
        PredictionData.value = results.data;
      },
      error: (error) => {
        console.error("CSV解析错误:", error);
      },
      transform: (value, field) => {
        if (INDICATORS.some(ind => ind.field === field)) {
          return isNaN(parseFloat(value)) ? null : parseFloat(value);
        }
        return value;
      }
    });
  } catch (error) {
    console.error("加载CSV文件失败:", error);
  }
};

    // 加载风险预测数据
const riskPredictionData = ref([]);
const loadRiskPredictionData = async () => {
      try {
        const response = await fetch("/assets/data/预测_标签_2_风险预测.csv");
        const data = await response.text();
        Papa.parse(data, {
          complete: (result) => {
            riskPredictionData.value = result.data;
            updateRiskPredictionChart();
          },
          header: true,
        });
      } catch (error) {
        console.error("加载风险预测数据失败:", error);
      }
    };



//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
    
    const riskDetailDialogVisible = ref(false);
    const selectedRisk = ref("");
    const filteredHealthData = ref([]); 
    const loadingRiskDetail = ref(false);

    
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(10); // 每页显示的数量
    const pagedHealthData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = currentPage.value * pageSize.value;
      console.log(filteredHealthData.value.length);
      return filteredHealthData.value.slice(start, end);
    });


    const handlePageChange = (newPage) => {
      console.log(newPage);
      currentPage.value = newPage;
    };    






//////////////////////////////////////////////////////////////////////////////////////
//左上：性别与年龄
//////////////////////////////////////////////////////////////////////////////////////
    // 定义响应式变量来存储 CSV 数据
    const genderData = ref([]);
    const ageData = ref([]);

    // 加载性别比例数据
    const loadGenderData = async () => {
      const response = await fetch("/assets/data/性别比例.csv");
      const data = await response.text();
      Papa.parse(data, {
        complete: (result) => {
          genderData.value = result.data;
          updateGenderDistribution();
        },
        header: true,
      });
    };

    // 加载年龄比例数据
    const loadAgeData = async () => {
      const response = await fetch("/assets/data/年龄比例.csv");
      const data = await response.text();
      Papa.parse(data, {
        complete: (result) => {
          ageData.value = result.data;
          updateAgeDistribution();
        },
        header: true,
      });
    };

    // 更新性别分布数据
    const genderDistributionOption = ref({
      title: {
        text: "性别分布",
        textStyle: {
          color: "#fff",
          fontSize: 30,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "性别分布",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            color: "#fff",
            fontSize: 30,
          },
        },
      ],
      
  });

    // 更新年龄分布数据
    const ageDistributionOption = ref({
      title: {
        text: "年龄分布",
        textStyle: {
          color: "#fff",
          fontSize: 30,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "年龄分布",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            color: "#fff",
            fontSize: 30,
          },
        },
      ],
    });

    // 根据CSV数据更新性别分布
    const updateGenderDistribution = () => {
      const maleCount = genderData.value.find(row => row.性别 === "男性")?.人数 || 0;
      const femaleCount = genderData.value.find(row => row.性别 === "女性")?.人数 || 0;
      genderDistributionOption.value.series[0].data = [
        { value: femaleCount, name: "女性", itemStyle: { color: "#ff6b6b" } },
        { value: maleCount, name: "男性", itemStyle: { color: "#4ecdc4" } },
      ];
    };

    // 根据CSV数据更新年龄分布
    const updateAgeDistribution = () => {
      
      ageDistributionOption.value.series[0].data = [
        { value: parseInt(ageData.value.find(row => row.年龄分组 === "60岁以下")?.个数), name: "60岁以下", itemStyle: { color: "#45b7d1" } },
        { value: parseInt(ageData.value.find(row => row.年龄分组 === "60-70岁")?.个数), name: "60-70岁", itemStyle: { color: "#f9ca24" } },
        { value: parseInt(ageData.value.find(row => row.年龄分组 === "70-80岁")?.个数), name: "70-80岁", itemStyle: { color: "#6c5ce7" } },
        { value: parseInt(ageData.value.find(row => row.年龄分组 === "80-90岁")?.个数), name: "80-90岁", itemStyle: { color: "#a29bfe" } },
        { value: parseInt(ageData.value.find(row => row.年龄分组 === "90岁以上")?.个数), name: "90岁以上", itemStyle: { color: "#fd79a8" } },
      ];
    };
    
/////////////////////////////////////////////////////////////////////////////////////////
//右上：互动
///////////////////////////////////////////////////////////////////////////////////////////////////
const handleRiskBarClick = async (params) => {
  if (params.componentType === "series" && params.seriesType === "bar") {
    selectedRisk.value = params.name;
    loadingRiskDetail.value = true;
    riskDetailDialogVisible.value = true;
    
    currentPage.value = 1;
    // 异步获取风险详情数据，避免阻塞UI
    setTimeout(async () => {
      await getFilteredHealthData(params.name);
      loadingRiskDetail.value = false;
    }, 0); // 0毫秒延迟，放入异步队列中处理
  }
};

    // 获取符合风险条件的人员数据
    const getFilteredHealthData = async (riskType) => {
      try {
        // 根据风险类型获取符合条件的序号
        const selectedIndices = getAtRiskIndices(riskType);
        
        filteredHealthData.value = existingRiskData_0.value.filter(item =>
          selectedIndices.includes(parseInt(item.序号))
        );

        if (filteredHealthData.value.length === 0) {
          //ElMessage.warning(`未找到 ${riskType} 的相关数据`);
        }
        
      } catch (error) {
        console.error("获取风险详情数据失败:", error);
        ElMessage.error("获取风险详情数据失败");
      }
    };

    // 根据风险类型筛选出符合条件的序号
    const getAtRiskIndices = (riskType) => {
      const mapping = {
  "体质异常": { field: "体质类别", condition: value => value !== "正常" },
  "骨量异常": { field: "骨量", condition: value => value !== "正常" },
  "高血压": { field: "高血压", condition: value => value === 1 }, // 高血压为1表示患病
  "高血糖": { field: "高血糖", condition: value => value === 1 }, // 高血糖为1表示患病
  "高血脂": { field: "高血脂", condition: value => value === '1' }, // 高血脂为1表示患病
  "腰臀比异常": { field: "腰臀比异常", condition: value => value === '1' }, // 腰臀比异常为1表示患病
  "睡眠不足": { field: "睡眠不足", condition: value => value === '1' }, // 睡眠不足为1表示患病
  "动脉粥样硬化高风险": { field: "动脉粥样硬化高风险", condition: value => value === '1' }, // 动脉粥样硬化高风险为1表示患病
  "肾功能异常": { field: "肾功能异常", condition: value => value === '1' }, // 肾功能异常为1表示患病
  "体脂率偏高": { field: "体脂率偏高", condition: value => value === '1' }, // 体脂率偏高为1表示患病
  "呼吸系统综合风险": { field: "呼吸系统综合风险", condition: value => value === '1' }, // 呼吸系统综合风险为1表示患病
};

      if (!mapping[riskType]) {
        return [];
      }

      const { field, condition } = mapping[riskType];
      return existingRiskData.value.filter(row => condition(row[field])).map(row => parseInt(row.序号));
    };

    // 导出风险详情数据
    const exportRiskDetail = () => {
      if (filteredHealthData.value.length === 0) {
        ElMessage.warning("没有数据可导出");
        return;
      }

      try {
        const csv = Papa.unparse(filteredHealthData.value);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `${selectedRisk.value}_风险人群数据.csv`);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ElMessage.success("导出成功");
      } catch (error) {
        console.error("导出失败:", error);
        ElMessage.error("导出失败");
      }
    };



////////////////////////////////////////////////////////////////////////////////////////////
//右下：互动
////////////////////////////////////////////////////////////////////////////////////////////////
    const predictionDetailDialogVisible = ref(false);
    const selectedPredictionRisk = ref("");
    const filteredPredictionData = ref([]);
    const loadingPredictionDetail = ref(false);
    const currentPredictionPage = ref(1);
    
    // 右下角柱状图点击事件
const handleRiskPredictionClick = async (params) => {
  if (params.componentType === "series" && params.seriesType === "bar") {
    selectedPredictionRisk.value = params.name;
    loadingPredictionDetail.value = true;
    predictionDetailDialogVisible.value = true;

    // 将分页初始化为第一页
    currentPredictionPage.value = 1;

    // 异步获取风险详情数据，避免阻塞UI
    setTimeout(async () => {
      await getFilteredPredictionData(params.name);
      loadingPredictionDetail.value = false;
    }, 0); // 0毫秒延迟，放入异步队列中处理
  }
};

// 获取符合预测风险条件的人员数据
const getFilteredPredictionData = async (riskType) => {
  try {
    const selectedIndices = getPredictionRiskIndices(riskType);
    console.log(selectedIndices);
    filteredPredictionData.value = PredictionData.value.filter(item =>
      selectedIndices.includes(parseInt(item.序号))
    );

    if (filteredPredictionData.value.length === 0) {
      ElMessage.warning(`未找到 ${riskType} 的相关数据`);
    }

  } catch (error) {
    console.error("获取预测风险详情数据失败:", error);
    ElMessage.error("获取预测风险详情数据失败");
  }
};

// 根据预测风险类型筛选出符合条件的序号
const getPredictionRiskIndices = (riskType) => {
  const predictionRiskMapping = {
    "体质异常": { field: "体质类别", condition: value => value !== "正常" },
    "骨量异常": { field: "骨量", condition: value => value !== "正常" },
    "高血压": { field: "高血压", condition: value => value === '1' },
    "高血糖": { field: "高血糖", condition: value => value === '1' },
    "高血脂": { field: "高血脂", condition: value => value === '1' },
    "腰臀比异常": { field: "腰臀比异常", condition: value => value === '1' },
    "睡眠不足": { field: "睡眠不足", condition: value => value === '1' },
    "动脉粥样硬化高风险": { field: "动脉粥样硬化高风险", condition: value => value === '1' },
    "肾功能异常": { field: "肾功能异常", condition: value => value === '1' },
    "体脂率偏高": { field: "体脂率偏高", condition: value => value === '1' },
    "呼吸系统综合风险": { field: "呼吸系统综合风险", condition: value => value === '1' },
  };

  if (!predictionRiskMapping[riskType]) {
    return [];
  }

  const { field, condition } = predictionRiskMapping[riskType];
  console.log(riskPredictionData.value);
  return riskPredictionData.value.filter(row => condition(row[field])).map(row => parseInt(row.序号));
};

// 导出预测风险详情数据
const exportPredictionDetail = () => {
  if (filteredPredictionData.value.length === 0) {
    ElMessage.warning("没有数据可导出");
    return;
  }

  try {
    const csv = Papa.unparse(filteredPredictionData.value);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedPredictionRisk.value}_预测风险数据.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};
    
    // 分页数据计算
    const pagedPredictionData = computed(() => {
      console.log("filteredPredictionData:",filteredPredictionData.value);
      const start = (currentPredictionPage.value - 1) * pageSize.value;
      const end = currentPredictionPage.value * pageSize.value;
      return filteredPredictionData.value.slice(start, end);
    });
    
    // 分页改变事件
    const handlePredictionPageChange = (newPage) => {
      currentPredictionPage.value = newPage;
    };
    



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//右下：风险预测柱状图
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 风险预测图配置
    const riskPredictionOption = ref({
      title: {
        text: "健康风险预测",
        textStyle: {
          color: "#fff",
          fontSize: 30,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        top: "20%",
        left: "3%",
        right: "4%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [],
        axisLabel: {
          color: "#fff",
          fontSize: 20,
          interval: 0,
          rotate: 30,
        },
        axisLine: {
          lineStyle: {
            color: "#333",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#fff",
          fontSize: 20,
        },
        axisLine: {
          lineStyle: {
            color: "#333",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#333",
          },
        },
      },
      series: [
        {
          name: "风险人数",
          type: "bar",
          barWidth: "60%",
          data: [],
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#ff7e5f",
                },
                {
                  offset: 1,
                  color: "#feb47b",
                },
              ],
            },
            borderRadius: [5, 5, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            color: "#fff",
            fontSize: 16,
            formatter: "{c}",
          },
        },
      ],
    });


    

    // 更新风险预测图表
    const updateRiskPredictionChart = () => {
      if (!riskPredictionData.value || riskPredictionData.value.length === 0) return;

      // 定义风险类型
        const riskTypes = [
    "体质异常", "骨量异常", "高血压", "高血糖", "高血脂", 
    "腰臀比异常", "睡眠不足", "动脉粥样硬化高风险",
    "肾功能异常", "体脂率偏高", "呼吸系统综合风险"
  ];

  // 计算各项风险人数
  const riskCounts = {
    '体质异常': riskPredictionData.value.filter(row => row['体质类别'] !== '正常').length,
    '骨量异常': riskPredictionData.value.filter(row => row['骨量'] !== '正常').length,
    '高血压': riskPredictionData.value.filter(row => row['高血压'] === '1').length,
    '高血糖': riskPredictionData.value.filter(row => row['高血糖'] === '1').length,
    '高血脂': riskPredictionData.value.filter(row => row['高血脂'] === '1').length,
    '腰臀比异常': riskPredictionData.value.filter(row => row['腰臀比异常'] === '1').length,
    '睡眠不足': riskPredictionData.value.filter(row => row['睡眠不足'] === '1').length,
    '动脉粥样硬化高风险': riskPredictionData.value.filter(row => row['动脉粥样硬化高风险'] === '1').length,
    '肾功能异常': riskPredictionData.value.filter(row => row['肾功能异常'] === '1').length,
    '体脂率偏高': riskPredictionData.value.filter(row => row['体脂率偏高'] === '1').length,
    '呼吸系统综合风险': riskPredictionData.value.filter(row => row['呼吸系统综合风险'] === '1').length
  };

      // 更新图表配置
        // 更新图表配置
  riskPredictionOption.value.xAxis.data = riskTypes;
  riskPredictionOption.value.series[0].data = riskTypes.map(risk => riskCounts[risk]);
  
  // 调整图表高度以适应更多项目
  riskPredictionOption.value.grid.bottom = "15%";
    };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//右上：已有风险数据
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 定义响应式变量存储已有风险数据

const existingRiskBarOption = ref({});

// 更新已有风险柱状图
const updateExistingRiskChart = () => {
  if (!existingRiskData.value || existingRiskData.value.length === 0) return;

  // 计算各项异常数量
  const categories = [
    '体质异常', '骨量异常', '高血压', '高血糖', '高血脂', 
    '腰臀比异常', '睡眠不足', '动脉粥样硬化高风险', 
    '肾功能异常', '体脂率偏高', '呼吸系统综合风险'
  ];

  // 计算各项异常数量
  const counts = {
    '体质异常': existingRiskData.value.filter(row => row['体质类别'] !== '正常').length,
    '骨量异常': existingRiskData.value.filter(row => row['骨量'] !== '正常').length,
    '高血压': existingRiskData.value.filter(row => row['高血压'] === '1').length,
    '高血糖': existingRiskData.value.filter(row => row['高血糖'] === '1').length,
    '高血脂': existingRiskData.value.filter(row => row['高血脂'] === '1').length,
    '腰臀比异常': existingRiskData.value.filter(row => row['腰臀比异常'] === '1').length,
    '睡眠不足': existingRiskData.value.filter(row => row['睡眠不足'] === '1').length,
    '动脉粥样硬化高风险': existingRiskData.value.filter(row => row['动脉粥样硬化高风险'] === '1').length,
    '肾功能异常': existingRiskData.value.filter(row => row['肾功能异常'] === '1').length,
    '体脂率偏高': existingRiskData.value.filter(row => row['体脂率偏高'] === '1').length,
    '呼吸系统综合风险': existingRiskData.value.filter(row => row['呼吸系统综合风险'] === '1').length
  };
  
  // 更新图表配置
  existingRiskBarOption.value = {
    title: {
      text: "当前风险观测",
      textStyle: {
        color: "#fff",
        fontSize: 30,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "20%",
      left: "3%",
      right: "4%",
      bottom: "10%", // 增加底部空间防止标签重叠
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        color: "#fff",
        fontSize: 20,
        interval: 0, // 强制显示所有标签
        rotate: 30, // 旋转30度防止重叠
      },
      axisLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#fff",
        fontSize: 20,
      },
      axisLine: {
        lineStyle: {
          color: "#333",
        },
      },
      splitLine: {
        lineStyle: {
          color: "#333",
        },
      },
    },
    series: [
      {
        name: "异常人数",
        type: "bar",
        barWidth: '60%',
        data: categories.map(cat => counts[cat]),
        itemStyle: {
          color: function(params) {
            // 使用不同颜色区分不同类型的风险
            const colorList = [
              '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
              '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'
            ];
            return colorList[params.dataIndex];
          },
          borderRadius: [5, 5, 0, 0] // 顶部圆角
        },
        label: {
          show: true,
          position: 'top',
          color: '#fff',
          fontSize: 16,
          formatter: '{c}'
        }
      },
    ],
  };
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 左下：箱线图配置
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const healthIndicatorOption = ref({
  title: {
    text: "生理指标分布箱线图",
    textStyle: {
      color: "#fff",
      fontSize: 30,
    },
    left: "0%",
  },
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow",
    },
    formatter: function(params) {
      const data = params.data;
      return [
        `指标: ${params.name}`,
        `最大值: ${data[5].toFixed(2)}`,
        `上四分位数(Q3): ${data[4].toFixed(2)}`,
        `中位数: ${data[3].toFixed(2)}`,
        `下四分位数(Q1): ${data[2].toFixed(2)}`,
        `最小值: ${data[1].toFixed(2)}`,
        `异常值数量: ${data[6]?.length || 0}`
      ].join('<br/>');
    }
  },
  grid: {
    top: "15%",
    left: "5%",
    right: "5%",
    bottom: "15%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: [], // 动态填充
    axisLabel: {
      color: "#fff",
      fontSize: 20,
      rotate: 45,
      interval: 0
    },
    axisLine: {
      lineStyle: {
        color: "#fff"
      }
    }
  },
  yAxis: {
    type: "value",

    axisLabel: {
      color: "#fff",
      fontSize: 20
    },
    splitLine: {
      lineStyle: {
        color: "rgba(255, 255, 255, 0.1)"
      }
    }
  },
  series: [{
    name: "生理指标",
    type: "boxplot",
    data: [], // 动态填充
    itemStyle: {
      color: "#4ecdc4",
      borderColor: "#fff",
      borderWidth: 1
    },
    emphasis: {
      itemStyle: {
        color: "#ff6b6b",
        borderColor: "#fff"
      }
    }
  }],
  dataZoom: [{
    type: 'slider',
    xAxisIndex: 0,
    filterMode: 'filter',
    height: 20,
    bottom: 80,
    start: 0,
    end: 40
  }]
});

// 定义要展示的指标
const INDICATORS = [
  { name: "体质指数", field: "体质指数" },
  { name: "腰臀比", field: "腰臀比" },
  { name: "收缩压", field: "收缩压" },
  { name: "舒张压", field: "舒张压" },
  { name: "血氧", field: "血氧" },
  { name: "血糖", field: "血糖" },
  { name: "脉率", field: "脉率" },
  { name: "体脂", field: "体脂" },
  { name: "总胆固醇", field: "总胆固醇" },
  { name: "用力肺活量", field: "用力肺活量" },
  { name: "尿酸", field: "尿酸" },
  { name: "骨密度", field: "骨密度" },
  { name: "睡眠时长", field: "睡眠时长" },
  { name: "心率", field: "心率" },
  { name: "水分含量", field: "水分含量" },
  { name: "基础代谢率", field: "基础代谢率" },
  { name: "体温", field: "体温" },
  { name: "血红蛋白", field: "血红蛋白" },
  { name: "甘油三酯", field: "甘油三酯" },
  { name: "高密度脂蛋白", field: "高密度脂蛋白胆固醇" },
  { name: "低密度脂蛋白", field: "低密度脂蛋白胆固醇" },
  { name: "尿pH", field: "尿pH" },
  { name: "尿比重", field: "尿比重" },
  { name: "呼吸频率", field: "呼吸频率" }
];
const existingRiskData_0 = ref([]);
// 加载CSV数据






// 更新箱线图数据
const updateHealthIndicatorChart = () => {
  if (!existingRiskData_0.value || existingRiskData_0.value.length === 0) {
    console.error("无有效数据可用于绘制箱线图");
    return;
  }

  // 设置x轴标签
  healthIndicatorOption.value.xAxis.data = INDICATORS.map(ind => ind.name);

  // 计算每个指标的箱线图数据
  const boxplotData = INDICATORS.map(indicator => {
    // 提取该指标的所有有效值
    const values = existingRiskData_0.value
      .map(row => parseFloat(row[indicator.field]))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b);

    if (values.length === 0) {
      console.warn(`指标 ${indicator.name} 无有效数据`);
      return [0, 0, 0, 0, 0, []];
    }

    // 计算统计量
    const q1 = quantile(values, 0.25);
    const median = quantile(values, 0.5);
    const q3 = quantile(values, 0.75);
    const iqr = q3 - q1;
    
    // 计算异常值边界
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    // 识别异常值
    const outliers = values.filter(v => v < lowerBound || v > upperBound);
    
    // 计算正常范围的最小最大值
    const normalValues = values.filter(v => v >= lowerBound && v <= upperBound);
    const min = normalValues.length > 0 ? normalValues[0] : lowerBound;
    const max = normalValues.length > 0 ? normalValues[normalValues.length - 1] : upperBound;

    // 返回格式: [min, Q1, median, Q3, max, outliers]
    return [min, q1, median, q3, max, outliers];
  });

  // 更新图表数据
  healthIndicatorOption.value.series[0].data = boxplotData;
  
  // 强制更新图表
  healthIndicatorOption.value = {...healthIndicatorOption.value};
  
};

// 分位数计算辅助函数
function quantile(sortedArray, p) {
  const position = (sortedArray.length - 1) * p;
  const base = Math.floor(position);
  const rest = position - base;
  
  if (sortedArray[base + 1] !== undefined) {
    return sortedArray[base] + rest * (sortedArray[base + 1] - sortedArray[base]);
  } else {
    return sortedArray[base];
  }
}


    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onMounted(() => {
      loadGenderData(); 
      loadAgeData();  
      loadExistingRiskData(); 
      loadHealthData();
      loadPredictionData();
      loadRiskPredictionData(); 
      getFilteredHealthData();
      updateTime();
      timeInterval = setInterval(updateTime, 1000);
    });

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    });

    return {
      currentTime,
      genderDistributionOption,
      ageDistributionOption,
      riskPredictionOption,
      existingRiskBarOption,
      healthIndicatorOption,
      handleRiskBarClick,
      currentPage,
      pageSize,
      pagedHealthData,
      riskDetailDialogVisible,
      selectedRisk,
      handlePageChange,
      filteredHealthData,
      exportRiskDetail,
      exportPredictionDetail,
      loadingRiskDetail ,
            selectedPredictionRisk,
      filteredPredictionData,
      loadingPredictionDetail,
      currentPredictionPage,
      predictionDetailDialogVisible,
      handleRiskPredictionClick,
      pagedPredictionData,
      handlePredictionPageChange,
      pageSize
    };
  },
};
</script>

<style>
.dashboard {
  width: 100%;
  height: 100vh;
  background:url(/assets/bg.jpg) center center no-repeat; 
  background-size:cover;
  //color:#fff; 
  font-size: .1rem;
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  //justify-content: center; 
  align-items: center;
  padding: 20px 60px;
  height: 100px;
  position: relative;
}

.dashboard-header h1 {
  font-size: 60px;
  font-weight: 600;
  margin: 0 auto;
  background: linear-gradient(45deg, #00d4ff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: absolute;
  left: 50%;
  transform: translateX(-50%); /* ✅ 精准居中 */
}


.time {
  position: absolute;       /* ✅ 缺了这句！ */
  right: 40px;              /* 靠右边 40px */
  top: 50%;                 /* 垂直居中 */
  transform: translateY(-50%);
  font-size: 18px;
  font-weight: 500;
  color: #4ecdc4;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 120px);
  background: transparent;
  backdrop-filter: none;
}

.chart-container {
  height: 90%;
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background: transparent;
  backdrop-filter: none;
}

.chart-title {
  font-size: 40px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
  background: linear-gradient(45deg, #00d4ff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.chart {
  width: 100%;
  height: calc(100% - 50px);
}

.combined-chart {
  display: flex;
  height: calc(100% - 10px);
}

.chart-half {
  width: 50%;
  height: 100%;
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-header h1 {
    font-size: 24px;
  }

  .chart-title {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }

  .combined-chart {
    flex-direction: column;
  }

  .chart-half {
    width: 100%;
    height: 50%;
  }
}


.el-pagination {
  margin-top: 10px;
}

.detail-pagination {
  margin-top: 15px;
  justify-content: center;
}

.detail-pagination .el-pager li,
.detail-pagination button {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 18px;
}

.detail-pagination .el-pager li.active {
  background-color: #4ecdc4 !important;
  color: #000 !important;
}



</style>
