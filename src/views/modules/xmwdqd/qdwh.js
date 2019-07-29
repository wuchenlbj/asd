import _ from 'lodash'

const _getUniq = (data) => {
  var arr = []
  _.forEach(data, function (n) {
    if (n.xh != 0)
      arr.push(n.xh)
  })
  const res = _.uniq(arr)
  return res
}
// 删除按钮
const removeHoverDom = (treeId, treeNode) => {
  $('#addBtn_' + treeNode.tId)
    .unbind()
    .remove()
}
const showRemoveBtn = function (treeId, treeNode) {
  return !(treeNode.id == '0')
}
// 重命名
const showRenameBtn = function (treeId, treeNode) {
  return true
}
export {
  _getUniq,
  removeHoverDom,
  showRemoveBtn,
  showRenameBtn
}
