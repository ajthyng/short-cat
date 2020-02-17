import { Module } from '@nestjs/common'
import { CasController } from './cas.controller'
import { CasService } from './cas.service'
import { AuthnService } from '../authentication/authentication.service'

@Module({
  controllers: [CasController],
  providers: [CasService, AuthnService]
})

export class CasModule {}
