import { Product } from '../models/Product.model.js';
import { Review } from '../models/Review.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get Products with advanced filtering, search, sorting & pagination
 * GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    category,
    brand,
    minPrice,
    maxPrice,
    sort = 'newest',
    isFeatured,
    inStock,
  } = req.query;

  const queryFilter = { isActive: true };

  // Category filter
  if (category && category !== 'All') {
    queryFilter.category = category;
  }

  // Brand filter
  if (brand) {
    queryFilter.brand = brand;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    queryFilter.price = {};
    if (minPrice) queryFilter.price.$gte = Number(minPrice);
    if (maxPrice) queryFilter.price.$lte = Number(maxPrice);
  }

  // Stock availability
  if (inStock === 'true') {
    queryFilter.stock = { $gt: 0 };
  }

  // Featured flag
  if (isFeatured === 'true') {
    queryFilter.isFeatured = true;
  }

  // Search keyword (text index or regex fallback)
  if (search.trim()) {
    queryFilter.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { brand: { $regex: search.trim(), $options: 'i' } },
      { category: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  if (sort === 'price-desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { ratingsAverage: -1, ratingsCount: -1 };
  if (sort === 'popular') sortOption = { ratingsCount: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [products, totalCount] = await Promise.all([
    Product.find(queryFilter).sort(sortOption).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(queryFilter),
  ]);

  const totalPages = Math.ceil(totalCount / limitNum);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
      'Products retrieved successfully'
    )
  );
});

/**
 * Get Product by ID or Slug
 * GET /api/v1/products/:idOrSlug
 */
export const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  let product = null;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(idOrSlug).lean();
  }
  if (!product) {
    product = await Product.findOne({ slug: idOrSlug.toLowerCase(), isActive: true }).lean();
  }

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // Fetch reviews for this product
  const reviews = await Review.find({ product: product._id }).sort({ createdAt: -1 }).limit(20).lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...product,
        reviews,
      },
      'Product details retrieved successfully'
    )
  );
});

/**
 * Get distinct categories with product counts
 * GET /api/v1/products/categories
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, categories, 'Categories retrieved successfully'));
});

/**
 * Create Product (Admin Only)
 * POST /api/v1/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    shortDescription,
    description,
    price,
    discountPrice,
    stock,
    category,
    brand,
    images,
    specs,
    isFeatured,
    metaTitle,
    metaDescription,
    keywords,
  } = req.body;

  if (!name || !sku || !shortDescription || !description || !price || !category || !brand) {
    throw new ApiError(400, 'Please provide all mandatory product fields.');
  }

  const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
  if (existingSku) {
    throw new ApiError(400, `A product with SKU "${sku}" already exists.`);
  }

  const product = await Product.create({
    name,
    sku: sku.toUpperCase(),
    shortDescription,
    description,
    price,
    discountPrice: discountPrice || null,
    stock: stock || 0,
    category,
    brand,
    images: images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', alt: name }],
    specs: specs || [],
    isFeatured: !!isFeatured,
    metaTitle: metaTitle || `${name} | Official Store`,
    metaDescription: metaDescription || shortDescription,
    keywords: keywords || [],
  });

  return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

/**
 * Update Product (Admin Only)
 * PUT /api/v1/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  Object.assign(product, req.body);
  await product.save();

  return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

/**
 * Delete / Deactivate Product (Admin Only)
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  return res.status(200).json(new ApiResponse(200, null, 'Product deactivated successfully'));
});

/**
 * Add Review for Product (Authenticated Users)
 * POST /api/v1/products/:id/reviews
 */
export const addProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  if (!rating || !title || !comment) {
    throw new ApiError(400, 'Rating, title, and comment are required.');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // Check if user already reviewed
  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: id });
  if (alreadyReviewed) {
    throw new ApiError(400, 'You have already reviewed this product.');
  }

  const review = await Review.create({
    user: req.user._id,
    userName: req.user.name,
    userAvatar: req.user.avatar || '',
    product: id,
    rating: Number(rating),
    title,
    comment,
  });

  return res.status(201).json(new ApiResponse(201, review, 'Review submitted successfully'));
});
