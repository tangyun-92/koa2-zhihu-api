/*
 * @Author: 唐云
 * @Date: 2021-01-16 23:26:23
 * @Last Modified by: 唐云
 * @Last Modified time: 2021-01-17 00:41:58
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
})

module.exports = model('User', userSchema)
