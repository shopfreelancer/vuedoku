import Vue from 'vue'
import {PuzzlesFileParser} from "./PuzzlesFileParser.js"
import {EventBus} from '../event-bus.js';
     
export const PuzzlesStore = new Vue({
    data: {
        storageKeyName : "puzzles",
        puzzles : []
    },
    created() {
        
        if (localStorage.puzzles) {   
            this.puzzles =  this.getData("puzzles");
            setTimeout(function(){EventBus.$emit("puzzleStoreReady")},300);
            
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
        /**
        * Delete all data, then init Localstorage again
        */
        resetData(){
            this.articles = [];
            localStorage.clear();
            this.initData();
        },
        getPuzzleById(id) {
            if(this.articles[id] === "undefined"){
                return false;
            }
            return this.articles[id];
        }
    }
})