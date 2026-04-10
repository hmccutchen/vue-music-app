<template>
  <div>
    <h1>Music App</h1>
    <h2>Choose wave shape!</h2>

    <div v-for="(info, index) in waveData" :key="index" class="container">
      <button
        class="menu"
        :class="{ selected: soundType === info }"
        @click="selectWave(info)"
      >
        {{ info }}
      </button>
    </div>

    <FirstButton @create-sound="initSound(soundType, 554.37)" />
    <SecondButton @create-sound="initSound(soundType, 622.25)" />
    <ThirdButton @create-sound="initSound(soundType, 493.88)" />
    <FourthButton @create-sound="initSound(soundType, 659.25)" />
    <FifthButton @create-sound="initSound(soundType, 440.0)" />

    <article>
      <h3>Record</h3>
      <button v-if="!clicked" @click="recordAudio" class="record-button">record</button>
      <button v-else @click="stopAudio" class="stop-button">stop</button>
    </article>

    <div>
      <audio controls class="play-button" :class="{ hide: !audioUrl }" :src="audioUrl"></audio>
    </div>
  </div>

</template>

<script>
import FirstButton from '../components/FirstButton.vue'
import SecondButton from '../components/SecondButton.vue'
import ThirdButton from '../components/ThirdButton.vue'
import FourthButton from '../components/FourthButton.vue'
import FifthButton from '../components/FifthButton.vue'

export default {
  name: 'HomeView',
  components: {
    FirstButton,
    SecondButton,
    ThirdButton,
    FourthButton,
    FifthButton,
  },
  data() {
    return {
      waveData: ['sine', 'triangle', 'sawtooth', 'square'],
      soundType: '',
      clicked: false,
      recording: false,
      stop: false,
      media: {},
      context: {},
      dest: {},
      chunkData: [],
      audioUrl: '',
    }
  },
  methods: {
    initSound(wave, tone) {
      if (!wave) {
        return
      }

      const context = this.recording
        ? this.context
        : new (window.AudioContext || window.webkitAudioContext)()
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
        oscillator.connect(this.dest)
      }

      oscillator.start(now)
      oscillator.stop(now + 1)
    },
    recordAudio() {
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
        this.audioUrl = window.URL.createObjectURL(blob)
        this.chunkData = []
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
  },
}
</script>
<style scoped>
.container {
  display: inline-flex;
}

article {
  left: 50%;
  position: fixed;
  top: 58%;
}

.record-button {
  border: solid 1px black;
  width: 70px;
  height: 40px;
  background-color: #fcf9fb;
  font-size: 15px;
  cursor: pointer;
  border-radius: 50px;
}

.record-button:hover {
  background-color: #d84b41;
  color: #fff8fd;
  font-weight: bold;
}

.stop-button {
  border: solid 1px black;
  width: 70px;
  height: 40px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 50px;

}

.hide {
  display: none;
}

.play-button {
  border: solid 1px black;
  width: 70px;
  height: 40px;
  cursor: pointer;
  border-radius: 50px;
  left: 50%;
  position: fixed;
  top: 73%;
}

button.menu {
  border: solid 1px black;
  border-radius: 3px;
  cursor: pointer;
  font-size: 15px;
  margin-left: 3px;
}

button.menu.selected {
  background-color: #3c3133;
  color: #fff8fd;
}

button.stop-button:hover {
  background-color: #1e1e1e;
  color: #fff8fd;
  font-weight: bold;
}

button.menu:hover {
  background-color: #fcf9fb;
}
</style>
