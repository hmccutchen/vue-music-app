<template>
  <div>
    <h1>Music App</h1>
    <h2> Choose wave shape!</h2>


      <div v-for="(info, index) in waveData" :key="index" class="container">
        <button class="menu" @click="sendSound(info)">{{info}}</button>
      </div>


        <FirstButton :waveData="soundType" />
        <SecondButton :waveData="soundType" />
        <ThirdButton :waveData="soundType" />
        <FourthButton :waveData="soundType" />
        <FifthButton :waveData="soundType" />




      <article>
       <h3>Record</h3>
       <button class="record-button">press</button>
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
      soundType: '',    }
  },

  methods: {

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
