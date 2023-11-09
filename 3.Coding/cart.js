class Cart {
  customer_id = 0
  cartItem = {}
  discount = {}
  freebie = {}

  product = {
    1: {
      name: 'Oreo',
      price: 5,
    },
    2: {
      name: 'Snack',
      price: 10,
    },
    3: {
      name: 'Sandwich',
      price: 50,
    },
    4: {
      name: 'Steak',
      price: 100,
    },
  }

  constructor(customer_id) {
    this.customer_id = customer_id
  }

  create(customer_id) {
    this.customer_id = customer_id
  }

  add(product_id, quantity) {
    if (!this.product[product_id]) return console.log('Error => Product not found')
    if (quantity < 0) return console.log('Error => Negative Quantity')
    if (quantity === 0) return
    if (this.cartItem[product_id]) {
      this.cartItem[product_id].quantity = this.cartItem[product_id].quantity + quantity
    } else {
      this.cartItem[product_id] = {
        quantity,
        freebieQuantity: 0
      }
    }
  }

  update(product_id, quantity) {
    if (!this.product[product_id]) return console.log('Error => Product not found')
    if (quantity < 0) return console.log('Error => Negative Quantity')
    if (quantity === 0 && this.cartItem[product_id]?.freebieQuantity === 0) {
      delete this.cartItem[product_id]
    } else {
      if (!this.cartItem[product_id]) {
        this.cartItem[product_id] = {
          quantity,
          freebieQuantity: 0
        }
      } else {
        this.cartItem[product_id].quantity = quantity
      }
    }
  }

  remove(product_id) {
    delete this.cartItem[product_id]
  }

  destroy() {
    delete this
  }

  has(product_id) {
    return this.cartItem[product_id] ? true : false
  }

  isEmpty() {
    return Object.keys(this.cartItem).length > 0 ? false : true
  }

  count() {
    return this.cartItem
  }

  quantity() {
    return Object.keys(this.cartItem).length
  }

  totalQuantity() {
    let totalQuantity = 0
    return Object.values(this.cartItem).reduce((prev, curr) => {
      return prev + curr.quantity + curr.freebieQuantity;
  }, 0);
     
  }

  total() {
    const totalPrice = Object.entries(this.cartItem).reduce((prev, curr) => {
      return prev + this.product[curr[0]].price * curr[1].quantity
    }, 0)
    let totalDiscount = 0
    Object.values(this.discount).forEach((discount) => {
      if (discount.type === 'fixed') totalDiscount += discount.amount
      else if (discount.type === 'percentage') {
        const discountPrice = (totalPrice * discount.amount / 100)
        totalDiscount += discountPrice > discount.max ? discount.max : discountPrice
      }
    })
    return totalPrice - totalDiscount > 0 ? totalPrice - totalDiscount : 0
  }
  
  addDiscount(name, discount) {
    this.discount[name] = discount
  }

  removeDiscount(name) {
    delete this.discount[name]
  }

  addFreebie(name, condition, reward) {
    this.freebie[name] = {
      condition,
      reward,
      active: false,
    }
    if (condition.type === 'contains') {
      if (this.cartItem[condition.product_id]) {
        if (this.cartItem[reward.product_id]) {
          this.cartItem[reward.product_id].freebieQuantity = this.cartItem[reward.product_id].freebieQuantity + reward.quantity
        } else {
          this.cartItem[reward.product_id] = {
            quantity: 0,
            freebieQuantity: reward.quantity
          }
        }
      }
      this.freebie[name].active = true
    }
  }

  removeFreebie(name) {
    const freebie = this.freebie[name]
    if (freebie.active) {
      this.cartItem[freebie.reward.product_id].freebieQuantity -= freebie.reward.quantity
      if (this.cartItem[freebie.reward.product_id].freebieQuantity === 0 && this.cartItem[freebie.reward.product_id].quantity === 0) {
        delete this.cartItem[freebie.reward.product_id]
      }
    }
    delete this.freebie[name]
  }

  summarize() {
    const totalPrice = Object.entries(this.cartItem).reduce((prev, curr) => {
      return prev + this.product[curr[0]].price * curr[1].quantity
    }, 0)
    let totalDiscount = 0
    Object.values(this.discount).forEach((discount) => {
      if (discount.type === 'fixed') totalDiscount += discount.amount
      else if (discount.type === 'percentage') {
        const discountPrice = (totalPrice * discount.amount / 100)
        totalDiscount += discountPrice > discount.max ? discount.max : discountPrice
      }
    })
    console.log('================== Receipt =================')
    console.log('============================================')
    console.log(`customer_id: ${this.customer_id}`)
    console.log('============================================')
    console.log('product_id\tquantity\tprice\ttotalPrice')
    Object.entries(this.cartItem).forEach((item) => {
      console.log(`${item[0]}\t\t${item[1].quantity}${item[1].freebieQuantity ? `+${item[1].freebieQuantity}` : ''}\t\t${this.product[item[0]].price}\t${this.product[item[0]].price * item[1].quantity}`)
    })
    console.log('============================================')
    console.log(`Price: ${totalPrice}`)
    console.log(`Discount: ${totalDiscount}`)
    console.log(`Total Price: ${totalPrice - totalDiscount > 0 ? totalPrice - totalDiscount : 0}`)
    console.log('============================================')
  }
}

// TEST
let cart = new Cart(1)
console.log(cart.isEmpty())
cart.add(1, 10)
console.log(cart.isEmpty())
cart.update(1, 5)
cart.update(6, 5)
cart.add(1, 5)
cart.update(2, 5)
cart.remove(2)
cart.update(2, 9999)
cart.update(2, -1)
console.log(cart.total())
console.log(cart.totalQuantity())
console.log(cart.count())
console.log(cart.has(1))
console.log(cart.has(2))
cart.addDiscount('HotDeal', { type: 'percentage', amount: 10, max: 5 })
cart.addDiscount('50Baht', { type: 'fixed', amount: 50 })
cart.addFreebie('buyproduct1freeproduct2', { type: "contains", product_id: 1 }, { product_id: 2, quantity: 1 })
// cart.removeDiscount('HotDeal')
// cart.removeFreebie('buyproduct1freeproduct2')
cart.summarize()

cart.destroy()
