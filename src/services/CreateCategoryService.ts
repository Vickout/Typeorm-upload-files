import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}

class CreateCategoryService {
  public async excute({ category: title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const categoryInDB = await categoriesRepository.findOne({
      where: { title },
    });

    if (!categoryInDB) {
      const newCategory = categoriesRepository.create({
        title,
      });

      await categoriesRepository.save(newCategory);

      return newCategory;
    }

    return categoryInDB;
  }
}

export default CreateCategoryService;
