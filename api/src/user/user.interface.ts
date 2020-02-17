import { Document } from 'mongoose'

export interface User extends Document {
  userID: string
  roles: string[]
}
