import AppError from '@shared/errors/AppError';
import UserRepository from '../typeorm/repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    email,
    password,
    avatar,
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UserRepository);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userExists = await usersRepository.findByName(email);

    if (userExists && name !== user.email) {
      throw new AppError('There ir already one user with thos name');
    }

    user.name = name;
    user.email = email;
    user.password = password;
    user.avatar = avatar;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
