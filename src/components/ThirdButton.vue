<template>
<div>
  <img id="bell3" src="../assets/images/bell.png" @mouseover="createSound(waveData); addJingle();" @mouseleave="removeJingle();" class="music-button" />
</div>

</template>

<script>
export default {
  name: 'ThirdButton',
  props: ['waveData'],

  methods: {

     removeJingle(){
      let element = document.getElementById('bell3');
      element.classList.remove("music-jingle");

    },


    addJingle(){
      let element = document.getElementById('bell3');
      element.classList.toggle("music-jingle");

    },

    createSound(waveData){

     let context = new (window.AudioContext || window.webkitAudioContext)();
     let gain = context.createGain();
     let oscillator = context.createOscillator();
     let now = context.currentTime;

      oscillator.type = `${waveData}`;
      oscillator.frequency.value = 493.88;
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
 left: 40%;

}

@keyframes jingle {
  0% {left: 39%;}
  5% { left: 40%; }
  10% {left: 39%;}
  15% {left: 40%;}
  20% {left: 39%;}
  30% {left: 40%;}
  35% {left: 39%;}
  40% {left: 40%;}
  45% {left: 39%;}
  50% {left: 40%;}
  55% {left: 39%;}
  60% {left: 40%;}
  65% {left: 39%;}
  70% {left: 40%;}
  75% {left: 39%;}
  80% {left: 40%;}
  85% {left: 39%;}
  90% {left: 40%;}
  95% {left: 39%;}
  100% {left: 40%;}

}

.music-jingle{
animation: jingle 1s ;
}
</style>
