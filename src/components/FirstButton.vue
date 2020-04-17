<template>
<div>
  <img id="bell" src="../assets/images/bell.png" @mouseover="createSound(); addJingle();" @mouseleave="removeJingle();" class="music-button" />


</div>

</template>

<script>


export default {
  name: 'FirstButton',
  props: ['waveData'],


  methods: {
     removeJingle(){
      let element = document.getElementById('bell');
      element.classList.remove("music-jingle");

    },

    addJingle(){
      let element = document.getElementById('bell');
      element.classList.add("music-jingle");

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
 left: 50%;
}

@keyframes jingle {
  0% {left: 49%;}
  5% { left: 50%; }
  10% {left: 49%;}
  15% {left: 50%;}
  20% {left: 49%;}
  30% {left: 50%;}
  35% {left: 49%;}
  40% {left: 50%;}
  45% {left: 49%;}
  50% {left: 50%;}
  55% {left: 49%;}
  60% {left: 50%;}
  65% {left: 49%;}
  70% {left: 50%;}
  75% {left: 49%;}
  80% {left: 50%;}
  85% {left: 49%;}
  90% {left: 50%;}
  95% {left: 49%;}
  100% {left: 50%;}

}

.music-jingle{
animation: jingle 1.5s ;
}

</style>
