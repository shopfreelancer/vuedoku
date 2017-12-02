import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';

export const FieldsStore = new Vue({
    data: {
        fields : []
    },
    created() {
        this.generateFields();
    },   
    methods: {       
        generateFields(){     
            for(let i=1;i<=(9*9);i++){
                var field = {};
                field.colIndex = this.calculateColIndexForField(i);
                field.rowIndex = this.calculateRowIndexForField(i);
                field.regionIndex = this.calculateRegionIndexForField(field.colIndex,field.rowIndex)
                field.value = 0;
                field.id = i-1;
                field.timeout = 0;
                field.userNumber = "";

                this.fields.push(field);
            }
        },    
        calculateColIndexForField(i){
            let colIndex;    

            if(i%9 === 0){
                colIndex = 9;
            } else {
                colIndex = i - (Math.floor(i/9)*9)
            }

            return colIndex;
        },
        calculateRowIndexForField(i){
            let rowIndex;    

            if(i%9 === 0){
                rowIndex = i / 9;
            } else {
                rowIndex = Math.floor(i/9) +1;
            }

            return rowIndex;
        },
        calculateRegionIndexForField(colIndex,rowIndex){   

            const increaseNumber = 3;
            var rowIndexMin = 0;
            var rowIndexMax = 3

            var colIndexMin = 0;
            var colIndexMax = 3;

            for(var regionIndex = 1; regionIndex < 10; regionIndex++){

                if ((colIndex > colIndexMin && colIndex <= colIndexMax) && (rowIndex > rowIndexMin && rowIndex <= rowIndexMax)){
                    return regionIndex;
                }

                // increase every third step
                if(regionIndex%3 == 0){
                    rowIndexMin = rowIndexMin + increaseNumber;
                    rowIndexMax = rowIndexMax + increaseNumber;
                }

                // increase every step 1-9, then reset
                if(regionIndex%3 == 0){
                    colIndexMin = 0;
                    colIndexMax = 3;
                } else {
                    colIndexMin = colIndexMin + increaseNumber;
                    colIndexMax = colIndexMax + increaseNumber;
                }

            }

            return regionIndex;
        }
    }
})