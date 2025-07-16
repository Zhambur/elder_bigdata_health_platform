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
  bottom: 100px;
  right: 30px;
  width: 380px;
  height: 500px;
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
  padding: 20px;
  background: linear-gradient(135deg, #4ecdc4 0%, #00d4ff 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.header-title {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-icon {
  font-size: 20px;
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
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  padding: 12px 16px;
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
  font-size: 11px;
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
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  outline: none;
  font-size: 14px;
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
  width: 44px;
  height: 44px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: 400px;
    bottom: 80px;
    right: 20px;
    left: 20px;
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
