<template>
<div>
    <div id="start" class="container" v-show="activePanel == 'start'">
        <div class="jumbotron animated fadeIn">
            <h1>数独 [Sudoku]</h1>
            <p>Simple Demo of a Sudoku board realized with <a href="https://vuejs.org/" target="_blank">Vue.js</a>, <a target="_blank" href="https://bootswatch.com/">Bootswatch</a>, <a target="_blank" href="https://daneden.github.io/animate.css/">animate.css</a>. Uses 50 Sudoku Puzzles from <a target="_blank" href="https://projecteuler.net/index.php?section=problems&id=96">Project Euler</a>.
            If you´re looking for the math to solve 

</p>
            <button @click="initGame" class="btn btn-success">Start Random Game</button>
        </div>
    </div>    
    <div id="board" class="board animated fadeIn" v-show="activePanel == 'board'">
        <div class="square" v-for="(field, key) in fields" :key="field.id" v-bind:id="field.id">
            <span v-if="field.value != 0" class="puzzle-field-solution">{{field.value}}</span>
            <input v-model="field.userNumber" v-else type="number" maxlength="1" min="1" max="9" step="1" v-bind:timeout="field.timeout" @input="validateField(field,$event)" class="puzzle-field-empty">    
        </div>
    </div>
</div>
</template>

<script>
import {PuzzlesStore} from '../stores/PuzzlesStore.js'
import {EventBus} from '../event-bus.js';
    
// http://norvig.com/sudoku.html
export default {
  name: 'Board',
  created(){
      var self = this;
      
      self.initPeerMatrix();
      self.generateFields();
  },
  methods: {
    initGame(event){
        this.selectRandomPuzzle();
        this.assignPuzzleValuesToFields();
        this.activePanel = "board";
        
    },  
    initPeerMatrix(){
        for(let i = 1;i < 10;i++){
            this.peerMatrix.rows[i] = [];
            this.peerMatrix.cols[i] = [];
            this.peerMatrix.regions[i] = [];
        }
    },
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
        
        field.timeout = setTimeout(function () {
                    
            let userInput = parseInt(event.target.value);
            
            if(self.numberExistInRow(field,userInput) || self.numberExistInCol(field,userInput) || self.numberExistInRegion(field,userInput)){
                
                var errorClass = " has-error";
                var parentEl = event.target.parentNode;
                var hasErrorClass = parentEl.className.search(errorClass);
 
                if(!self.hasInputFieldErrorClass(event)){
                    self.attachErrorClassToInputField(event);  
                }
            } else {
            
                if(self.hasInputFieldErrorClass(event)){
                    self.removeErrorClassFromInputField(event);  
                }
            }

            if(field.timeout !== "undefined"){
                clearTimeout(field.timeout);
            }
            }, 1000);
        return;
        
    },
    hasInputFieldErrorClass(event){
            var errorClass = " has-error";
            var parentEl = event.target.parentNode;
            var hasErrorClass = parentEl.className.search(errorClass);
            
            if(hasErrorClass === -1){
                return false;
            }
        return true;
    },
    attachErrorClassToInputField(event){
            var errorClass = " has-error animated bounce";
            var parentEl = event.target.parentNode;
            
            parentEl.className = parentEl.className + errorClass;
    },
    removeErrorClassFromInputField(event){
            var errorClass = " has-error animated bounce";
            var parentEl = event.target.parentNode;
        
            let classNameWithoutErrorClass = parentEl.className.substr(0,parentEl.className.search(errorClass));
            parentEl.className = classNameWithoutErrorClass;
    },
    selectRandomPuzzle(){
        this.activePuzzleId = PuzzlesStore.getRandomPuzzleId();
        this.activePuzzle = PuzzlesStore.getPuzzleById(this.activePuzzleId);
    },
    /**
    * Assign the values of the puzzles to the yet empty fields
    */
    assignPuzzleValuesToFields(){

        for(let index = 0; index < this.fields.length; index++){
            let puzzleNumber = this.activePuzzle[index];
            
            /**
            * Save value in Matrix with the peer siblings of current field
            */
            this.peerMatrix.regions[this.fields[index].regionIndex].push(puzzleNumber);
            this.peerMatrix.rows[this.fields[index].rowIndex].push(puzzleNumber);
            this.peerMatrix.cols[this.fields[index].colIndex].push(puzzleNumber);

            this.fields[index].value = puzzleNumber;
        }
    },      
    generateFields(){    
        
        for(let i=1;i<=(9*9);i++){
            var field = {};
            field.colIndex = this.calculateColIndexForField(i);
            field.rowIndex = this.calculateRowIndexForField(i);
            field.regionIndex = this.calculateRegionIndexForField(field.colIndex,field.rowIndex)
            field.value = 0;
            field.id = i-1;
            field.timeout = 0;
            field.userNumber = "";
          
            this.fields.push(field);
        }
    },    
    calculateColIndexForField(i){
        let colIndex;    
        
        if(i%9 === 0){
            colIndex = 9;
        } else {
            colIndex = i - (Math.floor(i/9)*9)
        }
        
        return colIndex;
    },
    calculateRowIndexForField(i){
        let rowIndex;    
        
        if(i%9 === 0){
            rowIndex = i / 9;
        } else {
            rowIndex = Math.floor(i/9) +1;
        }

        return rowIndex;
    },
    calculateRegionIndexForField(colIndex,rowIndex){   
        
        const increaseNumber = 3;
        var rowIndexMin = 0;
        var rowIndexMax = 3
        
        var colIndexMin = 0;
        var colIndexMax = 3;
        
        for(var regionIndex = 1; regionIndex < 10; regionIndex++){
            
            if ((colIndex > colIndexMin && colIndex <= colIndexMax) && (rowIndex > rowIndexMin && rowIndex <= rowIndexMax)){
                return regionIndex;
            }
            
            // increase every third step
            if(regionIndex%3 == 0){
                rowIndexMin = rowIndexMin + increaseNumber;
                rowIndexMax = rowIndexMax + increaseNumber;
            }

            // increase every step 1-9, then reset
            if(regionIndex%3 == 0){
                colIndexMin = 0;
                colIndexMax = 3;
            } else {
                colIndexMin = colIndexMin + increaseNumber;
                colIndexMax = colIndexMax + increaseNumber;
            }
            
        }
       
        return regionIndex;
    },      
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  data () {
    return {
      activePanel : "start",
      fields : [],
      activePuzzleId : "",  
      activePuzzle : [],
      peerMatrix : {
          'rows' : [],
          'cols' : [],
          'regions' : []  
      }
    }
  }
}
</script>


<style>
    .board {
        width:80%;
        margin:4vw auto;
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
        min-width: 6vw;
        min-height: 6vw;
        font-size: 6vw;
        line-height: 6vw;
        vertical-align:middle;
   
    }
    
    .square:nth-child(3n) {
       border-right:10px solid white;
    }
    
    .square:nth-child(9n) {
       border-right:2px solid white;
    }
    
    .square:nth-child(n+28):nth-child(-n+36) {
       border-top:10px solid white;
    }
    
    .square:nth-child(n+55):nth-child(-n+63) {
       border-top:10px solid white;
    }
    
    [contenteditable]:focus {
        outline: 0px solid transparent;
    }
    
    .puzzle-field-solution {
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
</style>
