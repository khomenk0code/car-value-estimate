import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) => {
      return Promise.resolve({id , email: 'asd@asd.asd', password: 'asd@asd'} as User);

    },
      findByEmail: (email:string) => {
       return  Promise.resolve([{id: 1 , email, password: 'asd@asd'} as User])
      },
      // removeById: (id: number) => {},
      // updateById: (email: string, password: string) => {}
    }

    fakeAuthService = {
      // signup: jest.fn(),
      // signin: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
