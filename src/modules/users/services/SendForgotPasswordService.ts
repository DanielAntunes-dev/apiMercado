import UserRepository from '../typeorm/repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';

interface IRequest {
  email: string;
}

class SendForgotPasswordService {
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UserRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await usersRepository.findByEmail(email);

    if (!userToken) {
      throw new AppError('User does not exists');
    }

    const token = await userTokensRepository.generate(userToken.id);

    console.log(token);
  }
}

export default SendForgotPasswordService;
