<template>
  <main class="home-shell">
    <section class="home-card">
      <header class="hero-block">
        <p class="eyebrow">Interactive synthesizer</p>
        <h1 class="hero-title">Music App</h1>
        <p class="hero-copy">
          Shape the tone, tap or hover the bells, and record a quick melody in the browser.
        </p>
      </header>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Wave Shape</p>
            <h2 class="panel-title">Choose a waveform before you play</h2>
          </div>
          <span class="status-pill" :class="{ 'status-pill--active': soundType }">
            {{ soundType ? `Selected: ${soundType}` : 'Waiting for selection' }}
          </span>
        </div>

        <p class="panel-copy">
          {{ soundType ? 'Switch waveforms anytime to hear a different timbre.' : 'Start here. Each waveform changes the character of every bell note.' }}
        </p>

        <div class="wave-grid">
          <button
            v-for="(info, index) in waveData"
            :key="index"
            class="wave-button"
            :class="{ 'wave-button--selected': soundType === info }"
            @click="selectWave(info)"
          >
            {{ info }}
          </button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Bell Board</p>
            <h2 class="panel-title">Play the note row</h2>
          </div>
          <span class="panel-chip">Hover or press a bell</span>
        </div>

        <div class="bell-stage" :class="{ 'bell-stage--idle': !soundType }">
          <p v-if="!soundType" class="stage-hint">
            Choose a waveform above to activate the bells.
          </p>

          <BellButton
            v-for="note in bellNotes"
            :key="note.label"
            :label="note.label"
            :left="note.left"
            @create-sound="initSound(soundType, note.tone)"
          />
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-label">Recorder</p>
            <h2 class="panel-title">Capture what you play</h2>
          </div>
          <button
            v-if="!clicked"
            type="button"
            class="control-button control-button--record"
            @click="recordAudio"
          >
            Start recording
          </button>
          <button
            v-else
            type="button"
            class="control-button control-button--stop"
            @click="stopAudio"
          >
            Stop recording
          </button>
        </div>

        <p class="panel-copy">
          Record the live output, then preview the clip here without leaving the page.
        </p>

        <div class="playback-controls">
          <button
            type="button"
            class="control-button control-button--loop"
            :class="{ 'control-button--active': isLooping }"
            :disabled="!audioUrl"
            @click="toggleLoop"
          >
            {{ isLooping ? 'Stop loop' : 'Loop recording' }}
          </button>

          <audio
            ref="audioPlayer"
            controls
            class="audio-player"
            :class="{ 'audio-player--hidden': !audioUrl }"
            :src="audioUrl"
          ></audio>
        </div>
      </section>
    </section>
  </main>
</template>

<script>
import BellButton from '../components/BellButton.vue'

export default {
  name: 'HomeView',
  components: {
    BellButton,
  },
  data() {
    return {
      waveData: ['sine', 'triangle', 'sawtooth', 'square'],
      bellNotes: [
        { label: 'A', tone: 440.0, left: '8%' },
        { label: 'B', tone: 493.88, left: '22%' },
        { label: 'C', tone: 523.25, left: '36%' },
        { label: 'D', tone: 587.33, left: '50%' },
        { label: 'E', tone: 659.25, left: '64%' },
        { label: 'F', tone: 698.46, left: '78%' },
        { label: 'G', tone: 783.99, left: '92%' },
      ],
      soundType: '',
      clicked: false,
      recording: false,
      stop: false,
      media: {},
      playbackContext: null,
      context: null,
      dest: {},
      chunkData: [],
      audioUrl: '',
      isLooping: false,
    }
  },
  methods: {
    async initSound(wave, tone) {
      if (!wave) {
        return
      }

      const context = this.recording ? this.context : this.ensurePlaybackContext()

      if (!context) {
        return
      }

      if (context.state === 'suspended') {
        await context.resume()
      }

      const gain = context.createGain()
      const oscillator = context.createOscillator()
      const now = context.currentTime

      oscillator.type = wave
      oscillator.frequency.value = tone
      gain.gain.setValueAtTime(0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      oscillator.connect(gain)
      gain.connect(context.destination)

      if (this.recording) {
        gain.connect(this.dest)
      }

      oscillator.start(now)
      oscillator.stop(now + 1)
    },
    ensurePlaybackContext() {
      if (this.playbackContext && this.playbackContext.state !== 'closed') {
        return this.playbackContext
      }

      this.playbackContext = new (window.AudioContext || window.webkitAudioContext)()
      return this.playbackContext
    },
    recordAudio() {
      this.stopLoopPlayback()
      this.clicked = true
      this.recording = true
      this.stop = false
      this.chunkData = []

      const context = new (window.AudioContext || window.webkitAudioContext)()
      const dest = context.createMediaStreamDestination()
      const mediaRecorder = new MediaRecorder(dest.stream)

      mediaRecorder.ondataavailable = ({ data }) => {
        if (data.size > 0) {
          this.chunkData.push(data)
        }
      }

      mediaRecorder.onstop = () => {
        if (this.audioUrl) {
          window.URL.revokeObjectURL(this.audioUrl)
        }

        const blob = new Blob(this.chunkData, { type: 'audio/ogg; codecs=opus' })
        this.isLooping = false
        this.audioUrl = window.URL.createObjectURL(blob)
        this.chunkData = []

        if (this.context?.state && this.context.state !== 'closed') {
          this.context.close()
        }

        this.context = null
        this.dest = {}
        this.media = {}
      }

      this.context = context
      this.dest = dest
      this.media = mediaRecorder
      this.media.start()
    },
    stopAudio() {
      this.clicked = false
      this.recording = false
      this.stop = true

      if (this.media?.state === 'recording') {
        this.media.stop()
      }
    },
    selectWave(sound) {
      this.soundType = sound
    },
    async toggleLoop() {
      if (!this.audioUrl) {
        return
      }

      const audio = this.$refs.audioPlayer

      if (!audio) {
        return
      }

      if (this.isLooping) {
        this.stopLoopPlayback()
        return
      }

      this.isLooping = true
      audio.loop = true
      audio.currentTime = 0

      try {
        await audio.play()
      } catch {
        this.isLooping = false
        audio.loop = false
      }
    },
    stopLoopPlayback() {
      const audio = this.$refs.audioPlayer

      this.isLooping = false

      if (!audio) {
        return
      }

      audio.loop = false
      audio.pause()
      audio.currentTime = 0
    },
  },
  beforeUnmount() {
    this.stopLoopPlayback()

    if (this.audioUrl) {
      window.URL.revokeObjectURL(this.audioUrl)
    }

    if (this.context?.state && this.context.state !== 'closed') {
      this.context.close()
    }

    if (this.playbackContext?.state && this.playbackContext.state !== 'closed') {
      this.playbackContext.close()
    }
  },
}
</script>
<style scoped>
.home-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem 3rem;
}

