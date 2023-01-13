import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrderRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRespository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepositories';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  // SERVIÇO DE PEDIDO DE CRIAÇÃO DE COMPRAS
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const orderRepository = getCustomRepository(OrdersRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExists = await customerRepository.findById(customer_id);

    // VERIFICAR SE O CLIENTE EXISTE COM O ID INFORMADO
    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const existsProdcuts = await productsRepository.findAllByIds(products);

    // VERIFICAR SE TODOS OS IDS EXISTEM NO NOSSO REPOSITORIO, RETONAR SO OS QUE EXISTEM
    if (!existsProdcuts.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    // PEGAR OS IDS ENCONTRADOS
    const existsProdcutsIds = existsProdcuts.map(products => products.id);

    // CHECAR OS PRODUTOS INEXISTENTES E PEGAR ESSES PRODUTOS
    const checkInexistentProducts = products.filter(
      product => !existsProdcutsIds.includes(product.id),
    );

    // PEGAR OS PRODUSTOS QUE NÃO FORAM ENCONTRADOS
    if (checkInexistentProducts.length) {
      throw new AppError(`Could not find products
      ${checkInexistentProducts[0].id}.`);
    }

    const quantityAvailable = products.filter(
      product =>
        existsProdcuts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    //não permitir vender mais do que tem no estoque
    if (quantityAvailable.length) {
      throw new AppError(`Could not find products
      ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`);
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProdcuts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await orderRepository.createOrder({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    // diminuir a quantidade que esta sendo comprada do banco de dados
    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProdcuts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
