import Vue from 'vue'
import { EventBus } from '../event-bus.js';
     
export const PuzzlesFileParser = new Vue({
    data: {
        puzzles : [],
        delimiterString : "Grid" ,
        importFilePath : "/static/data/p096_sudoku.txt",
        delimiterArrayKeys : [],
        allLinesArray : []
    },
    created() {
         this.parseSudokuPuzzles();
    },    
    methods: {
        /**
        * Parses local txt file with sudoku puzzles from https://projecteuler.net/index.php?section=problems&id=96
        * every array key contains the 9x9 values for each field ordered by rows
        */
        parseSudokuPuzzles(){
            
          fetch(this.importFilePath)
          .then(response =>response.text()).then(text => {
              
              this.allLinesArray = text.split(/\r\n|\n/);
             
              this.findArrayKeysOfDelimiterLines();
              this.extractAllSinglePuzzles();
          });
        },
        /**
        * extraxt lines for one puzzle. range of all array elements between key 1 and key 2
        **/
        extractAllSinglePuzzles(){
            for(var index = 0; index < this.delimiterArrayKeys.length; index++){
                  let singlePuzzleArray = this.allLinesArray.slice(this.delimiterArrayKeys[index]+1,this.delimiterArrayKeys[index+1]);
                  
                  var puzzleString = singlePuzzleArray.join("");
    
                  this.puzzles[index] = [];
                  
                  for(let start = 0; start < puzzleString.length; start++){
                      let end = start+1;
                      this.puzzles[index].push(parseInt(puzzleString.substring(start,end)));
                  }
                
            }
            EventBus.$emit("puzzleDataParsed");
        },
        /**
        *  All the puzzles start with a row called Grid 01, Grid 02...
        *  Get all array keys with delimiter key word
        */
        findArrayKeysOfDelimiterLines(){
            for(let i=0;i< this.allLinesArray.length;i++){
                if(this.allLinesArray[i].search(this.delimiterString) !== -1){
                    this.delimiterArrayKeys.push(i);
                }
            }
        },

        getPuzzles(){
            return JSON.parse(JSON.stringify(this.puzzles));
        }
    }
})