<template>
<div>
    <div class="board">
        <div class="square" v-for="field in fields">{{ field.value }}</div>
    </div>
    
    
</div>
</template>

<script>
export default {
  name: 'Board',
  created(){
      
      
      initSudokuPuzzles();
      //this.initAssignedNumbers();
      this.assignPuzzleToFields(1);
      

  },
  mounted(){
      this.generateFields().then( ()=>{this.parseSudokuPuzzles()} );
      
     
  },
  methods: {
    /**
    * Parses local txt file with sudoku puzzles from https://projecteuler.net/index.php?section=problems&id=96
    * every array key contains the 9x9 values for each field ordered by rows
    */
    parseSudokuPuzzles(){
    // parse txt file, extract puzzle from there
      fetch('/static/data/p096_sudoku.txt')
      .then(response =>response.text()).then(text => {
          const allLines = text.split(/\r\n|\n/);
          
          // All the puzzles start with a row called Grid 01, Grid 02...
          const delimiterString = "Grid";
          var delimiterArrayKeys = [];
          
          // get all array keys with delimiter key word
          for(let i=0;i< allLines.length;i++){
              if(allLines[i].search(delimiterString) !== -1){
                  delimiterArrayKeys.push(i);
              }
          }
          
          // extraxt lines for one puzzle. range of all array elements between key 1 and key 2
          var puzzles = [];
          for(let index = 0; index <delimiterArrayKeys.length; index++){
              let puzzle = allLines.slice(delimiterArrayKeys[index]+1,delimiterArrayKeys[index+1]);
              let puzzleString = puzzle.join("");
              
              this.puzzles[index] = [];
              for(let start = 0; start < puzzleString.length; start++){
                  let end = start+1;
                  this.puzzles[index].push(puzzleString.substring(start,end));
              }
          }
          
      });
    },
    initSudokuPuzzles(){
        
    },
    initAssignedNumbers(){
        for(let i=1;i<=9;i++){
            this.assignedNumbers.regions[i] = [];
            this.assignedNumbers.rows[i] = [];
            this.assignedNumbers.cols[i] = [];
            
            this.allowedNumbers.push(i);
        }
    },
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
    calculateRandomValueForField(field){
        
        var randomNumber;
        
        /**
        * get already assigned numbers for region, columns and rows
        */
        var notAllowedNumbers = this.assignedNumbers.regions[field.regionIndex].concat(this.assignedNumbers.rows[field.rowIndex], this.assignedNumbers.cols[field.colIndex]);
        
        /** 
        * remove double values
        */
        notAllowedNumbers = Array.from(new Set(notAllowedNumbers));

        
        /**
        * get array with allowed numbers
        */
        var allowedNumbers = this.allowedNumbers;
        allowedNumbers = allowedNumbers.filter(e => !notAllowedNumbers.includes(e));
        
        /**
        * pick random number from allowed numbers array
        */
        var randomArrayKey = this.getRandomInt(0,allowedNumbers.length-1);
        randomNumber = allowedNumbers[randomArrayKey];
        
        if(typeof randomNumber === "undefined"){
            console.log(allowedNumbers);
        }
        
        this.assignedNumbers.regions[field.regionIndex].push(randomNumber);
        this.assignedNumbers.rows[field.rowIndex].push(randomNumber);
        this.assignedNumbers.cols[field.colIndex].push(randomNumber);
        
        return randomNumber;
        
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
      assignedNumbers :  {
          'regions' : [],
          'rows' : [],
          'cols' : []
      },
      allowedNumbers : [],
      fields : [],
      puzzles : []
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
