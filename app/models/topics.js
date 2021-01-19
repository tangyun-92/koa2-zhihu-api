/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-19 22:54:59
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: {type: String, required: true}, // 名称
  avatar_url: {type: String, required: false}, // 图片
  introduction: {type: String}, // 简介
})

module.exports = model('Topic', topicSchema)
