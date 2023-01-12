import { Request, Response } from 'express';
import ListCustomerService from '../services/ListCustomerService';
import ShowCustomersService from '../services/ShowCustomerService';
import CreateCustomersService from '../services/CreateCustomerService';
import UpdateCustomersService from '../services/UpdateCustomerService';
import DeleteCustomersService from '../services/DeleteCustomerService';

export default class CustomersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listCutomers = new ListCustomerService();

    const customers = await listCutomers.execute();

    return res.json(customers);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const showCustomer = new ShowCustomersService();

    const customer = await showCustomer.execute({ id });

    return res.json(customer);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createCustumer = new CreateCustomersService();

    const customer = await createCustumer.execute({
      name,
      email,
    });

    return res.json(customer);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;
    const { id } = req.params;

    const updateCustomer = new UpdateCustomersService();

    const customer = await updateCustomer.execute({
      id,
      name,
      email,
    });

    return res.json(customer);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteCustomer = new DeleteCustomersService();

    await deleteCustomer.execute({ id });

    return res.json([]);
  }
}
