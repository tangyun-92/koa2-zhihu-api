/*
 * @Author: 唐云
 * @Date: 2021-01-19 22:31:15
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-19 23:12:14
 */
/**
 * ctx.body返回的参数
 * @param {String} message 提示信息
 * @param {Array || Object} data 数据
 * @param {Number} code code码
 * @param {Number} status 状态码
 */
function returnCtxBody(message, data, code = 1, status = 200, total = 0) {
  return {
    message,
    data,
    code,
    status,
    total,
  }
}

module.exports = {
  returnCtxBody,
}
