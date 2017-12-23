import Vue from 'vue'
import {EventBus} from '../event-bus.js';
import {RandomIntMixin} from '../mixins/randomInt.js';

const GamesStore = new Vue({ 
    methods: {
      readStorage(){
        let storage = localStorage.getItem( "game" );
        let storageData = JSON.parse(storage);

        if(!storageData){
            return false;
        }
        return storageData;
      },
      saveGame(){
        EventBus.$once("currentClock",function(clock){
        
            let storageData = this.readStorage();

            if(!storageData){
                storageData = {};
            }
            
            let saveObj = { 
                clock : clock, 
                userNumbersString : FieldsStore.getUserNumbersString(),
                activePuzzleId : FieldsStore.activePuzzleId
            };

            let index = Object.keys(storageData).length;
            storageData[index] = saveObj;
            localStorage.setItem( "game", JSON.stringify( storageData ) );
            
        });
    },
    loadGame(id){
        let storageData = this.readStorage();
        
        if(typeof storageData[id] === 'undefined'){
            return false;
        }
        
        FieldsStore.buildCompleteFieldsForBoard(storageData[id].activePuzzleId);
        FieldsStore.setUserNumbersFromString(storageData[id].userNumbersString);
        // insert clock in BoardClock
        // insert activePuzzle in fields
        // insert userNumberString
        
        return false;
    },
    loadAllGames(){
        let storageData = this.readStorage();
        return storageData;
    },
    deleteGame(id){
        
    },
    },
    data: {

    },
})
Object.defineProperties(Vue.prototype, {
  $GamesStore: {
    get: function () {
      return GamesStore
    }
  }
})
export {GamesStore}