<template>
<div>  
    <div id="board" class="board animated fadeIn">
        <board-number-selector v-show="showNumberSelector"/>
        <div id="squareWrap">
            <div class="square" v-bind:class="{ 'has-error animated bounce' : field.validation.hasError, 'activeField' : field.validation.activeInput}" v-for="(field, key) in fields" :key="field.id" v-bind:id="field.id">

                <span v-if="!field.isUserInput" class="puzzle-field-value-grid">{{field.value}}</span>
                <board-user-number-input v-bind:peerMatrix="peerMatrix" v-bind:field="field"/>
            </div>
        </div>

        <div id="badgeWrap">
            <span class="badge badge-light">Puzzle {{ activePuzzleId }}</span>
            <board-clock v-bind:userWonGame="userWonGame"/>
        </div>
    </div>
    
    <board-solved v-if="userWonGame"/>
    
</div>
</template>

<script>
import {EventBus} from '../event-bus.js';
import BoardClock from '@/components/BoardClock'
import BoardNumberSelector from '@/components/BoardNumberSelector'
import BoardSolved from '@/components/BoardSolved'
import BoardUserNumberInput from '@/components/BoardUserNumberInput'
import {FieldsStore} from '../stores/FieldsStore.js'

export default {
  name: 'Board',
  created(){
      var self = this;
      
      if(self.methodCall === 'buildBoardByPuzzleId'){
            self.buildBoardByPuzzleId();
      }
      
      if(self.methodCall === 'mockOneFieldToVictory'){
            self.mockOneFieldToVictory();
      }
      
      this.$on('udpateFieldsTillVictory',function(){
          self.udpateFieldsTillVictory();
      });
      
    },    
  methods: {
    buildBoardByPuzzleId(){

        FieldsStore.buildCompleteFieldsForBoard(this.activePuzzleId);
        
        this.udpateFieldsTillVictory();
    },
    userAchievedVictory(){
        this.userWonGame = true;
    },
    udpateFieldsTillVictory(){
        var self = this;
        let fieldsSolvedByUser = 0;
        this.fields.forEach(function(field){
            if(field.isUserInput === true && parseInt(field.userNumber) === field.solution ){
                fieldsSolvedByUser++;
            }
        })
        self.fieldsTillVictory = 81 - (FieldsStore.unsolvedFieldsInGrid + fieldsSolvedByUser);
        
        if(self.fieldsTillVictory === 0){
            self.userAchievedVictory();
        }
    },
    /**
    * Mock field for an almost game
    */
    mockOneFieldToVictory(){
    
        this.buildBoardByPuzzleId();
        
        let oneFieldFound = false;
        for(let i = 1; i < FieldsStore.fields.length; i++){
            // skip this field so we have exactly one field without solution
            if(FieldsStore.fields[i].isUserInput === true && oneFieldFound === false){
                oneFieldFound = true;
            } else {
                let tempField = FieldsStore.fields[i];
                tempField.value = parseInt(tempField['solution']);
                tempField.userNumber = parseInt(tempField['solution']);
                this.$set(FieldsStore.fields, i, tempField);
            }
        }
    }
  },
  components : {
      BoardClock, BoardNumberSelector, BoardSolved, BoardUserNumberInput
  },
  props : ['methodCall', 'activePuzzleId'],
  data () {
    return {
      fields : FieldsStore.fields,
      peerMatrix : FieldsStore.peerMatrix,
      fieldsTillVictory : 0,
      userWonGame : false,
      showNumberSelector : false
    }
  }
}
</script>


<style>
    body {height:100%;}
    #board {
        max-width:80%;
        height:100vh;
        margin:4vw auto;
    }
    
    #squareWrap {
        background-color:#fff;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        order:9;
    } 

    .square {
        background: #6C7A89;
        cursor: pointer;
        text-align: center;
        color: white;
        border:2px solid white;
        width: 11.1111111%;
        box-sizing: border-box;
        max-height: calc((100vh - 4vw)/9);
        font-size: 5vw;
        line-height: 5vw;
        vertical-align:middle;
   
    }
    
    .square:nth-child(3n) {
       border-right:10px solid white;
    }
    
    .square:nth-child(9n) {
       border-right:2px solid white;
    }
    
    .square:nth-child(n+28):nth-child(-n+36) {
        margin-top:10px;
    }
    
    .square:nth-child(n+55):nth-child(-n+63) {
       margin-top:10px;
    }
    
    [contenteditable]:focus {
        outline: 0px solid transparent;
    }
    
    .puzzle-field-value-grid {
        color:bisque;
        vertical-align:middle;
    }
    input.puzzle-field-empty {
        color:#fff;
        width:100%;
        height:100%;
        border:0;
        background-color:transparent;
        font-size: 6vw;
        text-align: right;
        padding:0;
    }
    *:focus {
        outline: none;
    }
    .square.has-error {
        background-color:#ff6300;
    }
     
    #start {
        margin-top: 100px;
    }

    
    /** @todo remove testing **/
    .puzzle-field-solution-computed {color:aqua;position:absolute;font-size:10px;}
    .square {   position: relative; }
    .puzzle-field-allowed-values {font-size:10px;}
</style>