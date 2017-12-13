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
        
        self.fields.forEach(function(field){
            self.assignValues(field.id,field.solution)
        })
        
        self.fields.forEach(function(field){
            self.eliminateUnitValues(field.id,field.solution)
        })

    
    },
    // @todo: can I work with the global fields object or do I need the fiels as params? no idea.
    assignValues(fieldId,solution){
        var self = this;
        
        // other_values = values[s].replace(d, '')      
        var foundValueIndex = self.fields[fieldId].allowedValues.indexOf(solution);
    
        // all inital fields are down to one solution already. don´t splice them again
        if(foundValueIndex > -1 && self.fields[fieldId].allowedValues.length > 1){
            self.fields[fieldId].allowedValues.splice(foundValueIndex,1);
            
        }
        
        self.eliminate(fieldId,solution);  
        self.fields[fieldId].allowedValues.forEach(function(allowedValue){
            //self.eliminate(fieldId,allowedValue);                       
        })
        
        return true;
    },
    eliminate(fieldId,solution){
        var self = this;
        
        var foundValueIndex = self.fields[fieldId].allowedValues.indexOf(solution);
 
        // all inital fields are down to one solution already. don´t splice them again
        
        // if d not in values[s]:
        // return values
        if(foundValueIndex === - 1){
            return;
        }
        
        // values[s] = values[s].replace(d,'')
        if(foundValueIndex > 0){
            self.fields[fieldId].allowedValues.splice(foundValueIndex,1);
            
                //console.log("solution: "+solution+ " fieldId: "+fieldId+ " allowed "+self.fields[fieldId].allowedValues+ " found "+foundValueIndex);
        }
  
        // step 1: delete solution from peers
        
        //  elif len(values[s]) == 1:
        //  d2 = values[s]
        // if not all(eliminate(values, s2, d2) for s2 in peers[s]):
        if(self.fields[fieldId].allowedValues.length === 1){
            //console.log(self.fields[fieldId].allowedValues);
            self.fields[fieldId].solution = self.fields[fieldId].allowedValues[0];
             
            self.fields.forEach(function(peerField){
                if(fieldId === peerField.id) return true;
                
                // these are the peer fields
                if(self.fields[fieldId].rowIndex === peerField.rowIndex || self.fields[fieldId].colIndex === peerField.colIndex || self.fields[fieldId].regionIndex === peerField.regionIndex){
                    var foundValueIndex = peerField.allowedValues.indexOf(self.fields[fieldId].allowedValues[0]);
                    
                    
                    if(foundValueIndex > -1){
                        peerField.allowedValues.splice(foundValueIndex,1);
                    }
                }
                });  
        }
        
        // step 2: remove numbers from units
       // fetch units for field. 3 units with 9 fields
        // @todo gibt es keine bessere Lösung als immer neue arrays aufzumachen? das nervt hart

        
        return true;
    },
    eliminateUnitValues(fieldId,solution){
        
        var self = this;
        
        var units = [];
        units[0] = [];
        units[1] = [];
        units[2] = [];
        
        self.fields.forEach(function(unitField){
             if(self.fields[fieldId].rowIndex === unitField.rowIndex){
                units[0].push(unitField);
             }
            
            if(self.fields[fieldId].colIndex === unitField.colIndex){
                units[1].push(unitField);
             }
            
            if(self.fields[fieldId].regionIndex === unitField.regionIndex){
                units[2].push(unitField);
             }
        });
  

        // testen, ob Wert in Unit genau einmal gefunden wird.
        // macht das logisch Sinn? das ist doch eine doppelung von dem, was ich weiter oben schon prüfe.
        // also ob ein Feld nur einen Wert hat.
    
        units.forEach(function(unit){

            var foundFieldIds = [];

            unit.forEach(function(unitField){
            
                if(unitField.allowedValues.includes(solution)){
                    // @todo es wäre schön hier direkt auf das feld zugreifen zu können. naja.
                    foundFieldIds.push(unitField.id);

                }
            });
            // only one logical solution per unit
            //console.log(foundFieldIds);
         
            if(foundFieldIds.length === 1){
                let updateId = foundFieldIds[0];
                self.assignValues(updateId,solution);
                
            }

        })
        
        return true;
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
            field.solution = field.allowedValues[0];
            this.successCounter++;
            //return true;
        }
        
        
        // fetch units for field. 3 units with 9 fields
        // @todo gibt es keine bessere Lösung als immer neue arrays aufzumachen? das nervt hart
        var units = [];
        units[0] = [];
        units[1] = [];
        units[2] = [];
        
        self.fields.forEach(function(peerField){
             if(field.rowIndex === peerField.rowIndex){
                units[0].push(peerField);
             }
            
            if(field.colIndex === peerField.colIndex){
                units[1].push(peerField);
             }
            
            if(field.regionIndex === peerField.regionIndex){
                units[2].push(peerField);
             }
        });
  

        // testen, ob Wert in Unit genau einmal gefunden wird.
        // macht das logisch Sinn? das ist doch eine doppelung von dem, was ich weiter oben schon prüfe.
        // also ob ein Feld nur einen Wert hat.
    
        units.forEach(function(unit){

  
            var foundFieldIds = [];

            unit.forEach(function(unitField){
            
                if(unitField.allowedValues.includes(field.solution)){
                    // @todo es wäre schön hier direkt auf das feld zugreifen zu können. naja.
                    foundFieldIds.push(unitField.id);

                }
            });
            // only one logical solution per unit
            //console.log(foundFieldIds);
         
            if(foundFieldIds.length === 1){
                let updateId = foundFieldIds[0];
                self.fields[updateId].allowedValues = [];
                self.fields[updateId].allowedValues.push(field.solution);
                self.fields[updateId].solution = field.solution;
            }
          

        })
       
   
        
        
        
        
        /*
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
        */
        
                
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
      boardIsSolved : false,
    }
  }
})