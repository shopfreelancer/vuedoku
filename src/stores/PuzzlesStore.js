import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';
import {PuzzlesFileParser} from "./PuzzlesFileParser.js"

export const PuzzlesStore = new Vue({
    data: {
        storageKeyName : "puzzles",
        puzzles : []
    },
    created() {
        if (localStorage.puzzles) {
            this.puzzles =  this.getData("puzzles");
            /**
            * PuzzlesStore is an own Vue instance. 
            * Timeout is set to make sure event gets emited after other instances are created and listen.
            */
            setTimeout(function(){EventBus.$emit("puzzlesStoreReady")},100);
        } else {
            var self = this;
            
            PuzzlesFileParser.parseSudokuPuzzles();
            
            EventBus.$on("puzzleDataParsed", function () {
                let puzzles = PuzzlesFileParser.getPuzzles(); 
                self.setData("puzzles", puzzles);
                self.puzzles = self.getData("puzzles");
                EventBus.$emit("puzzlesStoreReady");
            });
        }        
    },
    watch: {
        puzzles: {
          handler: function () {
            this.setData( this.storageKeyName , this.puzzles );
          },
          deep: true
        }
    },    
    methods: {       
        setData( key, data ) {
            localStorage.setItem( key, JSON.stringify( data ) );
        },
        getData( key ) {
           return JSON.parse( localStorage.getItem( key ) );
        },
        getRandomPuzzleId(){
            let len = Object.keys(PuzzlesStore.puzzles).length;
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
    }
})