/**
 * ctx.body返回的参数
 * @param {String} message 提示信息
 * @param {Array || Object} data 数据
 * @param {Number} code code码
 * @param {Number} status 状态码
 */
function returnCtxBody(message, data, code = 1, status = 200) {
  return {
    message,
    data,
    code,
    status
  }
}

module.exports = {
  returnCtxBody
}