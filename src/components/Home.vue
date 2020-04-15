<template>
  <div>
    <h1>Music App</h1>
    <h2> Choose wave shape!</h2>


      <div v-for="(info, index) in waveData" :key="index" class="container">
        <button class="menu" @click="sendSound(info)">{{info}}</button>
      </div>


        <FirstButton @create-sound="initSound(soundType, 554.37)" />
        <SecondButton @create-sound="initSound(soundType, 622.25)" />
        <ThirdButton @create-sound="initSound(soundType, 493.88)" />
        <FourthButton @create-sound="initSound(soundType, 659.25)" />
        <FifthButton @create-sound="initSound(soundType, 698.46)" />



      <article>
       <h3>Record</h3>
       <button @click="recordAudio()" class="record-button">press</button>
      </article>


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
      clicked: false
    }
  },

  methods: {

    initSound(wave, tone){
      console.log("these are the home method");


     let context = new (window.AudioContext || window.webkitAudioContext)();
     let gain = context.createGain();
     let oscillator = context.createOscillator();
     let now = context.currentTime;

      oscillator.type = `${wave}`;
      oscillator.frequency.value = `${tone}`;
      oscillator.connect(context.destination);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      gain.connect(context.destination);
      oscillator.connect(gain);

      oscillator.start(now);
      oscillator.stop(now + 1);

      // let destination = ac.createMediaStreamDestination();
    // let mediaRecorder = new MediaRecorder(dest.stream);
    },

    recordAudio(){
      this.clicked = true;

      if(this.clicked){
        console.log("I'm ready to record!")
      }
    },

    sendSound(sound){
      this.soundType = sound;

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
  background-color: #d13c3c;
  color: #fff8fd;
  font-weight: bold;
}

button.menu{
  border: solid 1px black;
  border-radius: 3px;
  cursor: pointer;
  font-size: 15px;
  margin-left: 3px;
}

button.menu:hover{
  background-color: #fcf9fb;
}



</style>
