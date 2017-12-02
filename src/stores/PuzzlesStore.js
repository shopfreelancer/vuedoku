import Vue from 'vue'
import {PuzzlesFileParser} from "./PuzzlesFileParser.js"
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';

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
            setTimeout(function(){EventBus.$emit("puzzleStoreReady")},100);
        } else {
            var self = this;
            EventBus.$on("puzzleDataParsed", function (e) {
                var puzzles = PuzzlesFileParser.getPuzzles()         
                self.setData("puzzles", puzzles);
                self.puzzles = self.getData("puzzles");
                EventBus.$emit("puzzleStoreReady");
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
            if(this.puzzles.length === 0){
                return false;
            }
            return this.getRandomInt(0,this.puzzles.length);
        },
        getPuzzleById(id){
            if(this.puzzles[id] === "undefined"){
                return false;
            }
            return this.puzzles[id];
        },        
        /**
        * Delete all data, then init localstorage
        */
        resetData(){
            this.articles = [];
            localStorage.clear();
            this.initData();
        }       
    }
})