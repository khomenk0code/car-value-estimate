import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private UsersService: UsersService) {
  }

  async signup(email: string, password: string) {
    const users = await this.UsersService.findByEmail(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPasswordWithSalt = `${salt}.${hash.toString('hex')}`;

    return await this.UsersService.createUser(email, hashedPasswordWithSalt);
  }

  async signin(email: string, password: string) {
    const [user] = await this.UsersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password is invalid');
    }

    return user;
  }
}