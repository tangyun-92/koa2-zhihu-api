/*
 * @Author: 唐云 
 * @Date: 2021-01-16 23:26:23 
 * @Last Modified by:   唐云 
 * @Last Modified time: 2021-01-16 23:26:23 
 */
const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
})

module.exports = model('User', userSchema)
