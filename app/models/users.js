/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-21 17:46:52
 * 用户
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String }, // 头像url
  banner_url: { type: String }, // 个人中心banner url
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true,
  }, // 性别，enum表示可枚举
  headline: { type: String }, // 一句话介绍自己
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false,
  }, // 居住地，表示数组中数据是字符串
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false }, // 行业
  employments: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: 'Topic' },
        job: { type: Schema.Types.ObjectId, ref: 'Topic' },
      },
    ],
    select: false,
  }, // 职业经历，表示数组中是一个对象
  educations: {
    type: [
      {
        school: { type: Schema.Types.ObjectId, ref: 'Topic' },
        major: { type: Schema.Types.ObjectId, ref: 'Topic' },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] }, // 学历
        entrance_year: { type: Number }, // 入学年份
        graduation_year: { type: Number }, // 毕业年份
      },
    ],
    select: false,
  }, // 教育经历
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    select: false,
  }, // 关注列表
  topic: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
      },
    ],
    select: false,
  }, // 话题列表
  likingAnswers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Answer',
      },
    ],
    select: false,
  }, // 赞过的答案
  disLikingAnswers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Answer',
      },
    ],
    select: false,
  }, // 踩过的答案
})

module.exports = model('User', userSchema)
