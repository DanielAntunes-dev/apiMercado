import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async findByName(name: string): Promise<Product | undefined> {
    const product = this.findOne({
      where: {
        name,
      },
    });
    return product;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    // pegar todos os ids
    const productIds = products.map(product => product.id);

    // procura e verifica se os ids sao validos
    const existsProducts = await this.find({
      where: {
        id: In(productIds),
      },
    });

    return existsProducts;
  }
}
