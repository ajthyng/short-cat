import { HttpException, HttpStatus } from '@nestjs/common'

export class LoginException extends HttpException {
  constructor () {
    super('Login Required', HttpStatus.FORBIDDEN)
  }
}
