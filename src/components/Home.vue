<template>
  <div>
    <h1>Music App</h1>
    <h2> Choose wave shape!</h2>


      <div v-for="(info, index) in waveData" :key="index" class="container">
        <button id="menuItem" class="menu" @click="sendSound(info), menuSelected(soundType)">{{info}}</button>
      </div>


        <FirstButton @create-sound="initSound(soundType, 554.37)" />
        <SecondButton @create-sound="initSound(soundType, 622.25)" />
        <ThirdButton @create-sound="initSound(soundType, 493.88)" />
        <FourthButton @create-sound="initSound(soundType, 659.25)" />
        <FifthButton @create-sound="initSound(soundType, 440.00)" />



      <article>
       <h3>Record</h3>
       <button v-if="clicked === false" @click="recordAudio()" class="record-button">record</button>
       <button v-else-if="clicked === true" @click="stopAudio()" class="stop-button">stop</button>
      </article>

        <div>

       <audio  controls id= "audio-box" class="play-button hide" src=""></audio>

        </div>




     </div>

</template>

<script>
import FirstButton from '../components/FirstButton.vue';
import SecondButton from '../components/SecondButton.vue';
import ThirdButton from '../components/ThirdButton.vue';
import FourthButton from '../components/FourthButton.vue';
import FifthButton from '../components/FifthButton.vue';

export default {
  name: 'Home',
  components: {
    FirstButton, SecondButton, ThirdButton, FourthButton, FifthButton
  },
  data(){
    return{
      waveData: ['sine', 'triangle', 'sawtooth', 'square'],
      soundType: '',
      clicked: false,
      stop: false,
      reording: null,
      media: {},
      context: {},
      dest: {},
      chunkData: []
    }
  },

  methods: {

    initSound(wave, tone){

     let context = new (window.AudioContext || window.webkitAudioContext)();
     let gain = context.createGain();
     let oscillator = context.createOscillator()
     // let dest = this.context.createMediaStreamDestination();
     let now = context.currentTime
     // let mediaRecorder = new MediaRecorder(dest.stream);

     if(this.recording){
     let gain = this.context.createGain();
     let oscillator = this.context.createOscillator()
     let now = this.context.currentTime

      oscillator.type = `${wave}`;
      oscillator.frequency.value = `${tone}`;
      oscillator.connect(this.context.destination);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(this.context.destination);
      oscillator.connect(gain);
      oscillator.connect(this.dest)
      oscillator.start(now);
      oscillator.stop(now + 1);
     } else{

      oscillator.type = `${wave}`;
      oscillator.frequency.value = `${tone}`;
      oscillator.connect(context.destination);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(context.destination);
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 1);
    }


    },

    recordAudio(){
      this.clicked = true;
      this.recording = true;
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let dest = context.createMediaStreamDestination();
    let mediaRecorder = new MediaRecorder(dest.stream);
    this.context = context;
    this.dest = dest;
    this.media = mediaRecorder;
    this.media.start()
    console.log(this.media.state);


    },

    stopAudio(){
      this.clicked = false;
      this.recording = false;
      this.stop = true;
      this.media.stop()
      let chunks = [];
      console.log(this.media.state);
      this.media.ondataavailable = function(e) {

        chunks.push(e.data);
        console.log("this inside the function!")
          console.log(chunks)
      }
      // this.chunkData = chunks
      let audio = document.getElementById('audio-box');

      setTimeout(() => {
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });

      chunks = [];

      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
       audio.classList.remove("hide");
    }, 2000)

    },

    sendSound(sound){
      this.soundType = sound;

    },
    menuSelected(wave){
      let menuItem = document.getElementsByClassName('menu');
      for(let item in menuItem){
      if(wave === menuItem[item].textContent){
        menuItem[item].style.backgroundColor = '#3c3133';
        menuItem[item].style.color = '#fff8fd';
      } else {
         menuItem[item].style.backgroundColor = '';
         menuItem[item].style.color = '';
      }

      }


    }
  }

}


</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container{
  display: inline-flex;

}

 article{
  left: 50%;
  position: fixed;
  top: 58%;
}

.record-button{
  border: solid 1px black;
  width: 70px;
  height: 40px;
  background-color: #fcf9fb;
  font-size: 15px;
  cursor: pointer;
  border-radius: 50px;
}

.record-button:hover{
  background-color: #d84b41;
  color: #fff8fd;
  font-weight: bold;
}

.stop-button{
  border: solid 1px black;
  width: 70px;
  height: 40px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 50px;

}

.hide{
  display: none;
}


.play-button{
  border: solid 1px black;
  width: 70px;
  height: 40px;
  /*background-color: #fcf9fb;*/
  cursor: pointer;
  border-radius: 50px;
  left: 50%;
  position: fixed;
  top: 73%;
}

button.menu{
  border: solid 1px black;
  border-radius: 3px;
  cursor: pointer;
  font-size: 15px;
  margin-left: 3px;
}

button.stop-button:hover{
  background-color: #1e1e1e;
  color: #fff8fd;
  font-weight: bold;
}
button.menu:hover{
  background-color: #fcf9fb;
}


</style>
