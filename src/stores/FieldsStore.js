import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';

export const FieldsStore = new Vue({
    data: {
        fields : [],
        activePuzzle : [],
        activePuzzleId : "",
        peerMatrix : {
          'rows' : [],
          'cols' : [],
          'regions' : []  
        }        
    },
    created() {
        this.generateEmptyFields();
        this.initPeerMatrix();
    },   
    methods: {
        buildCompleteFieldsForBoard(activePuzzle){
            this.activePuzzle = activePuzzle;
            this.assignPuzzleValuesToFields();
        },
        /**
        * Generate the model of each field. Value attributes are empty as the puzzle data is not available at this time
        */
        generateEmptyFields(){     
            for(let i=1;i<=(9*9);i++){
                var field = {};
                field.colIndex = this.calculateColIndexForField(i);
                field.rowIndex = this.calculateRowIndexForField(i);
                field.regionIndex = this.calculateRegionIndexForField(field.colIndex,field.rowIndex)
                field.value = "";
                field.isEmptyField = true;
                field.id = i-1;
                field.validation = {};
                field.validation.timeout = 0;
                field.validation.hasError = "";
                field.validation.activeInput = "";
                field.userNumber = "";
                field.allowedValues = [];
                field.solution = 0;
                for(let j=1;j<=(9);j++){
                    field.allowedValues.push(j);
                }
    
                this.fields.push(field);
            }
        }, 
        initPeerMatrix(){
            for(let i = 1;i < 10;i++){
                this.peerMatrix.rows[i] = [];
                this.peerMatrix.cols[i] = [];
                this.peerMatrix.regions[i] = [];
            }
        },        
        /**
        * Index [1-9] for each col ltr
        */
        calculateColIndexForField(i){
            let colIndex;    

            if(i%9 === 0){
                colIndex = 9;
            } else {
                colIndex = i - (Math.floor(i/9)*9)
            }

            return colIndex;
        },
        /**
        * Index [1-9] for each row top to bottom
        */        
        calculateRowIndexForField(i){
            let rowIndex;    

            if(i%9 === 0){
                rowIndex = i / 9;
            } else {
                rowIndex = Math.floor(i/9) +1;
            }

            return rowIndex;
        },
        /**
        * Index [1-9] for each region or sector of bord of 3x3 fields
        */           
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
        },
        /**
        * Maps the values of the puzzles to the empty fields and creates the peer Matrix for each field
        */
        assignPuzzleValuesToFields(){

            for(let index = 0; index < this.fields.length; index++){
                let puzzleNumber = parseInt(this.activePuzzle[index]);

                /**
                * Save value in Matrix with the peer siblings of current field
                */
                this.peerMatrix.regions[this.fields[index].regionIndex].push(puzzleNumber);
                this.peerMatrix.rows[this.fields[index].rowIndex].push(puzzleNumber);
                this.peerMatrix.cols[this.fields[index].colIndex].push(puzzleNumber);

                if(puzzleNumber !== 0){
                    this.fields[index].value = puzzleNumber;
                    this.fields[index].isEmptyField = false;
                }
            }
        },  

    }
})