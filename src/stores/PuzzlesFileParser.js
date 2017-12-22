import Vue from 'vue'
import { EventBus } from '../event-bus.js';
     
export const PuzzlesFileParser = new Vue({
    data: {
        puzzles : [],
        importFilePath : "/static/data/sudoku.json",
    },
    created() {
         this.parseSudokuPuzzles();
    },    
    methods: {
        parseSudokuPuzzles(){
          var self = this;
          fetch(this.importFilePath)
          .then(function(response) { return response.json(); })
          .then(function(data) {
              self.puzzles = data;
              EventBus.$emit("puzzleDataParsed");
          });
        },
        getPuzzles(){
            return this.puzzles;
        }
    }
})