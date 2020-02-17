import axios from 'axios'
import { Agent } from 'https'
import { isEmpty } from 'lodash'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { parseString } from 'xml2js'
import { AuthnService } from '../authentication/authentication.service'

interface CasResponse {
  'cas:serviceResponse': {
    'cas:authenticationSuccess': {
      'cas:user': string
    }
  }
}

@Injectable()
export class CasService {
  private readonly _loginPath = '/cas/login'

  constructor (private readonly authnService: AuthnService) {}

  private _getServiceURL (req: Request) {
    const protocol = req.get('X-Is-Https') === 'true' ? 'https' : req.protocol
    return `${protocol}://${req.get('host')}${this._loginPath}`
  }

  private _getCasURL (req: Request) {
    const protocol = req.get('X-Is-Https') === 'true' ? 'https' : req.protocol
    return (process.env.CAS_URL || `${protocol}://${req.hostname}:2000`)
  }

  private _getTicket (req: Request) {
    const ticket = req.query.ticket
    return ticket
  }

  private _getTicketValidationURL (req: Request, ticket: string) {
    return `${this._getCasURL(req)}/serviceValidate?service=${this._getServiceURL(req)}&ticket=${ticket}`
  }

  private async _parseResponse (response: string) {
    const parsedXML: CasResponse = await new Promise((resolve, reject) => {
      parseString(response, { explicitArray: false }, (err: Error, result: CasResponse) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
    return parsedXML
  }

  getTicket (req: Request) {
    return this._getTicket(req)
  }

  async validateTicket (req: Request) {
    const ticket = this._getTicket(req)

    if (!ticket) throw new Error('No ticket provided for validation.')

    const casValidation = await axios.get(
      this._getTicketValidationURL(req, ticket),
      { httpsAgent: new Agent({ rejectUnauthorized: false }) }
    )

    const parsedResponse = await this._parseResponse(casValidation.data)

    const netid = parsedResponse['cas:serviceResponse']['cas:authenticationSuccess']['cas:user'].trim().toLowerCase()

    if (isEmpty(netid)) throw new Error('Empty identifier returned from IDP')

    return this.authnService.createToken(netid)
  }

  getLoginURL (req: Request) {
    return `${this._getCasURL(req)}/login?service=${encodeURIComponent(this._getServiceURL(req))}`
  }
}
