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
        <div
          class="combined-chart"
          v-if="!isLoadingDistribution && !errorStates.distribution"
        >
          <VChart
            :option="genderDistributionOption"
            class="chart-half"
            :autoresize="true"
            :update-options="{ notMerge: true }"
          />
          <VChart
            :option="ageDistributionOption"
            class="chart-half"
            :autoresize="true"
            :update-options="{ notMerge: true }"
          />
        </div>
        <div v-else-if="isLoadingDistribution" class="chart-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在加载人群分布数据...</div>
        </div>
        <div v-else-if="errorStates.distribution" class="chart-error">
          <div class="error-icon">⚠️</div>
          <div class="error-message">
            {{ errorStates.distribution.message }}
          </div>
          <div class="error-time">{{ errorStates.distribution.timestamp }}</div>
          <button
            v-if="errorStates.distribution.canRetry"
            @click="retryDataLoad('distribution')"
            class="retry-button"
          >
            重试 ({{ 3 - retryCount.distribution }}/3)
          </button>
        </div>
      </div>

      <!-- 右上：已有风险观测柱状图 -->
      <div class="chart-container">
        <div class="chart-title">已有风险观测</div>
        <VChart
          v-if="!isLoadingExistingRisk && !errorStates.existingRisk"
          :option="existingRiskBarOption"
          class="chart"
          :autoresize="true"
          :update-options="{ notMerge: true }"
          @click="handleRiskBarClick"
        />
        <div v-else-if="isLoadingExistingRisk" class="chart-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在加载风险观测数据...</div>
        </div>
        <div v-else-if="errorStates.existingRisk" class="chart-error">
          <div class="error-icon">⚠️</div>
          <div class="error-message">
            {{ errorStates.existingRisk.message }}
          </div>
          <div class="error-time">{{ errorStates.existingRisk.timestamp }}</div>
          <button
            v-if="errorStates.existingRisk.canRetry"
            @click="retryDataLoad('existingRisk')"
            class="retry-button"
          >
            重试 ({{ 3 - retryCount.existingRisk }}/3)
          </button>
        </div>
      </div>

      <!-- 左下：指标情况箱线图 -->
      <div class="chart-container">
        <div class="chart-title">健康指标情况</div>
        <VChart
          v-if="!isLoadingHealthIndicator && !errorStates.healthIndicator"
          :option="healthIndicatorOption"
          class="chart"
          :autoresize="true"
          :update-options="{ notMerge: true }"
        />
        <div v-else-if="isLoadingHealthIndicator" class="chart-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在加载健康指标数据...</div>
        </div>
        <div v-else-if="errorStates.healthIndicator" class="chart-error">
          <div class="error-icon">⚠️</div>
          <div class="error-message">
            {{ errorStates.healthIndicator.message }}
          </div>
          <div class="error-time">
            {{ errorStates.healthIndicator.timestamp }}
          </div>
          <button
            v-if="errorStates.healthIndicator.canRetry"
            @click="retryDataLoad('healthIndicator')"
            class="retry-button"
          >
            重试 ({{ 3 - retryCount.healthIndicator }}/3)
          </button>
        </div>
      </div>

      <!-- 右下：慢病风险柱状图 -->
      <div class="chart-container">
        <div class="chart-title">风险预警模型 </div>
        <VChart
          v-if="!isLoadingRiskPrediction && !errorStates.riskPrediction"
          :option="riskPredictionOption"
          class="chart"
          :autoresize="true"
          :update-options="{ notMerge: true }"
          @click="handleRiskPredictionClick"
        />
        <div v-else-if="isLoadingRiskPrediction" class="chart-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在加载风险预测数据...</div>
        </div>
        <div v-else-if="errorStates.riskPrediction" class="chart-error">
          <div class="error-icon">⚠️</div>
          <div class="error-message">
            {{ errorStates.riskPrediction.message }}
          </div>
          <div class="error-time">
            {{ errorStates.riskPrediction.timestamp }}
          </div>
          <button
            v-if="errorStates.riskPrediction.canRetry"
            @click="retryDataLoad('riskPrediction')"
            class="retry-button"
          >
            重试 ({{ 3 - retryCount.riskPrediction }}/3)
          </button>
        </div>
      </div>
    </div>
    //dashboard-content ////////////////////////////////////////////
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
        <el-table-column
          prop="高密度脂蛋白胆固醇"
          label="高密度脂蛋白胆固醇"
          width="100"
        />
        <el-table-column
          prop="低密度脂蛋白胆固醇"
          label="低密度脂蛋白胆固醇"
          width="100"
        />
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

    /////////////////////////////////////////////////////// //第二个表格
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
        <el-table-column
          prop="高密度脂蛋白胆固醇"
          label="高密度脂蛋白"
          width="120"
        />
        <el-table-column
          prop="低密度脂蛋白胆固醇"
          label="低密度脂蛋白"
          width="120"
        />
        <el-table-column prop="尿pH" label="尿pH" width="100" />
        <el-table-column prop="尿比重" label="尿比重" width="100" />
        <el-table-column prop="呼吸频率" label="呼吸频率" width="100" />
      </el-table>

      <!-- 底部操作按钮 -->
      <template #footer>
        <el-button @click="predictionDetailDialogVisible = false"
          >关闭</el-button
        >
        <el-button type="primary" @click="exportPredictionDetail"
          >导出数据</el-button
        >
      </template>
    </el-dialog>
  </div>
  //dashboard
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ElDialog,
  ElTable,
  ElTableColumn,
  ElMessage,
  ElPagination,
} from "element-plus";
import axios from "axios";
import Papa from "papaparse";

