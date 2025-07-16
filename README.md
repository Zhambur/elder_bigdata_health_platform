# 区域老年人健康大数据多维度分析平台

一个基于 Vue 3、ECharts 和 Element Plus 的现代化健康数据可视化大屏系统，集成了 AI 智能问答功能。

## ✨ 功能特点

### 🏥 四大核心可视化模块

1. **人群分布情况** - 饼图展示性别分布和年龄分组情况
2. **已有风险观测** - 交互式柱状图显示当前各类健康风险人数
3. **健康指标情况** - 箱线图分析血压、血糖、胆固醇等 24 项生理指标分布
4. **慢病风险预测** - 柱状图展示 AI 预测的潜在健康风险

### 🤖 AI 智能助手

- 🎯 专业健康数据解读
- 💬 悬浮聊天球界面
- 🧠 多 AI 提供商支持（DeepSeek、百度文心、阿里通义等）
- 🔒 安全的健康咨询建议
- 📊 数据驱动的个性化分析

### 🎨 技术特点

- 🌍 **全设备响应式** - 支持 320px 到 4K 超宽屏的完美适配
- 📱 **移动端优化** - 专门的移动端布局和交互优化
- 🎯 **交互式图表** - 点击图表查看详细数据，支持数据导出
- 💫 **现代化设计** - 毛玻璃效果、渐变背景、流畅动画
- 🔄 **实时数据** - 基于真实 CSV 数据源的动态加载
- ⚡ **性能优化** - 防抖处理、图表自适应、内存优化
- 🎪 **无缝滚动** - 解决了页面滚动和布局问题

## 🛠 技术栈

### 前端框架

- **Vue 3** - 使用 Composition API 的现代化框架
- **Vite** - 快速的前端构建工具
- **Element Plus** - Vue 3 UI 组件库

### 数据可视化

- **ECharts** - 专业的 JavaScript 图表库
- **Vue ECharts** - Vue 的 ECharts 组件封装

### 数据处理

- **PapaParse** - CSV 数据解析库
- **Axios** - HTTP 客户端

### AI 集成

- **多提供商支持** - OpenAI、百度文心、阿里通义、智谱 ChatGLM、讯飞星火

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3002` 启动

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
├── src/
│   ├── components/
│   │   ├── Dashboard.vue          # 主仪表盘组件
│   │   ├── FloatingChatBall.vue   # 悬浮聊天球
│   │   └── ChatWindow.vue         # AI聊天窗口
│   ├── services/
│   │   └── aiService.js           # AI 服务集成
│   ├── App.vue                    # 根组件
│   └── main.js                    # 应用入口
├── public/
│   └── assets/
│       ├── data/                  # CSV 数据文件
│       └── bg.jpg                 # 背景图片
├── index.html                     # HTML模板
├── package.json                   # 项目配置
├── vite.config.js                # Vite配置
└── README.md                     # 项目说明
```

## 📊 数据说明

项目使用真实的健康监测 CSV 数据：

### 数据文件

- `health_data_utf8.csv` - 主要健康指标数据
- `现有_标签_2_风险观测.csv` - 当前风险评估数据
- `预测_标签_2_风险预测.csv` - AI 风险预测数据
- `性别比例.csv` - 性别分布统计
- `年龄比例.csv` - 年龄分组统计

### 指标覆盖

**24 项健康指标监测：**

- 基础指标：体质指数、腰围、臀围、腰臀比
- 血压血氧：收缩压、舒张压、血氧、心率、脉率
- 代谢指标：血糖、体脂、总胆固醇、甘油三酯、高/低密度脂蛋白
- 其他指标：肺活量、尿酸、骨密度、睡眠时长、水分含量、基础代谢率、体温、血红蛋白、尿 pH、尿比重、呼吸频率

**11 类风险评估：**
体质异常、骨量异常、高血压、高血糖、高血脂、腰臀比异常、睡眠不足、动脉粥样硬化高风险、肾功能异常、体脂率偏高、呼吸系统综合风险

## ⚙️ AI 配置

### DeepSeek 配置（推荐）

```javascript
// 在 src/services/aiService.js 中配置
const providers = {
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    apiKey: "your-deepseek-api-key", // 替换为你的 API Key
    model: "deepseek-chat",
  },
};
```

### 支持的 AI 提供商

- **DeepSeek** - 高性价比，专业数据分析
- **百度文心一言** - 中文理解优秀
- **阿里通义千问** - 医疗健康领域专长
- **智谱 ChatGLM** - 科研数据处理
- **讯飞星火** - 语音交互支持

## 🎯 响应式设计

### 支持设备

- 📱 **手机** (320px - 768px)
- 📱 **平板** (768px - 1024px)
- 💻 **桌面** (1024px - 1440px)
- 🖥️ **大屏** (1440px - 1920px)
- 📺 **超宽屏** (1920px+)

### 关键特性

- **智能字体缩放** - 使用 `clamp()` 实现平滑响应
- **弹性布局** - Grid + Flexbox 混合布局
- **图表自适应** - ECharts 自动 resize 和字体调整
- **移动端优化** - 触摸友好的交互设计

## 🔧 自定义配置

### 修改图表配置

```javascript
// 在 Dashboard.vue 中
const chartOption = ref({
  title: { text: "自定义标题" },
  series: [
    {
      data: [
        /* 你的数据 */
      ],
    },
  ],
});
```

### 更换数据源

1. 将新的 CSV 文件放入 `public/assets/data/`
2. 在 `loadHealthData()` 函数中更新文件路径
3. 根据数据结构调整解析逻辑

### 自定义主题

```css
/* 修改 Dashboard.vue 中的 CSS 变量 */
:root {
  --primary-color: #4ecdc4;
  --secondary-color: #00d4ff;
  --background-gradient: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}
```

## 🐛 已解决问题

- ✅ **页面滚动问题** - 修复了 overflow: hidden 导致的无法滚动
- ✅ **图表变形问题** - 改进布局算法，防止图表压缩扭曲
- ✅ **响应式布局** - 完善了多设备适配和断点设计
- ✅ **AI 换行显示** - 修复了 AI 回复格式问题
- ✅ **无效分页组件** - 清理了页面底部多余的分页条

## 🌐 浏览器支持

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ 移动端浏览器

## 📖 开发指南

### 代码规范

- 使用 Vue 3 Composition API
- 响应式数据管理
- 组件化开发
- ES6+ 语法

### 性能优化

- 图表防抖处理 (300ms)
- 懒加载数据
- 内存泄漏防护
- 图表 autoresize

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📞 联系方式

如有问题，请通过 GitHub Issues 联系。
