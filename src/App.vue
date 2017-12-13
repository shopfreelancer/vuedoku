<template>
  <div id="app">
    <component :is="activeComponent"></component>
  </div>
</template>

<script>
import Start from '@/components/Start'
import Board from '@/components/Board'
    
export default {
    name: 'app',
    components : {Start, Board},
    created: function() {
          var self = this;
         /**
          * Props go to down to children, events go up to parent
          */
          self.$on("activeComponent", function (activeComponent) {
              self.activeComponent = activeComponent;
          });
    },
    data: function () {
        return {
            activeComponent: "Board"
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