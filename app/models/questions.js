/*
 * @Author: 唐云
 * @Date: 2021-01-20 16:38:38
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 22:25:10
 * 问题
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const questionSchema = new Schema(
  {
    _v: { type: Number, select: false },
    title: { type: String, required: true }, // 问题内容
    description: { type: String, required: false }, // 问题描述
    questioner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true,
    }, // 提问的用户
    topics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
      select: false,
    }, // 话题
  },
  { timestamps: true }
)

module.exports = model('Question', questionSchema)
