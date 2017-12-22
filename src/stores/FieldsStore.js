import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';
import {PuzzlesStore} from '../stores/PuzzlesStore.js'; 

export const FieldsStore = new Vue({
    created() {
        this.resetStore();
    },   
    methods: {
        resetStore(){
            this.generateEmptyFields();
            this.initPeerMatrix(); 
        },        
        buildCompleteFieldsForBoard(activePuzzleId){
            this.resetStore();
            this.activePuzzleId = activePuzzleId;
            this.activePuzzle = PuzzlesStore.getPuzzleById(this.activePuzzleId);
            this.assignGridToFields();
            this.assignSolutionToFields();
            this.setUnsolvedFieldsInGrid();
            
        },
        setUnsolvedFieldsInGrid(){
            for(let i = 0; i < this.activePuzzle['grid'].length; i++ ){
                if(parseInt(this.activePuzzle['grid'][i]) > 0 ){
                    this.unsolvedFieldsInGrid++;
                }
            }                
        },
        /**
        * Generate the model of each field. Value attributes are empty as the puzzle data is not available at this time
        */
        generateEmptyFields(){     
            for(let i=0;i<81;i++){
                var field = {};
                field.colIndex = this.calculateColIndexForField(i+1);
                field.rowIndex = this.calculateRowIndexForField(i+1);
                field.regionIndex = this.calculateRegionIndexForField(field.colIndex,field.rowIndex)
                field.value;
                field.isUserInput = true;
                field.id = i;
                field.validation = {};
                field.validation.timeout = 0;
                field.validation.hasError = "";
                field.validation.activeInput = "";
                field.userNumber;
                field.solution = 0;
    
                this.$set(this.fields, i, field);
            
            }
        }, 
        initPeerMatrix(){
            for(let i = 1; i < 10; i++){
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
        * Maps the values of starting grid to fields if they are numbers [1-9]
        */
        assignGridToFields(){
            for(let i = 0; i < this.fields.length; i++){
                let puzzleNumber = parseInt(this.activePuzzle['grid'][i]);
                this.setPeerMatrixValueForSingleField(i,puzzleNumber);
                if(puzzleNumber !== 0){
                    let tempField = this.fields[i];
                    tempField.value = puzzleNumber;
                    tempField.isUserInput = false;
                    this.$set(this.fields, i, tempField);
                }
            }
        },
        /**
        * Assign values to one field of peer Matrix
        * The peer matrix is used to "validate" the user input to give the user small hints if he is right or wrong
        */
        setPeerMatrixValueForSingleField(index,value){
            this.peerMatrix.regions[this.fields[index].regionIndex].push(value);
            this.peerMatrix.rows[this.fields[index].rowIndex].push(value);
            this.peerMatrix.cols[this.fields[index].colIndex].push(value); 
        },
        /**
        * Assigns the solution array to all fields
        */
        assignSolutionToFields(){
            var self = this;
            this.fields.forEach(function(field,index){
                field.solution = parseInt(self.activePuzzle['solution'][index]);
            })
        },        
    },
    data: {
        fields : [],
        activePuzzle : [],
        activePuzzleId : '',
        peerMatrix : {
          'rows' : [],
          'cols' : [],
          'regions' : []  
        },
        unsolvedFieldsInGrid : 0
    },
})