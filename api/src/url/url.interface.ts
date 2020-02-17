import { Document } from 'mongoose'

export interface Url extends Document {
  destination: string
  owner: string
  short: string
}
