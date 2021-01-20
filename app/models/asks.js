/*
 * @Author: 唐云
 * @Date: 2021-01-20 16:38:38
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 17:13:38
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const askSchema = new Schema({
  _v: { type: Number, select: false },
  userId: {type: String, required: true}, // 创建者id
  content: { type: String, required: true }, // 问答内容
  focusList: {
    type: [{ type: String }],
  }, // 关注人列表
  answerList: {
    type: [
      {
        userId: { type: String }, // 用户id
        answerCon: { type: String }, // 内容
        answerTime: {type: Date}, // 回答时间
      },
    ],
  }, // 回答列表
})

module.exports = model('Ask', askSchema)
