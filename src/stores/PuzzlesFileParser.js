import Vue from 'vue'
import { EventBus } from '../event-bus.js';
     
export const PuzzlesFileParser = new Vue({
    data: {
        puzzlesWithSolutions : [],
        importFilePath : "/static/data/sudoku.json",
    },
    created() {
         this.parseSudokuPuzzles();
    },    
    methods: {
        parseSudokuPuzzles(){
          fetch(this.importFilePath)
          .then(response =>response.text()).then(text => {
              this.puzzlesWithSolutions = JSON.parse(text);
              EventBus.$emit("puzzleDataParsed");
          });
        },
        getPuzzles(){
            return JSON.parse(JSON.stringify(this.puzzlesWithSolutions));
        }
    }
})