.home-card {
  width: min(100%, 64rem);
  display: grid;
  gap: 1.5rem;
  padding: clamp(1.4rem, 2vw, 2rem);
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(18px);
}

.hero-block {
  display: grid;
  gap: 0.7rem;
}

.eyebrow {
  margin: 0;
  color: var(--color-accent-strong);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(2.4rem, 5vw, 4rem);
  line-height: 0.95;
}

.hero-copy {
  margin: 0;
  max-width: 42rem;
  color: var(--color-text-muted);
  font-size: 1.02rem;
  line-height: 1.6;
}

.panel {
  display: grid;
  gap: 1rem;
  padding: 1.35rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-soft);
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.panel-label {
  margin: 0 0 0.3rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.panel-title {
  margin: 0;
  color: var(--color-text);
  font-size: 1.35rem;
}

.panel-copy {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.status-pill,
.panel-chip {
  align-self: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.58);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-pill--active {
  border-color: rgba(213, 125, 58, 0.35);
  background: rgba(255, 241, 228, 0.92);
  color: var(--color-accent-strong);
}

.wave-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.wave-button,
.control-button {
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(247, 239, 232, 0.96));
  color: var(--color-text);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
    border-color var(--transition-fast), background var(--transition-fast);
}

.wave-button {
  min-width: 8rem;
  padding: 0.8rem 1rem;
  text-transform: capitalize;
}

.wave-button:hover,
.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 28px rgba(74, 45, 22, 0.12);
  border-color: rgba(213, 125, 58, 0.35);
}

.wave-button--selected {
  background: linear-gradient(135deg, #d57d3a, #a64f28);
  border-color: transparent;
  color: #fffaf4;
  box-shadow: 0 18px 32px rgba(166, 79, 40, 0.28);
}

.bell-stage {
  position: relative;
  min-height: 16rem;
  padding: 1.4rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(213, 125, 58, 0.2);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.78), rgba(255, 246, 238, 0.55)),
    linear-gradient(180deg, rgba(255, 248, 240, 0.95), rgba(246, 233, 220, 0.88));
  overflow: hidden;
}

.bell-stage::after {
  content: '';
  position: absolute;
  inset: auto 1.2rem 1rem;
  height: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(122, 85, 44, 0.15), rgba(122, 85, 44, 0.4), rgba(122, 85, 44, 0.15));
}

.bell-stage--idle {
  border-style: dashed;
}

.stage-hint {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 250, 244, 0.94);
  border: 1px solid rgba(213, 125, 58, 0.25);
  box-shadow: 0 12px 24px rgba(74, 45, 22, 0.08);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  z-index: 1;
}

.control-button {
  min-width: 11rem;
  padding: 0.85rem 1rem;
}

.control-button--record {
  color: #8a2d23;
}

.control-button--stop {
  color: #203044;
}

.control-button--loop {
  min-width: 11rem;
  color: #5b3e27;
}

.control-button--active {
  background: linear-gradient(135deg, #d57d3a, #a64f28);
  border-color: transparent;
  color: #fffaf4;
  box-shadow: 0 18px 32px rgba(166, 79, 40, 0.28);
}

.control-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
  box-shadow: none;
}

.playback-controls {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
}

.audio-player {
  width: 100%;
  max-width: 28rem;
  min-height: 3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  accent-color: #c96d2f;
}

.audio-player--hidden {
  display: none;
}

@media (max-width: 700px) {
  .home-shell {
    padding-inline: 0.85rem;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
  }

  .status-pill,
  .panel-chip,
  .control-button,
  .audio-player,
  .control-button--loop {
    width: 100%;
    max-width: none;
  }

  .wave-button {
    flex: 1 1 9rem;
  }

  .bell-stage {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    gap: 1rem;
    min-height: 0;
    padding-top: 4rem;
  }

  .bell-stage::after {
    display: none;
  }

  .stage-hint {
    width: calc(100% - 2rem);
    text-align: center;
  }
}
</style>
