<template>
<div>
    <div class="board">
        <div class="square" v-for="field in fields">{{ field.value }}</div>
    </div>
    
    
</div>
</template>

<script>
import { PuzzlesStore } from '../stores/PuzzlesStore.js'
    
export default {
  name: 'Board',
  created(){
    
     
      this.assignPuzzleToFields(1);
      

  },
  mounted(){
      this.generateFields().then( ()=>{this.parseSudokuPuzzles()} );
      
     
  },
  methods: {

    /**
    * Assign the values of the puzzles to the yet empty fields
    */
    assignPuzzleToFields(puzzleIndex){
        console.log(this.fields);
        for(let index = 0; index < this.fields.length; index++){
          
            if(this.puzzles[puzzleIndex][index] != 0){
                this.fields[index].value = this.puzzles[puzzleIndex][index];
            }
        }
        
    },
    generateFields(){    
        
        for(let i=1;i<=(9*9);i++){
            var field = {};
            
            field.colIndex = this.calculateColIndexForField(i);
            field.rowIndex = this.calculateRowIndexForField(i);
            field.regionIndex = this.calculateRegionIndexForField(field.colIndex,field.rowIndex)
            
            // @todo: muss ausgelagert werden, da es später mehrere values geben kann.
            //field.value = this.calculateRandomValueForField(field);
          
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
      fields : [],
      puzzles : PuzzlesStore.puzzles
    }
  }
}
</script>


<style scoped>
.board {
    width:80%;
    margin:0 auto;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
    
.square {
    background: #6C7A89;
    cursor: pointer;
    font-family: "Oswald", sans-serif;
    font-size: 5vw;
    line-height: 5vw;
    text-align: center;
    color: white;
    border:2px solid white;
    width: 11.1111111%;
    box-sizing: border-box;
}
.square:nth-child(3n) {
   border-right:6px solid white;
}
</style>
