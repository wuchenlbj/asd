import {
  GetAllXM
} from '@/api/common/xm'
const xm = {
  state: {
    xmxx: [], // 项目信息对象
    xmxxRow: null, // 当前选中的行数据
    xmxxSelectRow: null,
    listQuery: {
      XMTYPE: '', // 0 新立 1 接转
      MODULEID: '',
      KTBH: '',
      KTMC: '',
      JHND: '', // 年度
      XMPCDM: '', // 批次
      XMFLDM: '', // 项目类型
      FZDWDM: '', // 负责的单位代码
      XMJBDM: '' // 项目级别
    }
  },

  mutations: {
    SET_XMXX: (state, data) => {
      state.xmxx = data
    },
    SET_CUR_XMROW: (state, data) => {
      state.xmxxRow = data
    },
    SET_Select_XMROW: (state, data) => {
      state.xmxxSelectRow = data
    },
    SET_CUR_Query: (state, data) => {
      state.listQuery = data
    }
  },
  actions: {
    // 获取项目信息
    GetXMInfo: ({
      commit
    }, listQuery) => {
      return new Promise((resolve, reject) => {
        GetAllXM(listQuery).then(response => {
          const data = response.data
          if (data) {
            commit('SET_XMXX', data)
            resolve()
          } else {
            reject(data.error)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前上传文档的情况，更新文档清单统计情况
    // 数量不对
    SetXmDocSign: ({ commit }, rowObj) => {
      rowObj.rows.forEach(item => {
        let crntQdNum = item[rowObj.qdmc] === '' ? 0 : parseInt(item[rowObj.qdmc])
        item[rowObj.qdmc] = crntQdNum + (rowObj.docids ? rowObj.docids.length : 0)
      });
    },
    // 存储表格选中行数
    set_cur_xmrow: ({
      commit
    }, row) => {
      commit('SET_CUR_XMROW', row)
    },
    set_cur_listQuery: ({
      commit
    }, listQuery) => {
      commit('SET_CUR_Query', listQuery)
    },
    // 存储表格check的行
    set_select_xmrow: ({
      commit
    }, rows) => {
      commit('SET_Select_XMROW', rows)
    }
  }
}

export default xm
