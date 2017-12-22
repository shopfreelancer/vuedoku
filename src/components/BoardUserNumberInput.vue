<template>
    <input v-show="field.isUserInput" v-model="field.userNumber" type="number" maxlength="1" min="1" max="9" step="1" v-bind:timeout="field.validation.timeout" @input="validateField(field,$event)" class="puzzle-field-empty">
</template>

<script>

export default {
  name: 'BoardUserNumberInput',
  methods: {
    numberExistInRow(field,number){
        if(this.peerMatrix.rows[field.rowIndex].includes(number)){
            return true;
        }
        return false;
    },
    numberExistInCol(field,number){
        if(this.peerMatrix.cols[field.colIndex].includes(number)){
            return true;
        }
        return false;
    },
    numberExistInRegion(field,number){
        if(this.peerMatrix.regions[field.regionIndex].includes(number)){
            return true;
        }
        return false;
    },       
    validateField(field,event){
        var self = this;
        
        field.validation.activeInput = true;
        
        field.validation.timeout = setTimeout(function () {
                    
            let userInput = parseInt(event.target.value);
            
            if(self.numberExistInRow(field,userInput) || self.numberExistInCol(field,userInput) || self.numberExistInRegion(field,userInput)){
                field.validation.hasError = true;
            } else {
                field.validation.hasError = false;
            }
        
            if(field.validation.timeout !== "undefined"){
                clearTimeout(field.validation.timeout);
            }
            }, 1000);
            
            this.$parent.$emit('udpateFieldsTillVictory');
        return;
    },
  },
  props : ['peerMatrix','field'],
}
</script>

<style>

</style>