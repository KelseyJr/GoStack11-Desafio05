import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepositoy from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid', 400);
    }

    const transactionsRepositoy = getCustomRepository(TransactionsRepositoy);
    const categoryRepositoy = getRepository(Category);

    const { total } = await transactionsRepositoy.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance.', 400);
    }

    let transactionCategory = await categoryRepositoy.findOne({
      where: { title: category },
    });
    if (!transactionCategory) {
      transactionCategory = categoryRepositoy.create({ title: category });
      await categoryRepositoy.save(transactionCategory);
    }

    const transaction = transactionsRepositoy.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await transactionsRepositoy.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
