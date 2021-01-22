/*
 * @Author: 唐云
 * @Date: 2021-01-19 22:31:15
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-22 10:34:42
 */
/**
 * ctx.body返回的参数
 * @param {String} message 提示信息
 * @param {Array || Object} data 数据
 * @param {Number} code code码
 * @param {Number} status 状态码
 */
function returnCtxBody(message, data, total, code = 1, status = 200) {
  return {
    code,
    status,
    message,
    total,
    data,
  }
}

module.exports = {
  returnCtxBody,
}
