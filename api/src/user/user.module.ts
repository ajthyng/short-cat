import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { MongoDBService } from '../db/mongodb.service'

@Module({
  imports: [MongooseModule.forFeatureAsync([{
    name: 'User',
    useFactory: () => {
      UserSchema.methods.toJSON = function () {
        const result = this.toObject()
        delete result._id
        delete result.createdAt
        delete result.updatedAt
        delete result.__v
        return result
      }
      return UserSchema
    }
  }])],
  controllers: [UserController],
  providers: [UserService, MongoDBService],
  exports: [UserService]
})

export class UserModule {}
