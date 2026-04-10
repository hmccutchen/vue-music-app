<template>
  <button
    type="button"
    class="bell-button"
    :class="{ 'bell-button--jingle': isJingling }"
    :style="{ '--bell-left': left }"
    :aria-label="`Play note ${label}`"
    @pointerdown="playNote"
    @mouseenter="playNote"
    @mouseleave="stopJingle"
  >
    <img src="../assets/images/bell.png" alt="" class="bell-icon" />
    <span class="bell-label">{{ label }}</span>
  </button>
</template>

<script>
export default {
  name: 'BellButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    left: {
      type: String,
      required: true,
    },
  },
  emits: ['create-sound'],
  data() {
    return {
      isJingling: false,
    }
  },
  methods: {
    playNote() {
      this.isJingling = false

      requestAnimationFrame(() => {
        this.isJingling = true
      })

      this.$emit('create-sound')
    },
    stopJingle() {
      this.isJingling = false
    },
  },
}
</script>

<style scoped>
.bell-button {
  --bell-size: clamp(4.5rem, 7vw, 5.75rem);
  position: absolute;
  left: var(--bell-left);
  top: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(248, 240, 225, 0.92));
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  padding: 0.9rem 0.95rem 0.75rem;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.bell-button:hover {
  border-color: rgba(176, 102, 38, 0.35);
  box-shadow: 0 20px 40px rgba(54, 36, 20, 0.18);
  transform: translate(-50%, calc(-50% - 4px));
}

.bell-button:focus-visible {
  outline: 3px solid rgba(213, 125, 58, 0.3);
  outline-offset: 4px;
}

.bell-icon {
  width: var(--bell-size);
  height: var(--bell-size);
  display: block;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 10px 16px rgba(60, 36, 16, 0.16));
}

.bell-label {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  pointer-events: none;
}

.bell-button--jingle {
  animation: bell-jingle 420ms ease;
}

@keyframes bell-jingle {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  20% {
    transform: translate(-50%, -54%) rotate(-10deg);
  }

  40% {
    transform: translate(-50%, -48%) rotate(9deg);
  }

  60% {
    transform: translate(-50%, -54%) rotate(-7deg);
  }

  80% {
    transform: translate(-50%, -49%) rotate(4deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
}

@media (max-width: 700px) {
  .bell-button {
    position: static;
    transform: none;
    width: min(100%, 8rem);
  }

  .bell-button:hover {
    transform: translateY(-4px);
  }

  .bell-button--jingle {
    animation-name: bell-jingle-mobile;
  }

  @keyframes bell-jingle-mobile {
    0% {
      transform: rotate(0deg);
    }

    20% {
      transform: rotate(-8deg);
    }

    40% {
      transform: rotate(8deg);
    }

    60% {
      transform: rotate(-6deg);
    }

    80% {
      transform: rotate(4deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
}
</style>
