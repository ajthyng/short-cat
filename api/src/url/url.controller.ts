import { Body, Controller, Get, NotFoundException, Param, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { CreateUrlDto } from './url.dto'
import { UrlService } from './url.service'

@Controller()
export class UrlController {
  constructor (
    private readonly urlService: UrlService
  ) {}

  @Post('url/create')
  create (@Body() urlDto: CreateUrlDto) {
    return this.urlService.create(urlDto)
  }

  @Get(':id')
  async loadUrl (@Param('id') id, @Res() response: Response) {
    const destination = await this.urlService.findDestination(id)
    if (destination === null) {
      throw new NotFoundException()
    }
    response.redirect(destination)
  }
}
