const router = require('express').Router()
const {Order, Product, Pending} = require('../db/models')

router.get('/:userId', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        userId: req.params.userId,
        orderDate: null
      },
      include: {
        model: Pending,
        include: Product
      }
    })
    const cart = order.pendings
    res.json(cart)
  } catch (error) {
    next(error)
  }
})

router.put('/:itemId', async (req, res, next) => {
  try {
    const item = await Pending.findByPk(req.params.itemId)
    await item.update(req.body)
    res.status(200).json(item)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const [newPending, wasCreated] = await Pending.findOrCreate({
      where: {
        orderId: req.body.orderId,
        productId: req.body.productId,
        orderPrice: req.body.orderPrice
      },
      include: {
        model: Product
      }
    })
    const prevQuant = newPending.quantity
    await newPending.update({
      quantity: prevQuant + 1
    })
    res.status(201).json(newPending)
  } catch (error) {
    next(error)
  }
})

router.delete('/:itemId', async (req, res, next) => {
  try {
    const id = req.params.itemId
    await Pending.destroy({
      where: {
        id
      }
    })
    res.status(200).send(id)
  } catch (error) {
    next(error)
  }
})

router.delete('/order/:orderId', async (req, res, next) => {
  try {
    const id = req.params.orderId
    await Order.destroy({
      where: {
        id
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
