import AppError from '@shared/errors/AppError';
import UserRepository from '../typeorm/repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';

interface IRequest {
  id: string;
}

class DeleteProfileService {
  public async execute({ id }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UserRepository);

    const user = await usersRepository.findOne(id);

    if (!user) {
      throw new AppError('User not found');
    }

    await usersRepository.remove(user);
  }
}

export default DeleteProfileService;
