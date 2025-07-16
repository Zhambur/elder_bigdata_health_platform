// AI配置文件
// 请根据您使用的大模型服务商配置相应的参数

export const AI_PROVIDERS = {
  // OpenAI GPT
  OPENAI: {
    name: "OpenAI GPT",
    apiUrl: "https://api.openai.com/v1/chat/completions",
    model: "gpt-3.5-turbo",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },

  // 百度文心一言
  WENXIN: {
    name: "百度文心一言",
    apiUrl:
      "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
    model: "ERNIE-Bot",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
    }),
  },

  // 阿里通义千问
  QWEN: {
    name: "阿里通义千问",
    apiUrl:
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    model: "qwen-turbo",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },

  // 智谱AI ChatGLM
  ZHIPU: {
    name: "智谱AI ChatGLM",
    apiUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    model: "glm-4",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },

  // 科大讯飞星火
  SPARK: {
    name: "科大讯飞星火",
    apiUrl: "https://spark-api.xf-yun.com/v1.1/chat/completions",
    model: "spark-lite",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },

  // DeepSeek
  DEEPSEEK: {
    name: "DeepSeek",
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
    headers: (apiKey) => ({
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    }),
  },
};

// 默认配置
export const DEFAULT_CONFIG = {
  // 当前使用的服务商（请修改为您要使用的服务商）
  provider: AI_PROVIDERS.DEEPSEEK,

  // API密钥（请替换为您的实际API密钥）
  apiKey: "sk-f32e7b16cedc4942ac13a885c235ccbb",

  // 请求参数
  requestConfig: {
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0,
    presence_penalty: 0,
  },

  // 请求超时时间（毫秒）
  timeout: 30000,
};

// 快速配置函数
export const createAIConfig = (provider, apiKey, customConfig = {}) => {
  return {
    ...DEFAULT_CONFIG,
    provider: AI_PROVIDERS[provider] || AI_PROVIDERS.OPENAI,
    apiKey,
    ...customConfig,
  };
};

// 配置示例
export const CONFIG_EXAMPLES = {
  // OpenAI配置示例
  openai: () => createAIConfig("OPENAI", "sk-xxx..."),

  // 文心一言配置示例
  wenxin: () => createAIConfig("WENXIN", "your-access-token"),

  // 通义千问配置示例
  qwen: () => createAIConfig("QWEN", "sk-xxx..."),

  // ChatGLM配置示例
  zhipu: () => createAIConfig("ZHIPU", "your-api-key"),

  // 星火配置示例
  spark: () => createAIConfig("SPARK", "your-api-key"),

  // DeepSeek配置示例
  deepseek: () =>
    createAIConfig("DEEPSEEK", "sk-f32e7b16cedc4942ac13a885c235ccbb"),
};
