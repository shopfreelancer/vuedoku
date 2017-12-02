<template>
<div>
    <div id="start" class="container" v-show="activePanel == 'start'">
        <div class="jumbotron animated fadeIn">
            <h1>数独 [Sudoku]</h1>
            <p>Simple Demo of a Sudoku board realized with <a href="https://vuejs.org/" target="_blank">Vue.js</a>, <a target="_blank" href="https://bootswatch.com/">Bootswatch</a>, <a target="_blank" href="https://daneden.github.io/animate.css/">animate.css</a>. Uses 50 Sudoku Puzzles from <a target="_blank" href="https://projecteuler.net/index.php?section=problems&id=96">Project Euler</a>.</p>

            <button @click="initGame" class="btn btn-success">Start Random Game</button>
        </div>
    </div>    
    <div id="board" class="board animated fadeIn" v-show="activePanel == 'board'">
        <div id="squareWrap">
            <div class="square" v-bind:class="{ 'has-error animated bounce' : field.validation.hasError}" v-for="(field, key) in fields" :key="field.id" v-bind:id="field.id">
                <span v-if="field.value != 0" class="puzzle-field-solution">{{field.value}}</span>
                <input v-model="field.userNumber" v-else type="number" maxlength="1" min="1" max="9" step="1" v-bind:timeout="field.validation.timeout" @input="validateField(field,$event)" class="puzzle-field-empty">    
            </div>
        </div>
        <div id="badgeWrap">
            <span class="badge badge-light">Puzzle {{ activePuzzleId }}</span>
            <span class="badge badge-dark" @click="saveGame">Save Game</span>
        </div>
    </div>
</div>
</template>

<script>
import {PuzzlesStore} from '../stores/PuzzlesStore.js'
import {FieldsStore} from '../stores/FieldsStore.js'
import {EventBus} from '../event-bus.js';
    
// http://norvig.com/sudoku.html
export default {
  name: 'Board',
  created(){
      this.initPeerMatrix();
  },
  methods: {
    initGame(event){
        this.selectRandomPuzzle();
        this.assignPuzzleValuesToFields();
        this.activePanel = "board";
        
    },
    saveGame(){
        // get all, fields. save to localstorage.
        let data = this.fields;
        localStorage.setItem( "savedGame", JSON.stringify( data ) );
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
  },
  data () {
    return {
      activePanel : "start",
      fields : FieldsStore.fields,
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
    body {
        background:
linear-gradient(135deg, #6C7A89 22px, #404b56 22px, #404b56 24px, transparent 24px, transparent 67px, #404b56 67px, #404b56 69px, transparent 69px),
linear-gradient(225deg, #6C7A89 22px, #404b56 22px, #404b56 24px, transparent 24px, transparent 67px, #404b56 67px, #404b56 69px, transparent 69px)0 64px;
background-color:#6C7A89;
background-size: 64px 128px
    }
    
    #board {
        width:80%;
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
        margin-top:10px;
    }
    
    .square:nth-child(n+55):nth-child(-n+63) {
       margin-top:10px;
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
