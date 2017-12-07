import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';
import {FieldsStore} from '../stores/FieldsStore.js'

export const GuessingSolution = new Vue({
  name: 'GuessingSolution',
  methods: {
    /**
    * @todo: the PeerMatrix is good for field validation but not for guessing the solution
    * Database requests and Models would be useful here. Field hasMany Peers
    */
    theGuessingGame(){
        
        var self = this;
        
        this.countFieldsToBeGuessed();
        
        for(var i = 0; i < 6; i++){
            for(let j = 0; j < self.fields.length; j++){
                self.guessFieldSolution(self.fields[j])
            }
        }
        
        if (self.successCounter == self.fieldsToBeGuessed ) {
            self.boardIsSolved = true;
        }


        /**
        var loopRun = true;
   
        do {
            
            for(let j = 0; j < self.fields.length; j++){
                if (self.successCounter == self.fieldsToBeGuessed ) {
                    loopRun = false;
                    break;
                } else {
                    if(self.guessFieldSolution(self.fields[j]) === false){
                        loopRun = false;
                    }
                }
            }
            if (self.successCounter == self.fieldsToBeGuessed ) {
                    loopRun = false;
            }

        } while(loopRun === true)
        */
    
    },
    /**
    * The non-empty fields have already a solution / value.
    * These are the ones we need a number for
    */
    countFieldsToBeGuessed(){
        this.fields.forEach(function(field) {
            if(field.isEmptyField){
                self.fieldsToBeGuessed++;
            }
        });
    },
    /**
    * Guess solution for one field
    *
    * @param field
    */  
    guessFieldSolution(field){
        
        var self = this;

        // only for the fields without values from the original puzzle
        if(!field.isEmptyField || field.solution !== 0){
           // return true;
        }
        

        // if only one number exist we got a solution. delete number from all peers
        if(field.allowedValues.length === 1){
               
                //field.solution = parseInt(field.allowedValues[0]);
            
                self.fields.forEach(function(peerField){
                if(field.id === peerField.id) return true;
                 
                // these are the peer fields
                if(field.rowIndex === peerField.rowIndex || field.colIndex === peerField.colIndex || field.regionIndex === peerField.regionIndex){
                    var foundValueIndex = peerField.allowedValues.indexOf(field.allowedValues[0]);
                    if(foundValueIndex > -1){
                        peerField.allowedValues.splice(foundValueIndex,1);
                    }
                }
                });  
            
        }
        
        //self.eliminatePeersSolutionsFromField(field);
        
        
        // if there is only one number left the field is solved and has a solution 
        if(field.allowedValues.length === 1){
            field.solution = parseInt(field.allowedValues[0]);
            this.successCounter++;
            return true;
        }
        
    
        // allowedValues... if number occurs only once per unit - it is the solution
        field.allowedValues.forEach(function(allowedValue){
            
            var foundAllowedValueInPeers = false;
            // die nummer kommt in keinem anderen peer mehr vor
            self.fields.every(function(peerField){
                if(field.id === peerField.id) return true;
                 
                // peer fields
                if(
                    field.rowIndex === peerField.rowIndex 
                   || field.colIndex === peerField.colIndex 
                   || field.regionIndex === peerField.regionIndex
                  ){
                    if(peerField.allowedValues.includes(allowedValue)){
                        foundAllowedValueInPeers = true;
                        return false
                    }
                }
                return true;
             });

           
            // the allowed value of field is solo, it doesn´t occur in its peers. Solution found.
            // delete all other allowedValues from field
            
            if(foundAllowedValueInPeers === false){
                field.solution = allowedValue;
                field.allowedValues = [];
                field.allowedValues.push(allowedValue);
                return false;
            }
           
                 
            return true;
        });    
        
        
                
        return true;
            

    },
    /**
    * Get solutions from peers. Solutions consists of the values of isEmptyFields
    * and of the values of
    *
    * @param field
    */
    eliminatePeersSolutionsFromField(field){
        
        var excludeNumbersUnique = new Set();
        
        this.fields.forEach(function(peerField){
            // exclude the field itself from the Peer Set
            if(field.id === peerField.id){
                return;
            }
            
            // if field is a peer
            if(field.rowIndex === peerField.rowIndex || field.colIndex === peerField.colIndex || field.regionIndex === peerField.regionIndex){
                if(!peerField.isEmptyField){
                    excludeNumbersUnique.add(peerField.value);
                } else if(peerField.solution !== 0){
                    excludeNumbersUnique.add(peerField.solution);
                }
            }
        })

        // exludeNumbers already exist in a peer so they are invalid. remove them from our solution array
        this.removeNumbersFromAllowedValuesOfField(excludeNumbersUnique,field);
        
    },      
    /**
    * The solution number has to be excluded from the allowedNumbers of all its peers 
    * Loop through all fields. if row, col or region peer then delete solution from their allowed numbers.
    *
    * @param field    
    */
    eliminateSolutionFromPeers(field){
        
        var excludeNumbersSet = new Set()
        excludeNumbersSet.add(field.solution);
        
        this.removeNumbersFromPeers(field,excludeNumbersSet); 
        
    },
    /**
    * Loop through all fields and find peer fields that have values.
    * Exclude the original field itself fields with pre-defined values aka non-empty fields
    */
    removeNumbersFromPeers(excludeNumbersSet,field){
        
        this.fields.forEach(function(peerField){
            if(field.id === peerField.id || !peerField.isEmptyField){
                return;
            }
            
            if(field.rowIndex === peerField.rowIndex || field.colIndex === peerField.colIndex || field.regionIndex === peerField.regionIndex){
                self.removeNumbersFromAllowedNumbersOfField(excludeNumbersSet,peerField);
            }
        })
    },
    /**
    * Removes a set of numbers from allowed numbers array
    */
    removeNumbersFromAllowedValuesOfField(excludeNumbersSet,field){

        for (let j = field.allowedValues.length - 1; j >= 0; --j) {
            if (excludeNumbersSet.has(field.allowedValues[j])) {
                field.allowedValues.splice(j, 1); 
            }
        }
        return field;
    }      
  },
  data () {
    return {
      fields : FieldsStore.fields,
      successCounter : 0,
      fieldsToBeGuessed : 0,
      boardIsSolved : false,
    }
  }
})