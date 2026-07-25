import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    cart.calculateTotals();
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, selectedSize, selectedColor, selectedPrintType, printLocation, artworkUrl } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const unitPrice = product.basePrice;
    const totalItemPrice = unitPrice * (quantity || 1);

    cart.items.push({
      product: productId,
      quantity: quantity || 1,
      selectedSize,
      selectedColor,
      selectedPrintType,
      printLocation,
      artworkUrl: artworkUrl || '',
      unitPrice,
      totalItemPrice
    });

    cart.calculateTotals();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(201).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    item.totalItemPrice = item.unitPrice * quantity;

    cart.calculateTotals();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    cart.calculateTotals();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};
