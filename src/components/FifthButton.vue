<template>
<div>
  <img id="bell5" src="../assets/images/bell.png" @mouseover="createSound(); addJingle();" @mouseleave="removeJingle();" class="music-button" />


</div>

</template>

<script>
export default {
  name: 'FifthButton',
  props: ['waveData'],


  methods: {

    removeJingle(){
      let element = document.getElementById('bell5');
      element.classList.remove("music-jingle");

    },


    addJingle(){
      let element = document.getElementById('bell5');
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
 left: 30%;
}

@keyframes jingle {
  0% {left: 29%;}
  5% { left: 30%; }
  10% {left: 29%;}
  15% {left: 30%;}
  20% {left: 29%;}
  30% {left: 30%;}
  35% {left: 29%;}
  40% {left: 30%;}
  45% {left: 29%;}
  50% {left: 30%;}
  55% {left: 29%;}
  60% {left: 30%;}
  65% {left: 29%;}
  70% {left: 30%;}
  75% {left: 29%;}
  80% {left: 30%;}
  85% {left: 29%;}
  90% {left: 30%;}
  95% {left: 29%;}
  100% {left: 30%;}

}

.music-jingle{
animation: jingle 1s ;
}

</style>
