import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';
import Category from '../models/Category';

interface Request {
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
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getRepository(Category);

    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(transactionCategory);
    }

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type invalid!');
    }

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have funds enough!');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
