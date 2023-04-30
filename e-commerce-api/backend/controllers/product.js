const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const path = require("path");
// const Redis = require("ioredis");

// const redis = new Redis({
//   port: 6379, // Redis port
//   host: "127.0.0.1", // Redis host
// });
const getAllProducts = async (req, res) => {
  const {
    name,
    category,
    numericFilters,
    company,
    featured,
    freeShipping,
    createdByUser,
    sort,
  } = req.query;

  const listKeyRedis = {};
  let redisKey = `products:`;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
    redisKey += "name:" + name + ",";
  }
  if (category) {
    queryObject.category = category;
    redisKey += "category:" + category + ",";
  }
  if (company) {
    queryObject.company = company;
    redisKey += "company:" + company + ",";
  }
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
    redisKey += "featured:" + featured + ",";
  }
  if (freeShipping) {
    queryObject.freeShipping = freeShipping === "true" ? true : false;
    redisKey += "freeShipping:" + freeShipping + ",";
  }
  if (createdByUser) {
    queryObject.createdByUser = createdByUser;
    redisKey += "createdByUser:" + createdByUser + ",";
  }
  if (numericFilters) {
    const operators = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regex = /\b(>|>=|=|<|<=)\b/g;
    const listFilters = numericFilters.replace(
      regex,
      (match) => `-${operators[match]}-`
    );
    listFilters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      queryObject[field] = { [operator]: Number(value) };
      redisKey += "numericFilters" + `${field}${operators[operator]}${value}`;
    });
  }
  let results = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    redisKey += "sort:" + sortList;
    results = results.sort(sortList);
  } else {
    results = results.sort("-createdAt");
    redisKey += "sort:-createdAt";
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);
  redisKey += ",page:" + page + "," + "limit:" + limit;
  // const valuesCached = await redis.get(redisKey);
  // if (valuesCached) {
  //   const data = JSON.parse(valuesCached);
  //   return res.status(200).json({ ...data, source: "cache" });
  // }
  const totalsProducts = await Product.countDocuments();
  const products = await results;
  // redis.set(
  //   redisKey,
  //   JSON.stringify({
  //     currentPage: page,
  //     totalPages: Math.ceil(totalsProducts / limit),
  //     products,
  //     nbHits: products.length,
  //     totalProducts: totalsProducts,
  //   }),
  //   "EX",
  //   60 * 60 * 60
  // );
  res.status(StatusCodes.OK).json({
    currentPage: page,
    totalPages: Math.ceil(totalsProducts / limit),
    products,
    nbHits: products.length,
    totalProducts: totalsProducts,
    source: "API",
  });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No item with id ${productId} not found`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const createProduct = async (req, res) => {
  const { name, price, category, company } = req.body;
  if (!name || !price || !category || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdByUser = req.userInfo.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!product) throw new NotFoundError(`No item with id ${productId} `);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) throw new NotFoundError(`No item with id ${productId} `);
  res
    .status(StatusCodes.OK)
    .json({ message: `Delete product with id ${productId} successfully` });
};

const uploadImage = async (req, res) => {
  const { id: productId } = req.params;
  if (!req.file) throw new BadRequestError("Please provide a file");
  const product = await Product.findOne({ _id: productId });
  if (!product) throw new NotFoundError(`No item with id ${productId}`);
  product.image = path.join(
    __dirname,
    "../public/uploads/" + req.file.filename
  );
  await product.save();
  res
    .status(StatusCodes.OK)
    .json({ product, message: "Update product successfully" });
};
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
