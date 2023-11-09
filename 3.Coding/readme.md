## 3. Coding
Write a service called `Cart` which serve usage listed below.

**Basic** - Cart service that can manage items.

```javascript
// Create cart object
cart = Cart.create(customer_id)

// Add or increase item quantity in cart by product id.
cart.add(product_id, quantity)

// Replace item quantity or remove item from cart by product id.
cart.update(product_id, quantity)

// Delete item from cart by product id.
cart.remove(product_id)

// Delete cart object.
cart.destroy()
```

**Utilities** - Functions that save consumers effort.

```javascript
// Check id product is already in cart, boolean returned.
has = cart.has(product_id)

// Check if cart contains any items, boolean returned.
isEmpty = cart.isEmpty()

// Display list of items and quantity, json returned.
count = cart.count()

// Get number of different items, int returned.
quantity = cart.quantity()

// Get amount of total items, int returned.
total = cart.total()
```

**Discount** - Sometimes customer apply coupon or voucher.
- `addDiscount` - Apply a promotion to cart that effect directly to `total`
  - Accept 2 parameters
    - `name` - An identifier.
    - `discount` - A parameters to be calculated.
        - Case1: Deduct 50.- total
            - `{type: "fixed", amount: 50}`
        - Case2: Deduct 10% from total but not over 100.-
            - `{type: "percentage", amount: 10, max: 100}`
- `removeDiscount` - Remove promotion by name.

```javascript
discount = {type: "percentage", amount: 10, max: 100}

total = cart.total() // 2500

cart.addDiscount(name, discount)
total = cart.total() // 2400

cart.removeDiscount(name);
total = cart.total() // 2500
```

**Freebie** - "Buy A get B for free!"
- `addFreebie` - Apply a promotion to cart that effect directly to `items`
  - Accept 3 parameters
    - `name` - An identifier.
    - `condition` - A valiation rule cart should applied to get reward.
    - `reward` - A return if cart applied to condition

```javascript
cart.add(1, 1)

condition = {type: "contains", product_id: 1}
reward = {product_id: 2, quantity: 1}
cart.addFreebie(name, condition, reward)

cart.has(2) // true
cart.count() // 2
```

#### Requirements
- Your code should be executable on console or unit test.
- No need to connect to any storage or database.
- Validation is not required.
- Negative cases have additional score.

#### Notes
- You will submit with language you are requested to do so.

ปล. มีการเพิ่มตัวสินค้า โดยไม่สามารถใส่สินค้านอกเหนือจากที่กำหนดได้
ปล. มีการเพิ่ม function summarize เพื่อดูผลรวมบิล เพื่อให้ง่ายต่อการตรวจสอบ
ปล2. มีการแบ่ง quantity และ freequantity ออกจากกันเพื่อเวลาคิด total สินค้าฟรีจะไม่ถูกนำมาคิดด้วย
ปล3. มีการเพิ่ม function removeFreebie
ปล4. มีการเพิ่ม function totalQuantity เนื่องจาก total ใช้ในการนับราคา