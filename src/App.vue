<template>
  <div id="app">
    <component :is="activeComponent" v-bind:methodCall="methodCall"></component>
  </div>
</template>

<script>
import Start from '@/components/Start'
import Board from '@/components/Board'
import {EventBus} from './event-bus.js'; 
import {PuzzlesStore} from './stores/PuzzlesStore.js'
import {PuzzlesFileParser} from "./stores/PuzzlesFileParser.js"
    
export default {
    name: 'app',
    components : {Start, Board},
    created: function() {
          var self = this;
        
          EventBus.$on("activeComponent", function (activeComponent,methodCall) {
              self.activeComponent = activeComponent;
              self.methodCall = methodCall;
          });
    },
    data: function () {
        return {
            activeComponent: 'Start',
            methodCall : ''
        }
    }
}
</script>

<style>
    body {
        background:
linear-gradient(135deg, #6C7A89 22px, #404b56 22px, #404b56 24px, transparent 24px, transparent 67px, #404b56 67px, #404b56 69px, transparent 69px),
linear-gradient(225deg, #6C7A89 22px, #404b56 22px, #404b56 24px, transparent 24px, transparent 67px, #404b56 67px, #404b56 69px, transparent 69px)0 64px;
background-color:#6C7A89;
background-size: 64px 128px
    }
</style>