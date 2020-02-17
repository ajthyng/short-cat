import { Schema } from 'mongoose'

export const UrlSchema = new Schema({
  destination: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
}, { timestamps: true })