export default {
  name: "Dashboard",
  setup() {
    const currentTime = ref("");

    // 统一颜色主题配置
    const colorTheme = {
      // 主色调
      primary: "#4ecdc4",
      secondary: "#00d4ff",

      // 健康状态颜色
      healthy: "#4ecdc4", // 健康/正常 - 青色
      warning: "#f9ca24", // 警告/中风险 - 黄色
      danger: "#ff6b6b", // 危险/高风险 - 红色
      info: "#45b7d1", // 信息/低风险 - 蓝色

      // 性别颜色
      female: "#ff6b6b", // 女性 - 暖红色
      male: "#4ecdc4", // 男性 - 青色

      // 年龄组颜色 (渐进色谱)
      ageColors: [
        "#45b7d1", // 60岁以下 - 浅蓝
        "#4ecdc4", // 60-70岁 - 青色
        "#f9ca24", // 70-80岁 - 黄色
        "#ff9ff3", // 80-90岁 - 粉色
        "#ff6b6b", // 90岁以上 - 红色
      ],

      // 风险类型颜色 (按风险程度排序)
      riskColors: [
        "#4ecdc4", // 低风险
        "#45b7d1", // 较低风险
        "#6c5ce7", // 中等风险
        "#f9ca24", // 较高风险
        "#ff9ff3", // 高风险
        "#ff6b6b", // 极高风险
        "#ff7e5f", // 严重风险
        "#d63031", // 紧急
        "#2d3436", // 其他
        "#636e72", // 未分类
        "#a29bfe", // 备用
      ],

      // 渐变配置
      gradients: {
        primary: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#4ecdc4" },
            { offset: 1, color: "#00d4ff" },
          ],
        },
        warning: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "#ff7e5f" },
            { offset: 1, color: "#feb47b" },
          ],
        },
      },
    };

    // 统一动画配置
    const animationConfig = {
      // 基础动画配置
      basic: {
        animation: true,
        animationDuration: 1000,
        animationEasing: "cubicOut",
        animationDelay: 0,
      },

      // 渐进式动画配置
      progressive: {
        animation: true,
        animationDuration: 1200,
        animationEasing: "elasticOut",
        animationDelay: (idx) => idx * 100, // 每个数据项延迟100ms
      },

      // 更新动画配置
      update: {
        animation: true,
        animationDuration: 800,
        animationEasing: "quadraticInOut",
        animationDurationUpdate: 600,
        animationEasingUpdate: "cubicInOut",
      },

      // 交互动画配置
      interaction: {
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: "rgba(78, 205, 196, 0.6)",
          },
        },
        select: {
          itemStyle: {
            shadowBlur: 15,
            shadowColor: "rgba(255, 107, 107, 0.8)",
          },
        },
      },
    };

    // 加载状态管理
    const isLoadingDistribution = ref(true);
    const isLoadingExistingRisk = ref(true);
    const isLoadingHealthIndicator = ref(true);
    const isLoadingRiskPrediction = ref(true);

    // 错误状态管理
    const errorStates = ref({
      distribution: null,
      existingRisk: null,
      healthIndicator: null,
      riskPrediction: null,
    });

    // 重试计数器
    const retryCount = ref({
      distribution: 0,
      existingRisk: 0,
      healthIndicator: 0,
      riskPrediction: 0,
    });

    const MAX_RETRY_COUNT = 3;

    // 错误处理工具函数
    const handleDataLoadError = (errorType, error, retryCallback) => {
      console.error(`${errorType}数据加载失败:`, error);

      const friendlyMessages = {
        distribution: "人群分布数据加载失败，请检查网络连接",
        existingRisk: "风险观测数据加载失败，请稍后重试",
        healthIndicator: "健康指标数据加载失败，请检查数据源",
        riskPrediction: "风险预测数据加载失败，请重新加载",
      };

      errorStates.value[errorType] = {
        message: friendlyMessages[errorType] || "数据加载失败",
        canRetry: retryCount.value[errorType] < MAX_RETRY_COUNT,
        retryCallback,
        timestamp: new Date().toLocaleString(),
      };
    };

    // 重试函数
    const retryDataLoad = (errorType) => {
      if (retryCount.value[errorType] < MAX_RETRY_COUNT) {
        retryCount.value[errorType]++;
        errorStates.value[errorType] = null;

        // 重新设置加载状态
        switch (errorType) {
          case "distribution":
            isLoadingDistribution.value = true;
            break;
          case "existingRisk":
            isLoadingExistingRisk.value = true;
            break;
          case "healthIndicator":
            isLoadingHealthIndicator.value = true;
            break;
          case "riskPrediction":
            isLoadingRiskPrediction.value = true;
            break;
        }

        // 执行重试回调
        if (errorStates.value[errorType]?.retryCallback) {
          errorStates.value[errorType].retryCallback();
        }
      }
    };

    // 动态计算字体大小的函数
    const getResponsiveFontSize = (baseSize = 16) => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      if (vw <= 480) return Math.max(baseSize * 0.75, 12);
      if (vw <= 768) return Math.max(baseSize * 0.85, 14);
      if (vw <= 1200) return Math.max(baseSize * 0.95, 16);
      if (vw <= 1440) return baseSize;
      return Math.min(baseSize * 1.1, baseSize + 4);
    };

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
            isLoadingHealthIndicator.value = false;
          },
          error: (error) => {
            console.error("CSV解析错误:", error);
            isLoadingHealthIndicator.value = false;
          },
          // 确保数值字段被正确解析为数字
          transform: (value, field) => {
            if (INDICATORS.some((ind) => ind.field === field)) {
              return isNaN(parseFloat(value)) ? null : parseFloat(value);
            }
            return value;
          },
        });
      } catch (error) {
        console.error("加载CSV文件失败:", error);
        isLoadingHealthIndicator.value = false;
      }
    };

    const existingRiskData = ref([]);
    // 加载已有风险数据
    const loadExistingRiskData = async () => {
      try {
        const response = await fetch(
          "/assets/data/" + encodeURIComponent("现有_标签_2_风险观测.csv")
        );
        const data = await response.text();
        Papa.parse(data, {
          complete: (result) => {
            existingRiskData.value = result.data;
            updateExistingRiskChart();
            isLoadingExistingRisk.value = false;
          },
          header: true,
        });
      } catch (error) {
        console.error("加载已有风险数据失败:", error);
        isLoadingExistingRisk.value = false;
      }
    };

    const PredictionData = ref([]);
    const loadPredictionData = async () => {
      try {
        const response = await fetch(
          "/assets/data/" + encodeURIComponent("预测_标签.csv")
        );
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
            if (INDICATORS.some((ind) => ind.field === field)) {
              return isNaN(parseFloat(value)) ? null : parseFloat(value);
            }
            return value;
          },
        });
      } catch (error) {
        console.error("加载CSV文件失败:", error);
      }
    };

    // 加载风险预测数据
    const riskPredictionData = ref([]);
    const loadRiskPredictionData = async () => {
      try {
        const response = await fetch(
          "/assets/data/" + encodeURIComponent("预测_标签_2_风险预测.csv")
        );
        const data = await response.text();
        Papa.parse(data, {
          complete: (result) => {
            riskPredictionData.value = result.data;
            updateRiskPredictionChart();
            isLoadingRiskPrediction.value = false;
          },
          header: true,
        });
      } catch (error) {
        console.error("加载风险预测数据失败:", error);
        isLoadingRiskPrediction.value = false;
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
      try {
        const response = await fetch("/assets/data/性别比例.csv");
        const data = await response.text();
        Papa.parse(data, {
          complete: (result) => {
            genderData.value = result.data;
            updateGenderDistribution();
            checkDistributionLoadComplete();
          },
          header: true,
        });
      } catch (error) {
        console.error("加载性别分布数据失败:", error);
        handleDataLoadError("distribution", error, () => {
          loadGenderData();
          loadAgeData();
        });
      }
    };

    // 加载年龄比例数据
    const loadAgeData = async () => {
      try {
        const response = await fetch("/assets/data/年龄比例.csv");
        const data = await response.text();
        Papa.parse(data, {
          complete: (result) => {
            ageData.value = result.data;
            updateAgeDistribution();
            checkDistributionLoadComplete();
          },
          header: true,
        });
      } catch (error) {
        console.error("加载年龄分布数据失败:", error);
        handleDataLoadError("distribution", error, () => {
          loadGenderData();
          loadAgeData();
        });
      }
    };

    // 检查分布数据是否全部加载完成
    const checkDistributionLoadComplete = () => {
      if (genderData.value.length > 0 && ageData.value.length > 0) {
        isLoadingDistribution.value = false;
      }
    };

    // 更新性别分布数据
    const genderDistributionOption = ref({
      ...animationConfig.basic,
      animationDelay: (idx) => idx * 200, // 性别分布延迟动画
      title: {
        text: "性别分布",
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(30),
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: colorTheme.primary,
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
      },
      legend: {
        orient: "horizontal",
        bottom: "5%",
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(14),
        },
        selectedMode: true, // 支持多选，同时显示男性和女性
        icon: "circle",
      },
      series: [
        {
          name: "性别分布",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          data: [],
          emphasis: {
            ...animationConfig.interaction.emphasis,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: "rgba(78, 205, 196, 0.8)",
            },
          },
          select: animationConfig.interaction.select,
          label: {
            show:false,
          },
          labelLine: {
            lineStyle: {
              color: "#fff",
            },
          },
        },
      ],
    });

    // 更新年龄分布数据
    const ageDistributionOption = ref({
      ...animationConfig.progressive,
      title: {
        text: "年龄分布",
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(30),
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        backgroundColor: "rgba(50, 50, 50, 0.9)",
        borderColor: colorTheme.secondary,
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
      },
      legend: {
        orient: "horizontal",
        bottom: "5%",
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(14),
        },
        selectedMode: "multiple", // 支持多选切换
        icon: "circle",
      },
      series: [
        {
          name: "年龄分布",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "45%"],
          data: [],
          emphasis: {
            ...animationConfig.interaction.emphasis,
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 212, 255, 0.8)",
            },
          },
          select: animationConfig.interaction.select,
          label: {
            show:false,
          },
          labelLine: {
            lineStyle: {
              color: "#fff",
            },
          },
        },
      ],
    });

    // 根据CSV数据更新性别分布
    const updateGenderDistribution = () => {
      const maleCount =
        genderData.value.find((row) => row.性别 === "男性")?.人数 || 0;
      const femaleCount =
        genderData.value.find((row) => row.性别 === "女性")?.人数 || 0;
      genderDistributionOption.value.series[0].data = [
        {
          value: femaleCount,
          name: "女性",
          itemStyle: { color: colorTheme.female },
        },
        {
          value: maleCount,
          name: "男性",
          itemStyle: { color: colorTheme.male },
        },
      ];
    };

    // 根据CSV数据更新年龄分布
    const updateAgeDistribution = () => {
      const ageGroups = [
        "60岁以下",
        "60-70岁",
        "70-80岁",
        "80-90岁",
        "90岁以上",
      ];

      ageDistributionOption.value.series[0].data = ageGroups.map(
        (group, index) => ({
          value: parseInt(
            ageData.value.find((row) => row.年龄分组 === group)?.个数 || 0
          ),
          name: group,
          itemStyle: { color: colorTheme.ageColors[index] },
        })
      );
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

        filteredHealthData.value = existingRiskData_0.value.filter((item) =>
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
        体质异常: { field: "体质类别", condition: (value) => value !== "正常" },
        骨量异常: { field: "骨量", condition: (value) => value !== "正常" },
        高血压: { field: "高血压", condition: (value) => value === 1 }, // 高血压为1表示患病
        高血糖: { field: "高血糖", condition: (value) => value === 1 }, // 高血糖为1表示患病
        高血脂: { field: "高血脂", condition: (value) => value === "1" }, // 高血脂为1表示患病
        腰臀比异常: {
          field: "腰臀比异常",
          condition: (value) => value === "1",
        }, // 腰臀比异常为1表示患病
        睡眠不足: { field: "睡眠不足", condition: (value) => value === "1" }, // 睡眠不足为1表示患病
        动脉粥样硬化高风险: {
          field: "动脉粥样硬化高风险",
          condition: (value) => value === "1",
        }, // 动脉粥样硬化高风险为1表示患病
        肾功能异常: {
          field: "肾功能异常",
          condition: (value) => value === "1",
        }, // 肾功能异常为1表示患病
        体脂率偏高: {
          field: "体脂率偏高",
          condition: (value) => value === "1",
        }, // 体脂率偏高为1表示患病
        呼吸系统综合风险: {
          field: "呼吸系统综合风险",
          condition: (value) => value === "1",
        }, // 呼吸系统综合风险为1表示患病
      };

      if (!mapping[riskType]) {
        return [];
      }

      const { field, condition } = mapping[riskType];
      return existingRiskData.value
        .filter((row) => condition(row[field]))
        .map((row) => parseInt(row.序号));
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
        filteredPredictionData.value = PredictionData.value.filter((item) =>
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
        体质异常: { field: "体质类别", condition: (value) => value !== "正常" },
        骨量异常: { field: "骨量", condition: (value) => value !== "正常" },
        高血压: { field: "高血压", condition: (value) => value === "1" },
        高血糖: { field: "高血糖", condition: (value) => value === "1" },
        高血脂: { field: "高血脂", condition: (value) => value === "1" },
        腰臀比异常: {
          field: "腰臀比异常",
          condition: (value) => value === "1",
        },
        睡眠不足: { field: "睡眠不足", condition: (value) => value === "1" },
        动脉粥样硬化高风险: {
          field: "动脉粥样硬化高风险",
          condition: (value) => value === "1",
        },
        肾功能异常: {
          field: "肾功能异常",
          condition: (value) => value === "1",
        },
        体脂率偏高: {
          field: "体脂率偏高",
          condition: (value) => value === "1",
        },
        呼吸系统综合风险: {
          field: "呼吸系统综合风险",
          condition: (value) => value === "1",
        },
      };

      if (!predictionRiskMapping[riskType]) {
        return [];
      }

      const { field, condition } = predictionRiskMapping[riskType];
      console.log(riskPredictionData.value);
      return riskPredictionData.value
        .filter((row) => condition(row[field]))
        .map((row) => parseInt(row.序号));
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
        link.setAttribute(
          "download",
          `${selectedPredictionRisk.value}_预测风险数据.csv`
        );
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
      console.log("filteredPredictionData:", filteredPredictionData.value);
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
      ...animationConfig.progressive,
      title: {
        text: "风险预测柱状图",
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(30),
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(78, 205, 196, 0.1)",
          },
        },
        backgroundColor: "rgba(50, 50, 50, 0.95)",
        borderColor: colorTheme.warning,
        borderWidth: 1,
        textStyle: {
          color: "#fff",
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
          fontSize: getResponsiveFontSize(20),
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
            color: colorTheme.gradients.warning,
            borderRadius: [5, 5, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: colorTheme.gradients.primary,
              shadowBlur: 15,
              shadowColor: "rgba(78, 205, 196, 0.6)",
            },
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
      if (!riskPredictionData.value || riskPredictionData.value.length === 0)
        return;

      // 定义风险类型
      const riskTypes = [
        "体质异常",
        "骨量异常",
        "高血压",
        "高血糖",
        "高血脂",
        "腰臀比异常",
        "睡眠不足",
        "动脉粥样硬化高风险",
        "肾功能异常",
        "体脂率偏高",
        "呼吸系统综合风险",
      ];

      // 计算各项风险人数
      const riskCounts = {
        体质异常: riskPredictionData.value.filter(
          (row) => row["体质类别"] !== "正常"
        ).length,
        骨量异常: riskPredictionData.value.filter(
          (row) => row["骨量"] !== "正常"
        ).length,
        高血压: riskPredictionData.value.filter((row) => row["高血压"] === "1")
          .length,
        高血糖: riskPredictionData.value.filter((row) => row["高血糖"] === "1")
          .length,
        高血脂: riskPredictionData.value.filter((row) => row["高血脂"] === "1")
          .length,
        腰臀比异常: riskPredictionData.value.filter(
          (row) => row["腰臀比异常"] === "1"
        ).length,
        睡眠不足: riskPredictionData.value.filter(
          (row) => row["睡眠不足"] === "1"
        ).length,
        动脉粥样硬化高风险: riskPredictionData.value.filter(
          (row) => row["动脉粥样硬化高风险"] === "1"
        ).length,
        肾功能异常: riskPredictionData.value.filter(
          (row) => row["肾功能异常"] === "1"
        ).length,
        体脂率偏高: riskPredictionData.value.filter(
          (row) => row["体脂率偏高"] === "1"
        ).length,
        呼吸系统综合风险: riskPredictionData.value.filter(
          (row) => row["呼吸系统综合风险"] === "1"
        ).length,
      };

      // 更新图表配置
      // 更新图表配置
      riskPredictionOption.value.xAxis.data = riskTypes;
      riskPredictionOption.value.series[0].data = riskTypes.map(
        (risk) => riskCounts[risk]
      );

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
      if (!existingRiskData.value || existingRiskData.value.length === 0)
        return;

      // 计算各项异常数量
      const categories = [
        "体质异常",
        "骨量异常",
        "高血压",
        "高血糖",
        "高血脂",
        "腰臀比异常",
        "睡眠不足",
        "动脉粥样硬化高风险",
        "肾功能异常",
        "体脂率偏高",
        "呼吸系统综合风险",
      ];

      // 计算各项异常数量
      const counts = {
        体质异常: existingRiskData.value.filter(
          (row) => row["体质类别"] !== "正常"
        ).length,
        骨量异常: existingRiskData.value.filter((row) => row["骨量"] !== "正常")
          .length,
        高血压: existingRiskData.value.filter((row) => row["高血压"] === "1")
          .length,
        高血糖: existingRiskData.value.filter((row) => row["高血糖"] === "1")
          .length,
        高血脂: existingRiskData.value.filter((row) => row["高血脂"] === "1")
          .length,
        腰臀比异常: existingRiskData.value.filter(
          (row) => row["腰臀比异常"] === "1"
        ).length,
        睡眠不足: existingRiskData.value.filter(
          (row) => row["睡眠不足"] === "1"
        ).length,
        动脉粥样硬化高风险: existingRiskData.value.filter(
          (row) => row["动脉粥样硬化高风险"] === "1"
        ).length,
        肾功能异常: existingRiskData.value.filter(
          (row) => row["肾功能异常"] === "1"
        ).length,
        体脂率偏高: existingRiskData.value.filter(
          (row) => row["体脂率偏高"] === "1"
        ).length,
        呼吸系统综合风险: existingRiskData.value.filter(
          (row) => row["呼吸系统综合风险"] === "1"
        ).length,
      };

      // 更新图表配置
      existingRiskBarOption.value = {
        ...animationConfig.progressive,
        title: {
          text: "风险观测柱状图",
          textStyle: {
            color: "#fff",
            fontSize: getResponsiveFontSize(30),
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(78, 205, 196, 0.1)",
            },
          },
          backgroundColor: "rgba(50, 50, 50, 0.95)",
          borderColor: colorTheme.primary,
          borderWidth: 1,
          textStyle: {
            color: "#fff",
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
            fontSize: getResponsiveFontSize(20),
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
            fontSize: getResponsiveFontSize(20),
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
            barWidth: "60%",
            data: categories.map((cat) => counts[cat]),
            itemStyle: {
              color: function (params) {
                // 使用统一的风险颜色主题
                return (
                  colorTheme.riskColors[params.dataIndex] || colorTheme.primary
                );
              },
              borderRadius: [5, 5, 0, 0], // 顶部圆角
            },
            emphasis: {
              itemStyle: {
                color: function (params) {
                  return colorTheme.primary;
                },
                shadowBlur: 15,
                shadowColor: "rgba(78, 205, 196, 0.6)",
              },
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
      };
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 左下：箱线图配置
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const healthIndicatorOption = ref({
      ...animationConfig.progressive,
      animationDelay: (idx) => idx * 80, // 更密集的动画延迟
      title: {
        text: "生理指标分布箱线图",
        textStyle: {
          color: "#fff",
          fontSize: getResponsiveFontSize(30),
        },
        left: "0%",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(78, 205, 196, 0.1)",
          },
        },
        backgroundColor: "rgba(50, 50, 50, 0.95)",
        borderColor: colorTheme.primary,
        borderWidth: 1,
        textStyle: {
          color: "#fff",
        },
        formatter: function (params) {
          const data = params.data;
          return [
            `<strong style="color: ${colorTheme.primary};">指标: ${params.name}</strong>`,
            `最大值: <span style="color: ${
              colorTheme.danger
            };">${data[5].toFixed(2)}</span>`,
            `上四分位数(Q3): ${data[4].toFixed(2)}`,
            `中位数: <span style="color: ${
              colorTheme.warning
            };">${data[3].toFixed(2)}</span>`,
            `下四分位数(Q1): ${data[2].toFixed(2)}`,
            `最小值: <span style="color: ${colorTheme.info};">${data[1].toFixed(
              2
            )}</span>`,
            `异常值数量: ${data[6]?.length || 0}`,
          ].join("<br/>");
        },
      },
      grid: {
        top: "15%",
        left: "5%",
        right: "5%",
        bottom: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: [], // 动态填充
        axisLabel: {
          color: "#fff",
          fontSize: getResponsiveFontSize(20),
          rotate: 45,
          interval: 0,
        },
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        type: "value",

        axisLabel: {
          color: "#fff",
          fontSize: getResponsiveFontSize(20),
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      series: [
        {
          name: "生理指标",
          type: "boxplot",
          data: [], // 动态填充
          itemStyle: {
            color: colorTheme.primary,
            borderColor: "#fff",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              color: colorTheme.danger,
              borderColor: "#fff",
            },
          },
        },
      ],
      dataZoom: [
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "filter",
          height: 20,
          bottom: 80,
          start: 0,
          end: 40,
        },
      ],
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
      { name: "呼吸频率", field: "呼吸频率" },
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
      healthIndicatorOption.value.xAxis.data = INDICATORS.map(
        (ind) => ind.name
      );

      // 计算每个指标的箱线图数据
      const boxplotData = INDICATORS.map((indicator) => {
        // 提取该指标的所有有效值
        const values = existingRiskData_0.value
          .map((row) => parseFloat(row[indicator.field]))
          .filter((v) => !isNaN(v))
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
        const outliers = values.filter((v) => v < lowerBound || v > upperBound);

        // 计算正常范围的最小最大值
        const normalValues = values.filter(
          (v) => v >= lowerBound && v <= upperBound
        );
        const min = normalValues.length > 0 ? normalValues[0] : lowerBound;
        const max =
          normalValues.length > 0
            ? normalValues[normalValues.length - 1]
            : upperBound;

        // 返回格式: [min, Q1, median, Q3, max, outliers]
        return [min, q1, median, q3, max, outliers];
      });

      // 更新图表数据
      healthIndicatorOption.value.series[0].data = boxplotData;

      // 强制更新图表
      healthIndicatorOption.value = { ...healthIndicatorOption.value };
    };

    // 分位数计算辅助函数
    function quantile(sortedArray, p) {
      const position = (sortedArray.length - 1) * p;
      const base = Math.floor(position);
      const rest = position - base;

      if (sortedArray[base + 1] !== undefined) {
        return (
          sortedArray[base] + rest * (sortedArray[base + 1] - sortedArray[base])
        );
      } else {
        return sortedArray[base];
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 防抖处理的resize事件
    let resizeTimer = null;
    const handleResize = () => {
      // 清除之前的定时器
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }

      // 延迟执行图表更新，避免频繁重绘
      resizeTimer = setTimeout(() => {
        // 更新所有图表的字体大小
        updateChartFontSizes();

        // 强制更新所有图表配置，触发图表重绘
        genderDistributionOption.value = { ...genderDistributionOption.value };
        ageDistributionOption.value = { ...ageDistributionOption.value };
        existingRiskBarOption.value = { ...existingRiskBarOption.value };
        riskPredictionOption.value = { ...riskPredictionOption.value };
        healthIndicatorOption.value = { ...healthIndicatorOption.value };
      }, 300); // 300ms防抖延迟
    };

    // 更新图表字体大小的函数
    const updateChartFontSizes = () => {
      const titleFontSize = getResponsiveFontSize(30);
      const labelFontSize = getResponsiveFontSize(20);
      const axisFontSize = getResponsiveFontSize(20);

      // 更新性别分布图字体
      if (genderDistributionOption.value.title) {
        genderDistributionOption.value.title.textStyle.fontSize = titleFontSize;
      }
      if (genderDistributionOption.value.series?.[0]?.label) {
        genderDistributionOption.value.series[0].label.fontSize = labelFontSize;
      }

      // 更新年龄分布图字体
      if (ageDistributionOption.value.title) {
        ageDistributionOption.value.title.textStyle.fontSize = titleFontSize;
      }
      if (ageDistributionOption.value.series?.[0]?.label) {
        ageDistributionOption.value.series[0].label.fontSize = labelFontSize;
      }

      // 更新风险预测图字体
      if (riskPredictionOption.value.title) {
        riskPredictionOption.value.title.textStyle.fontSize = titleFontSize;
      }

      // 更新健康指标图字体
      if (healthIndicatorOption.value.title) {
        healthIndicatorOption.value.title.textStyle.fontSize = titleFontSize;
      }
    };

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

      // 添加窗口尺寸变化监听器
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      // 移除事件监听器
      window.removeEventListener("resize", handleResize);
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
      loadingRiskDetail,
      selectedPredictionRisk,
      filteredPredictionData,
      loadingPredictionDetail,
      currentPredictionPage,
      predictionDetailDialogVisible,
      handleRiskPredictionClick,
      pagedPredictionData,
      handlePredictionPageChange,
      pageSize,
      // 加载状态
      isLoadingDistribution,
      isLoadingExistingRisk,
      isLoadingHealthIndicator,
      isLoadingRiskPrediction,
      // 错误状态
      errorStates,
      retryCount,
      retryDataLoad,
    };
  },
};
</script>

