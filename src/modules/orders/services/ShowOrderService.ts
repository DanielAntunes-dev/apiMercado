import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrderRepository';

interface IRequest {
  id: string;
}

class ShowOrderService {
  // SERVIÇO DE EXIBIÇÃO DE UM PEDIDO DE COMPRAS
  public async execute({ id }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrdersRepository);

    const order = await orderRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found');
    }

    return order;
  }
}

export default ShowOrderService;
