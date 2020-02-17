import { InjectModel } from '@nestjs/mongoose'
import { User } from './user.interface'
import { Model } from 'mongoose'
import { CreateUserDto } from './user.dto'
import { Injectable } from '@nestjs/common'
import { MongoDBService } from '../db/mongodb.service'
import { MongoDBException } from 'src/exceptions/MongoDBException'

@Injectable()
export class UserService {
  constructor (
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly mongodbService: MongoDBService
  ) {}

  async create (createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto)
    return this.mongodbService.save(user)
  }

  async findOneById (id: string) {
    const user = await this.userModel.findOne({ userID: id })
    if (!user) throw new MongoDBException(`No user found with id ${id}`, 404)
    return user
  }
}
