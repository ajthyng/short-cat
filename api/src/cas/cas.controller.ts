import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { CasService } from './cas.service'
import { AuthnService } from '../authentication/authentication.service'
import { Public } from 'src/decorators/public.decorator'

@Controller('cas')
export class CasController {
  constructor (
    private readonly casService: CasService,
    private readonly authnService: AuthnService
  ) {}

  @Get('/login')
  @Public()
  async login (@Req() req: Request, @Res() res: Response) {
    try {
      const isAuthenticated = await this.authnService.validateUser(req)
      if (isAuthenticated) {
        return res.redirect('/')
      }

      const ticket = this.casService.getTicket(req)
      if (!ticket) {
        return res.redirect(this.casService.getLoginURL(req))
      }

      const token = await this.casService.validateTicket(req)
      return this.authnService.setCookie({ res, token }).redirect('/')
    } catch (err) {
      console.log('Login Error: ', err)
      return this.authnService.clearCookie({ res }).send({ error: err.message })
    }
  }
}
