import { Injectable, ForbiddenException, HttpException } from '@nestjs/common'
import { readFileSync } from 'fs'
import { Algorithm, verify, sign } from 'jsonwebtoken'
import { JWTPayload } from './jwt.dto'
import { Request } from 'express'
import { isEmpty } from 'lodash'
import { SetCookieDto, ClearCookieDto } from 'src/cas/cookie.dto'
import { LoginException } from 'src/exceptions/LoginException'

interface JWTContents {
  sub: string
  originalSub?: string
  app: string
  iat: number
  exp: number
}

@Injectable()
export class AuthnService {
  private readonly privateKey = readFileSync('/usr/app/jwt/private.pem')
  private readonly publicKey = readFileSync('/usr/app/jwt/public.pem')
  private readonly appName = 'short-cat'
  private readonly algorithm: Algorithm = 'RS256'
  private readonly expiration = '30d'
  private readonly _cookieName = '_token'

  private _verify (token: string): JWTContents {
    return verify(token, this.publicKey, { algorithms: [this.algorithm] }) as JWTContents
  }

  private _sign (payload: JWTPayload) {
    return sign(payload, this.privateKey, { algorithm: this.algorithm, expiresIn: this.expiration })
  }

  private _throwGenericError () {
    throw new HttpException('There was a problem checking authorization.', 500)
  }

  public async getUserFromToken (req: Request) {
    const token = req.cookies[this._cookieName]
    if (!token) this._throwGenericError()

    try {
      const contents = this._verify(token)
      if (contents.app === this.appName && !isEmpty(contents.sub)) return contents
    } catch (err) {
      this._throwGenericError()
    }

    this._throwGenericError()
  }

  public async validateUser (req: Request) {
    const token = req.cookies[this._cookieName]
    if (!token) return false

    try {
      const contents = this._verify(token)
      if (contents.app === this.appName && !isEmpty(contents.sub)) return true
    } catch (err) {
      throw new LoginException()
    }
  }

  public async isLoggedIn (req: Request) {
    const isValid = await this.validateUser(req)
    if (!isValid) {
      throw new LoginException()
    }
    return isValid
  }

  public async createToken (sub: string) {
    return this._sign({ sub, app: this.appName })
  }

  public setCookie ({ res, token, options }: SetCookieDto) {
    return res.cookie(this._cookieName, token, options)
  }

  public clearCookie ({ res }: ClearCookieDto) {
    return res.cookie(this._cookieName, null, {
      expires: new Date()
    })
  }

  public become (token: string, sub: string) {
    const contents = this._verify(token)

    const originalUser = contents.originalSub ?? contents.sub
    const impersonatedUser = sub

    const app = contents.app

    return this._sign({
      sub: impersonatedUser,
      app,
      originalUser
    })
  }
}
