import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.model.js';
import { Product } from '../models/Product.model.js';
import { Order } from '../models/Order.model.js';
import { Review } from '../models/Review.model.js';
import { Cart } from '../models/Cart.model.js';
import { usersSeed, productsSeed } from './seedData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Purging existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
      Cart.deleteMany(),
    ]);

    console.log('[Seeder] Creating users (Admin & Customer)...');
    const createdUsers = [];
    for (const u of usersSeed) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const customerUser = createdUsers.find((u) => u.role === 'customer');

    console.log('[Seeder] Inserting realistic product catalog...');
    const createdProducts = await Product.insertMany(productsSeed);

    console.log('[Seeder] Creating sample verified reviews...');
    const firstProduct = createdProducts[0];
    const secondProduct = createdProducts[1];

    await Review.create([
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: firstProduct._id,
        rating: 5,
        title: 'Best Noise Cancelling I have ever experienced!',
        comment: 'The Sony XM5 headphones are phenomenal. Battery easily lasts the entire week on commutes, and call clarity is crystal clear.',
        isVerifiedPurchase: true,
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        product: secondProduct._id,
        rating: 5,
        title: 'Seamless Apple ecosystem integration',
        comment: 'Adaptive audio is like magic. USB-C case makes it so convenient to travel with one cable.',
        isVerifiedPurchase: true,
      },
    ]);

    console.log('[Seeder] Creating realistic sample customer order...');
    await Order.create({
      orderNumber: 'ORD-20261001-1001',
      user: customerUser._id,
      orderItems: [
        {
          product: firstProduct._id,
          name: firstProduct.name,
          slug: firstProduct.slug,
          image: firstProduct.images[0].url,
          price: firstProduct.discountPrice || firstProduct.price,
          quantity: 1,
        },
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      orderStatus: 'Processing',
      itemsPrice: firstProduct.discountPrice || firstProduct.price,
      shippingPrice: 0,
      taxPrice: Math.round((firstProduct.discountPrice || firstProduct.price) * 0.05),
      totalAmount: (firstProduct.discountPrice || firstProduct.price) * 1.05,
      notes: 'Please call before delivery.',
    });

    console.log('===========================================================');
    console.log('✅ Database seeded successfully with realistic data!');
    console.log(`👤 Admin Account   : ${adminUser.email} / Admin@12345`);
    console.log(`👤 Customer Account: ${customerUser.email} / Customer@12345`);
    console.log(`📦 Products Seeded : ${createdProducts.length}`);
    console.log('===========================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
