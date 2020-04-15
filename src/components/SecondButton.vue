<template>
<div>
  <img id="bell2" src="../assets/images/bell.png" @mouseover="createSound(waveData); addJingle();" @mouseleave="removeJingle();" class="music-button" />
</div>

</template>

<script>
export default {
  name: 'SecondButton',
  props: ['waveData'],

  methods: {

     removeJingle(){
      let element = document.getElementById('bell2');
      element.classList.remove("music-jingle");

    },

    addJingle(){
      let element = document.getElementById('bell2');
      element.classList.toggle("music-jingle");

    },

    createSound(waveData){

     let context = new (window.AudioContext || window.webkitAudioContext)();
     let gain = context.createGain();
     let oscillator = context.createOscillator();
     let now = context.currentTime;

      oscillator.type = `${waveData}`;
      oscillator.frequency.value = 622.25;
      oscillator.connect(context.destination);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
      gain.connect(context.destination);
      oscillator.connect(gain);

      oscillator.start(now);
      oscillator.stop(now + 1);

    }
  }
}


</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



.music-button{
 width: 55px;
 height: 55px;
 position: fixed;
 top: 40%;
 left: 60%;

}

@keyframes jingle {
  0% {left: 59%;}
  5% { left: 60%; }
  10% {left: 59%;}
  15% {left: 60%;}
  20% {left: 59%;}
  30% {left: 60%;}
  35% {left: 59%;}
  40% {left: 60%;}
  45% {left: 59%;}
  50% {left: 60%;}
  55% {left: 59%;}
  60% {left: 60%;}
  65% {left: 59%;}
  70% {left: 60%;}
  75% {left: 59%;}
  80% {left: 60%;}
  85% {left: 59%;}
  90% {left: 60%;}
  95% {left: 59%;}
  100% {left: 60%;}

}

.music-jingle{
animation: jingle 1s ;
}
</style>
