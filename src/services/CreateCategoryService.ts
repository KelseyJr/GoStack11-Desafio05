import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface RequestDTO {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: RequestDTO): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title },
    });
    if (checkCategoryExists) {
      return checkCategoryExists;
    }

    const category = categoriesRepository.create({ title });
    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
