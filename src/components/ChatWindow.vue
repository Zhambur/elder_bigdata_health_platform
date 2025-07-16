<template>
  <div v-if="visible" class="chat-window">
    <div class="chat-header">
      <div class="header-title">
        <span class="ai-icon">🤖</span>
        健康数据智能助手
      </div>
      <button class="close-btn" @click="closeChat">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="message ai loading">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <div class="input-container">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入您的问题..."
          :disabled="isLoading"
          class="message-input"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading || !inputMessage.trim()"
          class="send-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from "vue";
import { aiService } from "../services/aiService";

export default {
  name: "ChatWindow",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const messages = ref([]);
    const inputMessage = ref("");
    const isLoading = ref(false);
    const messagesContainer = ref(null);

    // 初始化问候语
    const initWelcomeMessage = () => {
      if (messages.value.length === 0) {
        messages.value.push({
          type: "ai",
          text: "您好！我是健康数据智能助手。您想咨询什么？",
          time: getCurrentTime(),
        });
      }
    };

    // 监听visible变化，显示时初始化问候语
    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          initWelcomeMessage();
          nextTick(() => {
            scrollToBottom();
          });
        }
      }
    );

    const getCurrentTime = () => {
      return new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    };

    const sendMessage = async () => {
      if (!inputMessage.value.trim() || isLoading.value) return;

      const userMessage = inputMessage.value.trim();

      // 添加用户消息
      messages.value.push({
        type: "user",
        text: userMessage,
        time: getCurrentTime(),
      });

      inputMessage.value = "";
      isLoading.value = true;

      nextTick(() => {
        scrollToBottom();
      });

      try {
        // 调用AI服务
        const aiResponse = await aiService.sendMessage(userMessage);

        // 添加AI回复
        messages.value.push({
          type: "ai",
          text: aiResponse,
          time: getCurrentTime(),
        });
      } catch (error) {
        console.error("AI服务调用失败:", error);
        messages.value.push({
          type: "ai",
          text: "抱歉，我现在无法回答您的问题，请稍后再试。",
          time: getCurrentTime(),
        });
      } finally {
        isLoading.value = false;
        nextTick(() => {
          scrollToBottom();
        });
      }
    };

    const closeChat = () => {
      emit("close");
    };

    return {
      messages,
      inputMessage,
      isLoading,
      messagesContainer,
      sendMessage,
      closeChat,
    };
  },
};
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: clamp(80px, 8vh, 100px);
  right: clamp(20px, 3vw, 30px);
  width: clamp(320px, 25vw, 400px); /* 响应式宽度：320px-400px */
  height: clamp(400px, 60vh, 600px); /* 响应式高度：400px-600px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-header {
  padding: clamp(15px, 2vh, 20px);
  background: linear-gradient(135deg, #4ecdc4 0%, #00d4ff 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.header-title {
  font-weight: 600;
  font-size: clamp(14px, 1.2vw, 16px); /* 响应式字体 */
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  font-size: clamp(18px, 1.5vw, 20px); /* 响应式图标大小 */
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  padding: clamp(15px, 2vh, 20px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.5vh, 15px);
}

.message {
  display: flex;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-content {
  padding: clamp(10px, 1.2vh, 12px) clamp(12px, 1.5vw, 16px);
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: linear-gradient(135deg, #4ecdc4 0%, #00d4ff 100%);
  color: white;
}

.message.ai .message-content {
  background: #f5f5f5;
  color: #333;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
  white-space: pre-wrap; /* 保留换行符和空格，使AI回答正确换行 */
}

.message-time {
  font-size: clamp(10px, 0.8vw, 11px); /* 响应式时间字体 */
  opacity: 0.7;
  margin-top: 5px;
}

.message.user .message-time {
  text-align: right;
}

/* 打字指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.chat-input {
  padding: clamp(15px, 2vh, 20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  gap: clamp(8px, 1vw, 10px);
  align-items: center;
}

.message-input {
  flex: 1;
  padding: clamp(10px, 1.2vh, 12px) clamp(12px, 1.5vw, 16px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  outline: none;
  font-size: clamp(13px, 1.1vw, 14px); /* 响应式输入字体 */
  background: white;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #4ecdc4;
}

.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  width: clamp(40px, 4vw, 44px); /* 响应式按钮大小 */
  height: clamp(40px, 4vw, 44px);
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #4ecdc4 0%, #00d4ff 100%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 - 扩展更多断点 */
@media (max-width: 1440px) {
  .chat-window {
    width: clamp(300px, 28vw, 380px);
    height: clamp(450px, 55vh, 550px);
  }
}

@media (max-width: 1200px) {
  .chat-window {
    width: clamp(280px, 35vw, 350px);
    height: clamp(400px, 50vh, 500px);
  }
}

@media (max-width: 992px) {
  .chat-window {
    width: clamp(280px, 45vw, 320px);
    height: clamp(380px, 45vh, 450px);
    bottom: clamp(60px, 6vh, 80px);
    right: clamp(15px, 2vw, 25px);
  }
}

@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - clamp(30px, 5vw, 40px));
    height: clamp(350px, 50vh, 400px);
    bottom: clamp(60px, 8vh, 80px);
    right: clamp(15px, 2.5vw, 20px);
    left: clamp(15px, 2.5vw, 20px);
  }

  .header-title {
    font-size: clamp(13px, 3vw, 15px);
  }

  .ai-icon {
    font-size: clamp(16px, 4vw, 18px);
  }
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 20px);
    height: clamp(300px, 60vh, 350px);
    bottom: clamp(50px, 10vh, 70px);
    right: 10px;
    left: 10px;
  }

  .header-title {
    font-size: 13px;
  }

  .ai-icon {
    font-size: 16px;
  }

  .message-input {
    font-size: 13px;
    padding: 10px 12px;
  }

  .send-btn {
    width: 38px;
    height: 38px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .chat-window {
    width: calc(100vw - 16px);
    height: clamp(280px, 65vh, 320px);
    bottom: clamp(40px, 8vh, 60px);
    right: 8px;
    left: 8px;
  }

  .header-title {
    font-size: 12px;
  }

  .ai-icon {
    font-size: 14px;
  }

  .message-input {
    font-size: 12px;
    padding: 8px 10px;
  }

  .send-btn {
    width: 34px;
    height: 34px;
  }

  .chat-header {
    padding: 12px;
  }

  .chat-messages {
    padding: 12px;
    gap: 10px;
  }

  .chat-input {
    padding: 12px;
  }
}

/* 超宽屏优化 */
@media (min-width: 1920px) {
  .chat-window {
    width: clamp(400px, 22vw, 480px);
    height: clamp(600px, 65vh, 700px);
    bottom: clamp(100px, 8vh, 120px);
    right: clamp(30px, 3vw, 50px);
  }

  .header-title {
    font-size: clamp(16px, 1.2vw, 18px);
  }

  .ai-icon {
    font-size: clamp(20px, 1.5vw, 24px);
  }

  .message-input {
    font-size: clamp(14px, 1.1vw, 16px);
  }

  .send-btn {
    width: clamp(44px, 4vw, 50px);
    height: clamp(44px, 4vw, 50px);
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
