/*
 * @Author: 唐云
 * @Date: 2021-01-20 16:38:38
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-20 22:53:03
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema({
  _v: { type: Number, select: false },
  questioner: { type: String, required: true }, // 创建者id
  title: { type: String, required: true }, // 问答内容
  description: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false,
  },
})

module.exports = model('Ask', questionSchema)
