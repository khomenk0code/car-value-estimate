import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session, UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptors';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
              ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
   const user =  await this.authService.signup(body.email, body.password);
   session.userId = user.id
   return user
  }

  @Post('/signin')
  async signing(@Body() body: CreateUserDto,  @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id
    return user
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null
  }

  @UseGuards(AuthGuard)
  @Get('/current-user')
  getCurrentUser(@CurrentUser() user: User) {
    return user
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
