/*
 * @Author: 唐云
 * @Date: 2021-01-20 16:38:38
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-28 16:43:29
 * 文章
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const articleSchema = new Schema(
  {
    _v: { type: Number, select: false },
    title: { type: String, required: true }, // 文章标题
    content: { type: String, required: false }, // 文章内容
    image: { type: String, required: false }, // 文章图片
    articleUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: true,
    }, // 文章所属用户
    column: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Column' }],
      select: false,
    }, // 文章所属专栏
  },
  { timestamps: true }
)

module.exports = model('Article', articleSchema)
