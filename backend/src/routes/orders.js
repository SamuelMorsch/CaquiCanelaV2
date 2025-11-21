const express = require('express');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, items, shipping_amount } = req.body;
    let total = 0;
    for (const it of items) total += parseFloat(it.unit_price) * parseInt(it.quantity);
    const order = await Order.create({ user_id, total_amount: total, shipping_amount, status: 'pending' });
    for (const it of items) {
      await OrderItem.create({ order_id: order.id, product_id: it.product_id, quantity: it.quantity, unit_price: it.unit_price, subtotal: it.quantity * it.unit_price });
    }
    res.status(201).json({ id: order.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao criar pedido' });
  }
});

router.get('/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem }] });
  res.json(order);
});

module.exports = router;
