
const SET_CUR_ROUTE = 'SET_CUR_ROUTE';

const router = {
  state: {
    //头部当前路由，匹配高亮所用
    headerCurRouter: '',
    //左侧当前路由，匹配高亮所用
    leftCurRouter: ''
  },

  mutations: {
    SET_CUR_ROUTE(state, paths) {
      // console.log(paths);
      state.headerCurRouter = paths.rootPath;
      state.leftCurRouter = paths.fullPath;
    }
  },
  actions: {
    set_cur_route: ({
      commit
      }, paths) => {
      commit('SET_CUR_ROUTE', paths);
    }
  }
}

export default router
