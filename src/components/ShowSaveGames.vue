<template>
<div id="save-games">
    <span v-for="(saveGame,key) in saveGames" @click="loadGame(key)" class="save-game-button badge badge-light">load Game {{ saveGame.activePuzzleId }}</span>
</div>    
</template>

<script>
import {EventBus} from '../event-bus.js';    
export default {
  name: 'ShowSaveGames',
  props : ['activeComponent'],
  created() {
      this.showSaveGames();
  },
  methods: {
    showSaveGames(){
        this.saveGames = this.$GamesStore.loadAllGames();
        console.log(this.saveGames);
    }
  },
  data () {
    return {
        saveGames : ''
    }
  }
}
</script>

<style>
 .save-game-button {cursor:pointer;margin-right:2px;}
</style>