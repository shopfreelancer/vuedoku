import Vue from 'vue'
     
export const PuzzlesStore = new Vue({
    data: {
        storageKeyName : "puzzles",
        puzzles : []
    },
    created() {
        if ( localStorage.puzzles ) {   
          this.puzzles =  this.getData( "puzzles" );
        } else {
          this.parseSudokuPuzzles();
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

                  puzzles[index] = [];
                  for(let start = 0; start < puzzleString.length; start++){
                      let end = start+1;
                      puzzles[index].push(puzzleString.substring(start,end));
                  }
              }
              this.setData( "puzzles", puzzles );
              this.puzzles = this.getData("puzzles");
              

          });
        },        
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