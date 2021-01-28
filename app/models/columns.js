/*
 * @Author: 唐云
 * @Date: 2021-01-28 16:07:28
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 17:02:52
 * 专栏
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const columnSchema = new Schema(
  {
    _v: { type: Number, select: false },
    title: { type: String, required: true }, // 专栏标题
    description: { type: String, required: false }, // 专栏描述
    avatar: { type: String, required: false }, // 专栏图片
    columnUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true,
    }, // 专栏所属用户
    articles: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
      select: false,
    }, // 专栏下的文章
  },
  {
    timestamps: true,
  }
)

module.exports = model('Column', columnSchema)
