/*
 * @Author: 唐云
 * @Date: 2021-01-21 16:27:14
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 17:48:03
 * 答案
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const answerSchema = new Schema({
  _v: { type: Number, select: false },
  content: { type: String, required: true }, // 答案内容
  answerer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: true,
  }, // 答案的用户
  questionId: { type: String, required: true }, // 答案所属于的问题
  voteCount: { type: Number, required: true, default: 0 }, // 投票数
})

module.exports = model('Answer', answerSchema)
