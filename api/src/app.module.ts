import { Module } from '@nestjs/common'
import { CasModule } from './cas/cas.module'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from './user/user.module'
import { getMongoURI } from './utils/db'
import { UrlModule } from './url/url.module'
@Module({
  imports: [
    CasModule,
    UserModule,
    UrlModule,
    MongooseModule.forRoot(getMongoURI(), {
      retryDelay: 1000,
      retryAttempts: Number.MAX_VALUE,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  ],
  controllers: [],
  providers: []
})

export class AppModule {}
