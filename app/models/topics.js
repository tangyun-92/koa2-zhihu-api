/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-22 11:17:40
 * 话题
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const topicSchema = new Schema(
  {
    __v: { type: Number, select: false },
    name: { type: String, required: true }, // 名称
    avatarUrl: { type: String, required: false }, // 图片
    introduction: { type: String }, // 简介
  },
  { timestamps: true }
)

module.exports = model('Topic', topicSchema)
