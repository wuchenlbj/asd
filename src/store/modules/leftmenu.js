
//展开菜单
export const SET_MENU_OPEN = 'SET_MENU_OPEN';
//关闭菜单
export const SET_MENU_CLOSE = 'SET_MENU_CLOSE';

const leftmenu = {
  state: {
    //左侧菜单宽度
    width: '200px',
    menu_flag: true,
  },

  mutations: {
    //变量这是用方括号
    [SET_MENU_OPEN](state) {
      state.width = '200px';
      state.menu_flag = true;
    },
    [SET_MENU_CLOSE](state) {
      state.width = '50px';
      state.menu_flag = false;
    }
  },
  actions: {
    set_menu_open: ({
      commit
    }) => {
      commit(SET_MENU_OPEN);
    },
    set_menu_close: ({
      commit
    }) => {
      commit(SET_MENU_CLOSE);
    }
  }
}

export default leftmenu
