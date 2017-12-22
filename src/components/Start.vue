<template>
    <div id="start" class="container">
        <div class="jumbotron animated fadeIn">
            <h1>数独 [Sudoku]</h1>
            <p>Simple Demo of a Sudoku board realized with <a href="https://vuejs.org/" target="_blank">Vue.js</a>, <a target="_blank" href="https://bootswatch.com/">Bootswatch</a>, <a target="_blank" href="https://daneden.github.io/animate.css/">animate.css</a>. Uses 50 Sudoku Puzzles from <a target="_blank" href="https://projecteuler.net/index.php?section=problems&id=96">Project Euler</a>.</p>

            <button @click="randomGame" class="btn btn-success">Start Random Puzzle</button>
            <button @click="mockOneFieldToVictory" class="btn btn-success">Mock almost won game</button>
            
        </div>
    </div>   
</template>

<script>
import {EventBus} from '../event-bus.js';    
export default {
  name: 'Start',
  props : ['activeComponent'],
  methods: {
    randomGame(){
        let randomPuzzleId = this.$PuzzlesStore.getRandomPuzzleId();
        EventBus.$emit('activeComponent', 'Board', 'buildBoardByPuzzleId', randomPuzzleId);
    },
    mockOneFieldToVictory(){
        let activePuzzleId = 7;
        EventBus.$emit('activeComponent', 'Board', 'mockOneFieldToVictory', activePuzzleId);
    }
  }
}
</script>

<style>
    #board {
        width:80%;
        margin:4vw auto;
    }
    
    #start {
        margin-top: 100px;
    }
    
</style>