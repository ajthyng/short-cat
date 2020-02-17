import { Injectable, HttpStatus } from '@nestjs/common'
import { Document } from 'mongoose'
import { MongoDBException } from '../exceptions/MongoDBException'

@Injectable()
export class MongoDBService {
  async save<T extends Document> (document: T) {
    try {
      await document.save()
      return document
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new MongoDBException(err.message, HttpStatus.BAD_REQUEST)
      } else if (err.name === 'MongoError' && err.message.includes('E11000')) {
        throw new MongoDBException(err.message, HttpStatus.BAD_REQUEST)
      } else {
        throw new MongoDBException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
