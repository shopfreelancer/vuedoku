<template>
<div>  
    <div id="board" class="board animated fadeIn">
        
        <div id="editorWrap">
            <div id="editorButtonsWrap">
                <button type="button" class="btn btn-outline-primary">Edit</button>
                <button type="button" class="btn btn-outline-secondary">Note</button>
            </div>
            <div id="numberSelectorWrap">
                <button class="btn btn-secondary" v-for="number in numbersSelectorPanel">{{number}}</button>
            </div>
        </div>
        
        <div id="squareWrap">
            <div class="square" v-bind:class="{ 'has-error animated bounce' : field.validation.hasError, 'activeField' : field.validation.activeInput}" v-for="(field, key) in fields" :key="field.id" v-bind:id="field.id">
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

export default {
  name: 'Board',
  created(){
      this.initNumbersSelectorPanel();
      this.initGame();
  },
  methods: {
     initNumbersSelectorPanel(){
        for(let i = 1;i<10;i++){
            this.numbersSelectorPanel.push(i);
        }
    },
    initGame(event){
        this.selectRandomPuzzle();
    },
    saveGame(){
        // get all, fields. save to localstorage.
        let data = this.fields;
        localStorage.setItem( "savedGame", JSON.stringify( data ) );
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
        return;
        
    },
    selectRandomPuzzle(){
        this.activePuzzleId = PuzzlesStore.getRandomPuzzleId();
        let activePuzzle = PuzzlesStore.getPuzzleById(this.activePuzzleId);
        
        FieldsStore.buildCompleteFieldsForBoard(activePuzzle);
    },
  },
  data () {
    return {
      activePuzzleId : "",
      fields : FieldsStore.fields,
      peerMatrix : FieldsStore.peerMatrix,
      numbersSelectorPanel : []  
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
    
    #numberSelectorWrap {
        margin-bottom:20px;
    }
    
    #editorButtonsWrap {margin-bottom:10px;}
    
    .activeField {
        outline:2px solid #5bc0de;
    }
</style>
