import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common'
import { UrlService } from './url.service'
import { CreateUrlDto } from './url.dto'
import { Response } from 'express'

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
    response.redirect(destination)
  }
}
