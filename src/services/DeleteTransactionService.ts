import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepositoy = getRepository(Transaction);

    const transaction = await transactionsRepositoy.findOne(id);
    if (!transaction) {
      throw new AppError('transaction not found.');
    }

    await transactionsRepositoy.remove(transaction);
  }
}

export default DeleteTransactionService;
