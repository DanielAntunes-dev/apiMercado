import { Request, Response } from 'express';
import SendForgotPasswordService from '../services/SendForgotPasswordService';

export default class ForgotPasswordController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendForgotPassswordEmail = new SendForgotPasswordService();

    await sendForgotPassswordEmail.execute({
      email,
    });

    return res.status(204).json();
  }
}
