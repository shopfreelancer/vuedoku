<template>
<div id="boardClock" class="board-clock badge badge-dark">
    <span v-if="clock.hours > 0"><span class="board-clock-hours">{{clock.hours}}</span>:</span>
    <span class="board-clock-minutes">{{clock.minutes}}</span>:<span class="board-clock-seconds">{{clock.secondsFormated}}</span>
</div>
</template>

<script>
import {EventBus} from '../event-bus.js'; 
    
export default {
  name: 'BoardClock',
  created(){
      var self = this;
      self.clockIterval = setInterval(self.setClock, 1000);
      
      EventBus.$on('stopClock', function(){
          self.resetClock();
      });
  },
  watch: {
        /**
        * Game won. Stop clock, emit final time
        */
        userWonGame: {
          handler: function () {
            var self = this;
            if(self.userWonGame === true){
                clearInterval(this.clockIterval);
                EventBus.$emit("finalClock",self.getClockAsString());
            }       
          },
        }
  },     
  methods: {
     resetClock(){
         clearInterval(this.clockIterval);
         
         this.clock.hours = 0;
         this.clock.minutes = 0;
         this.clock.seconds = 0;
         this.clock.secondsFormated = "00";
     },
     setClock(){
         if(this.clock.seconds < 60){
             this.clock.seconds += 1;
         } else {
             this.clock.seconds = 0;
             this.clock.minutes += 1;
         }
         
         if(this.clock.minutes > 59){
             this.clock.hours += 1;
             this.clock.minutes = 0;
         }
         this.formatSecondsForDisplay();
         
         EventBus.$emit("currentClock",this.getClockAsString());
     },
     /**
     * Format seconds as double digit string
     */
     formatSecondsForDisplay(){
         let secondsFormated = this.clock.seconds;
         
         if(this.clock.seconds < 10){
             secondsFormated = "0"+this.clock.seconds;
         }
         
         this.clock.secondsFormated = secondsFormated;
     },
     /**
     * Format data object to String
     * @returns {String}
     */
     getClockAsString(){
         let clock = this.clock;
         let clockString = "";
         
         if(clock.hours > 0){
             clockString += clock.hours+":";
         }
         clockString += clock.minutes+":"+clock.secondsFormated
         return clockString;
     }
  },
  props : ['userWonGame'],
  data () {
    return {
      clockIterval : "",
      clock : {
          hours : 0,
          minutes : 0,
          seconds : 0,
          secondsFormated : "00"
      }
    }
  }
}
</script>

<style></style>