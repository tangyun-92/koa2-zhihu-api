/*
 * @Author: 唐云
 * @Date: 2021-01-21 16:27:14
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 19:12:24
 * 评论
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const commentSchema = new Schema({
  _v: { type: Number, select: false },
  content: { type: String, required: true }, // 评论内容
  commentator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: true,
  }, // 评论人
  questionId: { type: String, required: true }, // 问题id
  answerId: { type: String, required: true }, // 答案id
})

module.exports = model('Comment', commentSchema)
