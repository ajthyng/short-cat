import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { AuthorizationService } from './authorization.service'
import { resolve } from 'path'
import { Enforcer, newEnforcer } from 'casbin'
import { newAdapter } from 'casbin-mongoose-adapter'
import { getMongoURI } from 'src/utils/db'

@Injectable()
export class ScopeGuard implements CanActivate {
  private enforcer: Enforcer
  private adapter: any
  private readonly config = resolve(__dirname, 'policy.conf')

  constructor (
    private readonly reflector: Reflector,
    private readonly authService: AuthorizationService
  ) {}

  validateRequest (req: Request) {

  }

  async canActivate (
    context: ExecutionContext
  ): Promise<boolean> {
    if (!this.enforcer) {
      this.adapter = await newAdapter(getMongoURI())
      this.enforcer = await newEnforcer(this.config, this.adapter)
    }

    return true
  }
}
