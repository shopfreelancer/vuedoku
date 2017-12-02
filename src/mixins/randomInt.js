import Vue from 'vue';

export const RandomIntMixin = Vue.mixin({
  methods: {
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },    
  }
})
