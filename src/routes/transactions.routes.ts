import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import CreateCategoryService from '../services/CreateCategoryService';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import ListTransactionService from '../services/ListTransactionService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

  const listOfTransaction = new ListTransactionService();

  const alteredTransactions = listOfTransaction.execute(transactions);
  const balance = await transactionsRepository.getBalance(transactions);

  return response.json({ alteredTransactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createCategory = new CreateCategoryService();
  const createTransaction = new CreateTransactionService();

  const { id } = await createCategory.excute({ category });

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_id: id,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  const importTransactions = new ImportTransactionsService();

  // const transactionImported = await importTransaction.execute();

  return response.status(204).json(importTransactions);
});

export default transactionsRouter;
