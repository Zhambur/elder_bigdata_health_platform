<template>
  <div class="floating-ball" @click="toggleChat">
    <div class="ball-container">
      <div class="ball">
        <div class="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
        </div>
      </div>
      <!-- 脉动效果 -->
      <div class="pulse-ring"></div>
      <div class="pulse-ring pulse-ring-delay"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatingChatBall",
  emits: ["toggle-chat"],
  methods: {
    toggleChat() {
      this.$emit("toggle-chat");
    },
  },
};
</script>

<style scoped>
.floating-ball {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  cursor: pointer;
}

.ball-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.ball {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4ecdc4 0%, #00d4ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(78, 205, 196, 0.4);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.ball:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(78, 205, 196, 0.6);
}

.icon {
  color: white;
  transition: transform 0.3s ease;
}

.ball:hover .icon {
  transform: scale(1.1);
}

/* 脉动效果 */
.pulse-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(78, 205, 196, 0.3);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}

.pulse-ring-delay {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-ball {
    bottom: 20px;
    right: 20px;
  }

  .ball-container {
    width: 50px;
    height: 50px;
  }

  .ball {
    width: 50px;
    height: 50px;
  }

  .pulse-ring {
    width: 50px;
    height: 50px;
  }
}
</style>
