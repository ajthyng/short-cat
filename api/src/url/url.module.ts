import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MongoDBService } from '../db/mongodb.service'
import { UrlSchema } from './url.schema'
import { UrlService } from './url.service'
import { UrlController } from './url.controller'
import { AuthnService } from 'src/authentication/authentication.service'

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Url', schema: UrlSchema }
  ])],
  controllers: [UrlController],
  providers: [UrlService, MongoDBService, AuthnService],
  exports: [UrlService]
})

export class UrlModule {}
