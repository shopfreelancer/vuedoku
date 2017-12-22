import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';
import {PuzzlesFileParser} from "./PuzzlesFileParser.js"
//import PuzzlesDataJson from '../../static/data/sudoku.json';

const PuzzlesStore = new Vue({
    data: {
        puzzles : [],
    },
    created() {
        var self = this;
        EventBus.$on("puzzleDataParsed",function(){
            let puzzles = PuzzlesFileParser.puzzles;
            self.setPuzzles(puzzles);
        });
    },
    methods: {
        getRandomPuzzleId(){
            let len = Object.keys(this.puzzles).length;
            if(len === 0){
                return false;
            }
            return this.getRandomInt(0,len);
        },
        getPuzzleById(id){
            if(this.puzzles[id] === "undefined"){
                return false;
            }
            return this.puzzles[id];
        },
        setPuzzles(puzzles){
            if(!typeof puzzles || puzzles.length < 1){
                return false;
            }
            this.puzzles = puzzles
        }
    }
})
Object.defineProperties(Vue.prototype, {
  $PuzzlesStore: {
    get: function () {
      return PuzzlesStore
    }
  }
})
export {PuzzlesStore}