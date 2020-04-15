<template>
<div>
  <img id="bell4" src="../assets/images/bell.png" @mouseover="createSound(); addJingle();" @mouseleave="removeJingle();" class="music-button" />
</div>

</template>

<script>
export default {
  name: 'FourthButton',
  props: ['waveData'],

  methods: {

     removeJingle(){
      let element = document.getElementById('bell4');
      element.classList.remove("music-jingle");

    },

    addJingle(){
      let element = document.getElementById('bell4');
      element.classList.toggle("music-jingle");

    },

    createSound(){
      this.$emit('create-sound');

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
 left: 70%;

}

@keyframes jingle {
  0% {left: 69%;}
  5% { left: 70%; }
  10% {left: 69%;}
  15% {left: 70%;}
  20% {left: 69%;}
  30% {left: 70%;}
  35% {left: 69%;}
  40% {left: 70%;}
  45% {left: 69%;}
  50% {left: 70%;}
  55% {left: 69%;}
  60% {left: 70%;}
  65% {left: 69%;}
  70% {left: 70%;}
  75% {left: 69%;}
  80% {left: 70%;}
  85% {left: 69%;}
  90% {left: 70%;}
  95% {left: 69%;}
  100% {left: 70%;}

}

.music-jingle{
animation: jingle 1s ;
}
</style>
