import { Response, Request, NextFunction } from "express";
import { Category } from "../models/category";
import { Product } from "../models/product";
export const productValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, quantity, category, offer } = req.body;

    const error: any = {};

    if (!name) error.name = "name of the product is required";

    if (!description)
      error.description = "description of the product is required";

    if (!price) error.price = "name of the product is required";

    if (!quantity) error.quantity = "quantity of the product is required";

    if (!category) error.category = "category of the product is required";

    if (Object.keys(error).length > 0) return res.status(400).json(error);

    const confirmName = await Product.findOne({ name });
    if (confirmName) error.name = "name already exist";

    if (!confirmName && name.length <= 1)
      error.name = "name must be two or more characters";

    const confirmCategory = await Category.findById(category);
    if (!confirmCategory) error.category = "category _id is required";

    if (description.length < 20)
      error.description = "description must be grater than 10 character";

    if (isNaN(price) || price < 1)
      error.price = "price most be a number and most be greater than 0";

    if (isNaN(quantity) || quantity < 1)
      error.quantity = "quantity most be a number and most be greater than 0";

    if ((offer && isNaN(offer)) || offer < 1)
      error.offer = "quantity most be a number and most be greater than 0";

    if (Object.keys(error).length > 0) return res.status(400).json(error);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  next();
};

export const productValidEdit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, quantity, category, offer } = req.body;

    const error: any = {};

    if (!name) error.name = "name of the product is required";

    if (!description)
      error.description = "description of the product is required";

    if (!price) error.price = "name of the product is required";

    if (!quantity) error.quantity = "quantity of the product is required";

    if (!category) error.category = "category of the product is required";

    if (Object.keys(error).length > 0) return res.status(400).json(error);

    if (name.length <= 1) error.name = "name must be two or more characters";

    if (description.length < 20)
      error.description = "description must be grater than 10 character";

    if (isNaN(price) || price < 1)
      error.price = "price most be a number and most be greater than 0";

    if (isNaN(quantity) || quantity < 1)
      error.quantity = "quantity most be a number and most be greater than 0";

    if ((offer && isNaN(offer)) || offer < 1)
      error.offer = "quantity most be a number and most be greater than 0";

    if (Object.keys(error).length > 0) return res.status(400).json(error);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

  next();
};
