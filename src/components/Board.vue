<template>
<div>  
    <div id="board" class="board animated fadeIn">
        <board-number-selector v-show="showNumberSelector"/>
        <div id="squareWrap">
            <div class="square" v-bind:class="{ 'has-error animated bounce' : field.validation.hasError, 'activeField' : field.validation.activeInput}" v-for="(field, key) in fields" :key="field.id" v-bind:id="field.id">

                <span v-if="!field.isUserInput" class="puzzle-field-value-grid">{{field.value}}</span>
                
                <input v-else v-model="field.userNumber" type="number" maxlength="1" min="1" max="9" step="1" v-bind:timeout="field.validation.timeout" @input="validateField(field,$event)" class="puzzle-field-empty">
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
import {PuzzlesStore} from '../stores/PuzzlesStore.js'
import {FieldsStore} from '../stores/FieldsStore.js'

export default {
  name: 'Board',
  created(){
      var self = this;
      
      if(self.methodCall === 'startRandomPuzzle'){
            self.startRandomPuzzle();
      }
      
      if(self.methodCall === 'mockOneFieldToVictory'){
            self.mockOneFieldToVictory();

      }
      
    },    
  methods: {
    numberExistInRow(field,number){
        if(this.peerMatrix.rows[field.rowIndex].includes(number)){
            return true;
        }
        return false;
    },
    numberExistInCol(field,number){
        if(this.peerMatrix.cols[field.colIndex].includes(number)){
            return true;
        }
        return false;
    },
    numberExistInRegion(field,number){
        if(this.peerMatrix.regions[field.regionIndex].includes(number)){
            return true;
        }
        return false;
    },       
    validateField(field,event){
        var self = this;
        
        field.validation.activeInput = true;
        
        field.validation.timeout = setTimeout(function () {
                    
            let userInput = parseInt(event.target.value);
            
            if(self.numberExistInRow(field,userInput) || self.numberExistInCol(field,userInput) || self.numberExistInRegion(field,userInput)){
                field.validation.hasError = true;
            } else {
                field.validation.hasError = false;
            }
        
            if(field.validation.timeout !== "undefined"){
                clearTimeout(field.validation.timeout);
            }
            }, 1000);
    
            self.udpateFieldsTillVictory();
        return;
        
    },
    startRandomPuzzle(){
        let randomPuzzleId = PuzzlesStore.getRandomPuzzleId();
        
        this.buildBoardByPuzzleId(randomPuzzleId);
    },
    buildBoardByPuzzleId(id){
        this.activePuzzleId = id;
        
        let activePuzzle = PuzzlesStore.getPuzzleById(this.activePuzzleId);

        FieldsStore.buildCompleteFieldsForBoard(activePuzzle);
        
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
        this.buildBoardByPuzzleId(7);
        
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
      BoardClock, BoardNumberSelector, BoardSolved
  },
  props : ['methodCall'],
  data () {
    return {
      activePuzzleId : "",
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