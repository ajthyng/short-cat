import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Url } from './url.interface'
import { Injectable, Scope, Inject } from '@nestjs/common'
import { MongoDBService } from '../db/mongodb.service'
import { MongoDBException } from 'src/exceptions/MongoDBException'
import { CreateUrlDto } from './url.dto'
import shortid from 'shortid'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { AuthnService } from 'src/authentication/authentication.service'

@Injectable()
@Injectable({ scope: Scope.REQUEST })
export class UrlService {
  constructor (
    @InjectModel('Url') private readonly urlModel: Model<Url>,
    @Inject(REQUEST) private readonly request: Request,
    private readonly authService: AuthnService,
    private readonly mongodbService: MongoDBService
  ) {}

  async create (createUrlDto: CreateUrlDto) {
    const shortPath = shortid.generate()
    const owner = await this.authService.getUserFromToken(this.request)
    const url = new this.urlModel({
      ...createUrlDto,
      short: shortPath,
      owner: owner.originalSub ?? owner.sub
    })
    return this.mongodbService.save(url)
  }

  async findDestination (id: string) {
    const { destination } = await this.urlModel.findOne({ short: id })
    return destination
  }

  async findByOwner (owner: string) {
    const urls = await this.urlModel.find({ owner })
    if ((Array.isArray(urls) && urls.length === 0) || !urls) {
      throw new MongoDBException(`No URLs found for ${owner}.`, 404)
    }
    return urls
  }
}
