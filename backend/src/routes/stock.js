const express = require('express');
const Stock = require('../models/Stock');
const Product = require('../models/Product'); // Precisamos do modelo Product
const router = express.Router();

// PUT /:id (Atualizar um item de estoque - Cor, Tamanho, Qtd)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, quantity } = req.body;

    const stockItem = await Stock.findByPk(id);
    if (!stockItem) {
      return res.status(404).json({ error: 'Item de estoque não encontrado.' });
    }

    // Atualiza apenas os campos que foram enviados
    stockItem.color = color ?? stockItem.color;
    stockItem.size = size ?? stockItem.size;
    stockItem.quantity = quantity ?? stockItem.quantity;
    
    await stockItem.save();
    
    res.json(stockItem);

  } catch (err) {
    console.error("Erro ao atualizar estoque:", err);
    res.status(500).json({ error: 'Erro interno ao atualizar estoque.' });
  }
});

// DELETE /:id (Remover um item de estoque - LÓGICA ATUALIZADA)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const stockItem = await Stock.findByPk(id);

    if (!stockItem) {
      return res.status(404).json({ error: 'Item de estoque não encontrado.' });
    }

    const productId = stockItem.product_id;

    // 1. Remove o item de estoque (ex: "Azul, M")
    await stockItem.destroy();

    // 2. Verifica se o produto "pai" ainda tem outros estoques
    const remainingStock = await Stock.count({
      where: { product_id: productId }
    });

    // 3. Se não tiver mais nenhum (count === 0), remove o produto "pai"
    if (remainingStock === 0) {
      await Product.destroy({
        where: { id: productId }
      });
      return res.json({ message: 'Item de estoque e produto principal removidos.' });
    }
    
    // Se ainda tinha estoque, só o item é removido
    res.json({ message: 'Item de estoque removido com sucesso.' });

  } catch (err) {
    console.error("Erro ao remover estoque:", err);
    res.status(500).json({ error: 'Erro interno ao remover estoque.' });
  }
});

module.exports = router;