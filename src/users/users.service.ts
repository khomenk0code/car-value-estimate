import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  createUser(email: string, password: string) {
    const user = this.userRepository.create({ email, password });

    return this.userRepository.save(user);
  }

  findOneById(id: number) {
    if (!id) return null;

    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.find({ where: { email } });
  }

  async updateById(id: number, attributes: Partial<User>) {
    const user = await this.findOneById(id);

    if (user) {
      Object.assign(user, attributes);
      return this.userRepository.save(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async removeById(id: number) {
    const user = await this.findOneById(id);

    if (user) {
      return this.userRepository.remove(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
