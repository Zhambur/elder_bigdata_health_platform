<template>
  <div id="app">
    <Dashboard />

    <!-- 悬浮球和聊天窗口 -->
    <FloatingChatBall @toggle-chat="toggleChatWindow" />
    <ChatWindow :visible="chatWindowVisible" @close="closeChatWindow" />
  </div>
</template>

<script>
import { ref } from "vue";
import Dashboard from "./components/Dashboard.vue";
import FloatingChatBall from "./components/FloatingChatBall.vue";
import ChatWindow from "./components/ChatWindow.vue";

export default {
  name: "App",
  components: {
    Dashboard,
    FloatingChatBall,
    ChatWindow,
  },
  setup() {
    const chatWindowVisible = ref(false);

    const toggleChatWindow = () => {
      chatWindowVisible.value = !chatWindowVisible.value;
    };

    const closeChatWindow = () => {
      chatWindowVisible.value = false;
    };

    return {
      chatWindowVisible,
      toggleChatWindow,
      closeChatWindow,
    };
  },
};
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
</style>