<style>
.dashboard {
  width: 100%;
  min-height: 100vh;
  background: url(/assets/bg.jpg) center center no-repeat;
  background-size: cover;
  color: #fff;
  font-size: 0.1rem;
  position: relative;
  padding-bottom: 50px; /* 底部留出空间，确保内容不被截断 */
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(20px, 3vh, 30px) clamp(30px, 4vw, 50px);
  min-height: clamp(80px, 10vh, 120px);
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-header h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 600;
  margin: 0;
  background: linear-gradient(45deg, #00d4ff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  flex: 1;
}

.time {
  font-size: clamp(0.875rem, 1.2vw, 1.125rem);
  font-weight: 500;
  color: #4ecdc4;
  white-space: nowrap;
  margin-left: 20px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 3vw, 30px);
  padding: clamp(20px, 3vw, 30px);
  width: 100%;
  box-sizing: border-box;
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(10px, 1.5vw, 15px);
  padding: clamp(20px, 2.5vw, 25px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  min-height: clamp(400px, 50vh, 600px);
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: clamp(1.125rem, 2.5vw, 1.75rem);
  font-weight: 600;
  margin-bottom: clamp(15px, 2vh, 20px);
  text-align: center;
  background: linear-gradient(45deg, #00d4ff, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.chart {
  width: 100%;
  height: clamp(350px, 45vh, 500px);
  flex: 1;
}

.combined-chart {
  display: flex;
  width: 100%;
  height: clamp(350px, 45vh, 500px);
  flex: 1;
}

.chart-half {
  width: 50%;
  height: 100%;
}

/* 加载状态样式 */
.chart-loading {
  width: 100%;
  height: clamp(350px, 45vh, 500px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: #4ecdc4;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(78, 205, 196, 0.2);
  border-left: 4px solid #4ecdc4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: clamp(0.875rem, 1.2vw, 1rem);
  font-weight: 500;
  color: rgba(78, 205, 196, 0.9);
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

/* 平板设备适配 */
@media (max-width: 1024px) {
  .dashboard-content {
    gap: clamp(15px, 2.5vw, 25px);
    padding: clamp(15px, 2.5vw, 25px);
  }

  .chart-container {
    min-height: clamp(350px, 45vh, 500px);
  }

  .chart {
    height: clamp(300px, 40vh, 450px);
  }

  .combined-chart {
    height: clamp(300px, 40vh, 450px);
  }
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .dashboard {
    padding-bottom: 80px; /* 移动端增加底部空间 */
  }

  .dashboard-header {
    flex-direction: column;
    text-align: center;
    padding: clamp(20px, 4vw, 25px);
    min-height: auto;
    gap: 10px;
  }

  .dashboard-header h1 {
    font-size: clamp(1.25rem, 5vw, 2rem);
    margin-bottom: 10px;
  }

  .time {
    margin-left: 0;
    font-size: clamp(0.875rem, 3vw, 1rem);
  }

  .dashboard-content {
    grid-template-columns: 1fr;
    gap: clamp(20px, 4vw, 30px);
    padding: clamp(20px, 4vw, 30px);
  }

  .chart-container {
    min-height: clamp(350px, 60vh, 500px);
    padding: clamp(15px, 3vw, 20px);
  }

  .chart {
    height: clamp(300px, 50vh, 400px);
  }

  .combined-chart {
    flex-direction: column;
    height: clamp(350px, 60vh, 500px);
  }

  .chart-half {
    width: 100%;
    height: 50%;
    min-height: clamp(150px, 25vh, 200px);
  }
}

/* 小屏幕手机适配 */
@media (max-width: 480px) {
  .dashboard {
    padding-bottom: 100px;
  }

  .dashboard-header {
    padding: 15px 20px;
  }

  .dashboard-header h1 {
    font-size: clamp(1.125rem, 6vw, 1.5rem);
    line-height: 1.2;
  }

  .time {
    font-size: clamp(0.75rem, 4vw, 0.875rem);
  }

  .dashboard-content {
    gap: 15px;
    padding: 15px;
  }

  .chart-container {
    min-height: clamp(300px, 70vh, 400px);
    padding: 15px;
    border-radius: 10px;
  }

  .chart-title {
    font-size: clamp(1rem, 4vw, 1.25rem);
    margin-bottom: 10px;
  }

  .chart {
    height: clamp(250px, 60vh, 350px);
  }

  .combined-chart {
    height: clamp(280px, 65vh, 380px);
  }

  .chart-half {
    min-height: clamp(120px, 30vh, 160px);
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .dashboard-header {
    padding: 10px 15px;
  }

  .dashboard-header h1 {
    font-size: clamp(1rem, 7vw, 1.25rem);
  }

  .dashboard-content {
    gap: 10px;
    padding: 10px;
  }

  .chart-container {
    min-height: clamp(250px, 75vh, 350px);
    padding: 10px;
  }

  .chart {
    height: clamp(200px, 65vh, 300px);
  }

  .combined-chart {
    height: clamp(230px, 70vh, 330px);
  }
}

/* 大屏幕优化 */
@media (min-width: 1920px) {
  .dashboard-content {
    gap: clamp(30px, 2.5vw, 40px);
    padding: clamp(30px, 2.5vw, 40px);
    max-width: 1800px;
    margin: 0 auto;
  }

  .chart-container {
    min-height: clamp(500px, 55vh, 700px);
    padding: clamp(25px, 2vw, 35px);
  }

  .chart {
    height: clamp(450px, 50vh, 650px);
  }

  .combined-chart {
    height: clamp(450px, 50vh, 650px);
  }
}

/* 确保分页组件样式 */
.el-pagination {
  margin-top: 20px;
  justify-content: center;
  padding: 0 20px;
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

/* 确保对话框在移动端也能正常显示 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto !important;
  }

  .el-dialog__body {
    padding: 10px !important;
  }

  .el-table {
    font-size: 12px !important;
  }

  .el-table th,
  .el-table td {
    padding: 8px 4px !important;
  }
}

/* 错误状态样式 */
.chart-error {
  width: 100%;
  height: clamp(350px, 45vh, 500px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
  animation: shake 2s ease-in-out infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.error-message {
  font-size: clamp(0.875rem, 1.2vw, 1.125rem);
  font-weight: 600;
  color: #ff6b6b;
  margin-bottom: 5px;
}

.error-time {
  font-size: clamp(0.75rem, 1vw, 0.875rem);
  color: rgba(255, 107, 107, 0.7);
  margin-bottom: 15px;
}

.retry-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff9ff3 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: clamp(0.875rem, 1vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff5252 0%, #ff8a80 100%);
}

.retry-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 平板设备适配 */
@media (max-width: 1024px) {
  .dashboard-content {
    gap: clamp(15px, 2.5vw, 25px);
    padding: clamp(15px, 2.5vw, 25px);
  }

  .chart-container {
    min-height: clamp(350px, 45vh, 500px);
  }

  .chart {
    height: clamp(300px, 40vh, 450px);
  }

  .combined-chart {
    height: clamp(300px, 40vh, 450px);
  }
}

/* 移动设备适配 */
@media (max-width: 768px) {
  .dashboard {
    padding-bottom: 80px; /* 移动端增加底部空间 */
  }

  .dashboard-header {
    flex-direction: column;
    text-align: center;
    padding: clamp(20px, 4vw, 25px);
    min-height: auto;
    gap: 10px;
  }

  .dashboard-header h1 {
    font-size: clamp(1.25rem, 5vw, 2rem);
    margin-bottom: 10px;
  }

  .time {
    margin-left: 0;
    font-size: clamp(0.875rem, 3vw, 1rem);
  }

  .dashboard-content {
    grid-template-columns: 1fr;
    gap: clamp(20px, 4vw, 30px);
    padding: clamp(20px, 4vw, 30px);
  }

  .chart-container {
    min-height: clamp(350px, 60vh, 500px);
    padding: clamp(15px, 3vw, 20px);
  }

  .chart {
    height: clamp(300px, 50vh, 400px);
  }

  .combined-chart {
    flex-direction: column;
    height: clamp(350px, 60vh, 500px);
  }

  .chart-half {
    width: 100%;
    height: 50%;
    min-height: clamp(150px, 25vh, 200px);
  }
}

/* 小屏幕手机适配 */
@media (max-width: 480px) {
  .dashboard {
    padding-bottom: 100px;
  }

  .dashboard-header {
    padding: 15px 20px;
  }

  .dashboard-header h1 {
    font-size: clamp(1.125rem, 6vw, 1.5rem);
    line-height: 1.2;
  }

  .time {
    font-size: clamp(0.75rem, 4vw, 0.875rem);
  }

  .dashboard-content {
    gap: 15px;
    padding: 15px;
  }

  .chart-container {
    min-height: clamp(300px, 70vh, 400px);
    padding: 15px;
    border-radius: 10px;
  }

  .chart-title {
    font-size: clamp(1rem, 4vw, 1.25rem);
    margin-bottom: 10px;
  }

  .chart {
    height: clamp(250px, 60vh, 350px);
  }

  .combined-chart {
    height: clamp(280px, 65vh, 380px);
  }

  .chart-half {
    min-height: clamp(120px, 30vh, 160px);
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .dashboard-header {
    padding: 10px 15px;
  }

  .dashboard-header h1 {
    font-size: clamp(1rem, 7vw, 1.25rem);
  }

  .dashboard-content {
    gap: 10px;
    padding: 10px;
  }

  .chart-container {
    min-height: clamp(250px, 75vh, 350px);
    padding: 10px;
  }

  .chart {
    height: clamp(200px, 65vh, 300px);
  }

  .combined-chart {
    height: clamp(230px, 70vh, 330px);
  }
}

/* 大屏幕优化 */
@media (min-width: 1920px) {
  .dashboard-content {
    gap: clamp(30px, 2.5vw, 40px);
    padding: clamp(30px, 2.5vw, 40px);
    max-width: 1800px;
    margin: 0 auto;
  }

  .chart-container {
    min-height: clamp(500px, 55vh, 700px);
    padding: clamp(25px, 2vw, 35px);
  }

  .chart {
    height: clamp(450px, 50vh, 650px);
  }

  .combined-chart {
    height: clamp(450px, 50vh, 650px);
  }
}

/* 确保分页组件样式 */
.el-pagination {
  margin-top: 20px;
  justify-content: center;
  padding: 0 20px;
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

/* 确保对话框在移动端也能正常显示 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 0 auto !important;
  }

  .el-dialog__body {
    padding: 10px !important;
  }

  .el-table {
    font-size: 12px !important;
  }

  .el-table th,
  .el-table td {
    padding: 8px 4px !important;
  }
}
</style>
