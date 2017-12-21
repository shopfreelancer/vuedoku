<template>
    <div id="editorWrap">
        <div id="editorButtonsWrap">
            <button type="button" class="btn btn-outline-primary">Edit</button>
            <button type="button" class="btn btn-outline-secondary">Note</button>
        </div>
        <div id="numberSelectorWrap">
            <button class="btn btn-secondary" v-for="number in numbersSelectorPanel">{{number}}</button>
        </div>
    </div>
</template>

<script>

export default {
  name: 'BoardNumberSelector',
  created(){
      this.initNumbersSelectorPanel();
    },
  methods: {
     initNumbersSelectorPanel(){
        for(let i = 1;i<10;i++){
            this.numbersSelectorPanel.push(i);
        }
    },
  },
  data () {
    return {
      numbersSelectorPanel : [],
    }
  }
}
</script>


<style>
    
    #numberSelectorWrap {
        margin-bottom:20px;
    }
    
    #editorButtonsWrap {margin-bottom:10px;}

</style>