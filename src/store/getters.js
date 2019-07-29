const getters = {
  sidebar: state => state.global.sidebar,
  sidetopbar: state => state.global.sidetopbar,
  permission_routers: state => state.global.routers,
  addRouters: state => state.global.addRouters,
  moduleid: state => state.global.moduleid,
  permission_data: state => state.global.routerdata,
  rightHeight: state => state.global.rightHeight,
  panelHeight: state => state.global.panelHeight,
  helpContent: state => state.global.helpContent,

  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  login: state => state.user.login,
  user: state => state.user.user,

  listquery: state => state.xm.listQuery,
  xmxx: state => state.xm.xmxx,
  xmxxRow: state => state.xm.xmxxRow,
  xmxxSelectRow: state => state.xm.xmxxSelectRow
}
export default getters
