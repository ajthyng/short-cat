import { Schema } from 'mongoose'

export const UserSchema = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  roles: {
    type: [String],
    default: []
  }
}, { timestamps: true })
