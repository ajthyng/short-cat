import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post('/create')
  async create (@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get(':id')
  async get (@Param() params: { id: string }) {
    return this.userService.findOneById(params.id)
  }
}
