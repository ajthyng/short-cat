import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { AuthnService } from './authentication.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector,
    private readonly authService: AuthnService
  ) {}

  validateRequest (req: Request) {
    return this.authService.isLoggedIn(req)
  }

  canActivate (
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }
}
