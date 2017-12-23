import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start'
import Board from '@/components/Board'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    }, 
    {
      path: '/board/newgame/:activePuzzleId',
      name: 'newGame',
      component: Board
    }, 
    {
      path: '/board/loadgame/:loadGameId',
      name: 'loadGame',
      component: Board
    },       
  ]
})
