import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.createUser(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.userService.findOneById(parseInt(id));

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateById(parseInt(id), body);
  }
}
