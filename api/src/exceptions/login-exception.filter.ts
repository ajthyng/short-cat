import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Request, Response } from 'express'
import { LoginException } from './LoginException'
import { CasService } from 'src/cas/cas.service'

@Catch(LoginException)
export class LoginExceptionFilter implements ExceptionFilter {
  constructor (
    private readonly casService: CasService
  ) {}

  catch (_exception: LoginException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    response
      .redirect(this.casService.getLoginURL(request))
  }
}
