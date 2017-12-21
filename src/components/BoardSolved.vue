<template>
<div>
  <div id="gameWon" class="animated bounceIn">
        <div id="gameWonInner">
            <h2>You Won! Congrats!</h2>
            <p>You solved Puzzle 50. <span v-if="finalClock">Your time: {{finalClock}}</span></p>
    
            <button @click="initStart" class="btn btn-success">Try new game?</button>
        </div>
    </div>
    <div class="modal-backdrop show fade"></div>
</div>    
</template>

<script>
import {EventBus} from '../event-bus.js'; 
import BoardClock from '@/components/BoardClock'
export default {
  name: 'BoardSolved',
  created(){
    var self = this;
    EventBus.$on("finalClock",function(finalClock){
        self.finalClock = finalClock;
    });
  },  
  methods: {
    initStart(event){
        EventBus.$emit('activeComponent', 'Start');
    }
  },
  props : ['userWonGame'],
  data () {
    return {
        finalClock : ''
    }
  }
}
</script>

<style>
   #gameWon {
       position: absolute;
       left: 0;
       right: 0;
       top: 0;
       bottom: 0;
       margin:auto;
       display:table;
       max-width:50%;
       z-index: 9999;
    }
    
    #gameWonInner {
        background-color:#32383e;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 0.3rem;
        padding: 20px;
    }
</style>