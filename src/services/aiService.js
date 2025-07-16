import axios from "axios";

// AI服务配置 - 已配置DeepSeek
const AI_CONFIG = {
  // DeepSeek API配置
  apiUrl: "https://api.deepseek.com/v1/chat/completions",
  apiKey: "sk-f32e7b16cedc4942ac13a885c235ccbb", // 您的DeepSeek API密钥
  model: "deepseek-chat",
};

// 系统Prompt - 约束大模型的行为和专业性
const SYSTEM_PROMPT = `
你是一个专业的健康数据智能助手，专门为区域老年人健康监控平台提供服务。

【你的角色】
- 健康数据分析专家
- 老年人健康咨询顾问  
- 数据可视化解读助手

【你的职责】
1. 解答用户关于健康数据平台的使用问题
2. 解释各种健康指标的含义和正常范围
3. 分析健康风险因素和预防建议
4. 指导用户理解平台上的图表和数据
5. 提供基于数据的健康建议

【专业知识范围】
- 老年人常见健康指标：血压、血糖、血脂、心率、体质指数、骨密度等
- 慢性疾病风险：高血压、糖尿病、心血管疾病、骨质疏松等
- 健康数据分析：趋势分析、风险评估、异常识别
- 生活方式建议：饮食、运动、睡眠、体检等

【回答原则】
1. 准确性：提供医学上准确的信息，避免误导
2. 专业性：使用专业但易懂的语言
3. 实用性：给出可操作的建议
4. 安全性：强调严重情况需就医，不能替代医生诊断
5. 简洁性：回答简明扼要，重点突出

【回答格式】
- 直接回答用户问题
- 必要时提供具体数值范围
- 给出实用建议
- 适当时提醒就医

【重要限制】
1. 不能进行疾病诊断，只能提供健康信息参考
2. 遇到紧急医疗情况，必须建议立即就医
3. 不提供具体药物使用建议
4. 超出健康领域的问题，礼貌地引导回健康话题

请始终以专业、友善、负责任的态度回答用户问题。
`;

// 用户消息历史记录（简化版，实际应用中可能需要更复杂的会话管理）
let conversationHistory = [];

class AIService {
  constructor() {
    this.apiUrl = AI_CONFIG.apiUrl;
    this.apiKey = AI_CONFIG.apiKey;
    this.model = AI_CONFIG.model;
  }

  /**
   * 发送消息给大模型
   * @param {string} userMessage - 用户输入的消息
   * @returns {Promise<string>} - AI的回复
   */
  async sendMessage(userMessage) {
    try {
      // 构建对话消息
      const messages = [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        // 添加历史对话（保持最近的几轮对话）
        ...conversationHistory.slice(-6), // 只保留最近3轮对话（6条消息）
        {
          role: "user",
          content: userMessage,
        },
      ];

      // 调用API
      const response = await this.callAIAPI(messages);

      // 更新对话历史
      conversationHistory.push(
        { role: "user", content: userMessage },
        { role: "assistant", content: response }
      );

      return response;
    } catch (error) {
      console.error("AI服务调用失败:", error);
      return this.getErrorResponse(error);
    }
  }

  /**
   * 调用大模型API
   * @param {Array} messages - 对话消息数组
   * @returns {Promise<string>} - AI回复内容
   */
  async callAIAPI(messages) {
    // 检查API配置
    if (!this.apiKey || this.apiKey === "YOUR_API_KEY_HERE") {
      throw new Error("API_KEY_NOT_CONFIGURED");
    }

    try {
      // OpenAI API 格式的请求
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30秒超时
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content.trim();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        throw new Error("REQUEST_TIMEOUT");
      } else if (error.response) {
        // API返回错误
        const status = error.response.status;
        const message = error.response.data?.error?.message || "未知错误";
        throw new Error(`API_ERROR:${status}:${message}`);
      } else if (error.request) {
        // 网络错误
        throw new Error("NETWORK_ERROR");
      } else {
        // 其他错误
        throw new Error(`UNKNOWN_ERROR:${error.message}`);
      }
    }
  }

  /**
   * 根据错误类型返回相应的错误消息
   * @param {Error} error - 错误对象
   * @returns {string} - 用户友好的错误消息
   */
  getErrorResponse(error) {
    const errorMessage = error.message;

    if (errorMessage === "API_KEY_NOT_CONFIGURED") {
      return "抱歉，AI服务尚未配置。请联系管理员配置API密钥。";
    } else if (errorMessage === "REQUEST_TIMEOUT") {
      return "请求超时，请检查网络连接后重试。";
    } else if (errorMessage === "NETWORK_ERROR") {
      return "网络连接失败，请检查网络设置后重试。";
    } else if (errorMessage.startsWith("API_ERROR:401")) {
      return "API密钥无效，请联系管理员检查配置。";
    } else if (errorMessage.startsWith("API_ERROR:429")) {
      return "请求过于频繁，请稍后再试。";
    } else if (errorMessage.startsWith("API_ERROR:500")) {
      return "AI服务暂时不可用，请稍后再试。";
    } else if (errorMessage.startsWith("API_ERROR")) {
      return "AI服务调用失败，请稍后再试。";
    } else {
      return "系统暂时无法处理您的请求，请稍后再试。";
    }
  }

  /**
   * 清除对话历史
   */
  clearHistory() {
    conversationHistory = [];
  }

  /**
   * 获取预设的健康咨询快捷回复
   * @param {string} topic - 咨询主题
   * @returns {string} - 快捷回复内容
   */
  getQuickResponse(topic) {
    const quickResponses = {
      blood_pressure:
        "血压正常范围：收缩压 90-140 mmHg，舒张压 60-90 mmHg。老年人血压略高属正常，但超过 160/100 需要关注。建议定期监测，保持低盐饮食，适量运动。",
      blood_sugar:
        "空腹血糖正常值 3.9-6.1 mmol/L，餐后2小时血糖 <7.8 mmol/L。老年人应特别注意血糖控制，建议定期检查，控制碳水化合物摄入。",
      bmi: "老年人BMI正常范围 20-26.9。过低可能营养不良，过高增加慢病风险。建议均衡饮食，适度运动维持健康体重。",
      bone_density:
        "骨密度T值 >-1.0为正常，-1.0到-2.5为骨量减少，<-2.5为骨质疏松。老年人应增加钙质摄入，进行适量承重运动，定期检查骨密度。",
    };

    return (
      quickResponses[topic] ||
      "请具体描述您想了解的健康问题，我会为您详细解答。"
    );
  }
}

// 创建服务实例
export const aiService = new AIService();

// 导出配置函数，允许动态配置API
export const configureAI = (config) => {
  Object.assign(AI_CONFIG, config);
  aiService.apiUrl = AI_CONFIG.apiUrl;
  aiService.apiKey = AI_CONFIG.apiKey;
  aiService.model = AI_CONFIG.model;
};

export default aiService;
