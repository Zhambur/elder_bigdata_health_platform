# 健康数据平台 AI 智能助手集成说明

## 功能概述

本次更新为区域老年人健康监控平台新增了 AI 智能助手功能，包括：

- 🎯 **悬浮球交互**: 右下角悬浮球，点击展开聊天窗口
- 💬 **智能对话**: 支持健康数据咨询和平台使用指导
- 🤖 **专业约束**: 通过 prompt 工程约束 AI 专注于健康领域
- 🔄 **多模型支持**: 支持 OpenAI、文心一言、通义千问等多种大模型

## 新增组件

### 1. FloatingChatBall.vue - 悬浮球组件

- 位置：右下角固定位置
- 动画：脉动效果吸引用户注意
- 交互：点击切换聊天窗口显示/隐藏

### 2. ChatWindow.vue - 聊天窗口组件

- 自动问候语：「您想咨询什么？」
- 实时对话：支持用户输入和 AI 回复
- 加载状态：显示打字动画
- 响应式设计：适配桌面和移动端

### 3. aiService.js - AI 服务模块

- API 调用：统一的大模型接口调用
- 错误处理：友好的错误提示
- 会话管理：保持对话上下文
- Prompt 工程：专业的健康咨询约束

## 配置说明

### 1. 快速配置

在 `src/services/aiService.js` 中找到以下配置：

```javascript
const AI_CONFIG = {
  apiUrl: "YOUR_API_ENDPOINT",
  apiKey: "YOUR_API_KEY_HERE",
  model: "YOUR_MODEL_NAME",
};
```

### 2. 支持的大模型服务商

#### OpenAI GPT

```javascript
{
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  apiKey: 'sk-xxx...',
  model: 'gpt-3.5-turbo'
}
```

#### 百度文心一言

```javascript
{
  apiUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
  apiKey: 'your-access-token',
  model: 'ERNIE-Bot'
}
```

#### 阿里通义千问

```javascript
{
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  apiKey: 'sk-xxx...',
  model: 'qwen-turbo'
}
```

#### 智谱 AI ChatGLM

```javascript
{
  apiUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  apiKey: 'your-api-key',
  model: 'glm-4'
}
```

### 3. 使用配置文件（推荐）

使用 `src/config/aiConfig.js` 中的预设配置：

```javascript
import { configureAI, CONFIG_EXAMPLES } from "./config/aiConfig";

// 配置OpenAI
configureAI(CONFIG_EXAMPLES.openai());

// 或配置其他服务商
configureAI(CONFIG_EXAMPLES.wenxin());
```

## Prompt 工程设计

AI 助手通过系统 Prompt 约束，专注于以下领域：

### 专业范围

- 老年人健康指标解读
- 慢性疾病风险分析
- 生活方式建议
- 平台使用指导

### 安全限制

- ❌ 不进行疾病诊断
- ❌ 不提供药物建议
- ❌ 不处理紧急医疗情况
- ✅ 建议就医时机

### 回答原则

- 准确性：医学信息准确
- 专业性：使用专业术语
- 实用性：可操作的建议
- 安全性：强调就医重要性

## 使用流程

1. **启动应用**: 运行 `npm run dev`
2. **配置 API**: 修改 `aiService.js` 中的 API 配置
3. **点击悬浮球**: 右下角蓝色悬浮球
4. **开始对话**: 输入健康相关问题
5. **获取回答**: AI 提供专业建议

## 常见问题

### Q: 如何配置不同的大模型？

A: 修改 `src/services/aiService.js` 中的 `AI_CONFIG` 对象，或使用 `src/config/aiConfig.js` 中的预设配置。

### Q: AI 无法回答问题怎么办？

A: 检查 API 密钥配置、网络连接，确保 API 服务可用。

### Q: 如何自定义 AI 的回答风格？

A: 修改 `aiService.js` 中的 `SYSTEM_PROMPT` 变量。

### Q: 支持离线使用吗？

A: 目前需要网络连接调用大模型 API，不支持离线使用。

## 安全注意事项

1. **API 密钥安全**: 不要将 API 密钥提交到版本控制系统
2. **数据隐私**: 用户对话内容会发送到 AI 服务商
3. **医疗免责**: AI 建议仅供参考，不能替代专业医疗诊断
4. **访问控制**: 建议在生产环境中添加用户认证

## 技术实现

- **框架**: Vue 3 + Composition API
- **HTTP 客户端**: Axios
- **样式**: CSS3 动画 + 响应式设计
- **错误处理**: 完整的异常捕获和用户提示
- **性能优化**: 异步加载、节流防抖

## 后续扩展

- [ ] 语音输入/输出
- [ ] 多语言支持
- [ ] 对话历史保存
- [ ] 个性化推荐
- [ ] 数据分析集成

---

如有问题或建议，请联系开发团队。
