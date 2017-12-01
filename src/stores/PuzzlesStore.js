import Vue from 'vue'
import {PuzzlesFileParser} from "./PuzzlesFileParser.js"
     
export const PuzzlesStore = new Vue({
    data: {
        storageKeyName : "puzzles",
        puzzles : []
    },
    created() {
        console.log(PuzzlesFileParser.puzzles);
        if (localStorage.puzzles) {   
          this.puzzles =  this.getData("puzzles");
        } else {
            PuzzlesFileParser.getPuzzles()
            this.setData("puzzles", PuzzlesFileParser.puzzles);
            this.puzzles = this.getData("puzzles");
        }
    },
    watch: {
        articles: {
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