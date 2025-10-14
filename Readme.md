# How to run the project

- Run the following commands in ther terminal

```bash
git clone
```

```bash
cd backnd && npm install
```

- Create an `.env` file and add the variables similar as shown in `.env.example`

**You can get a free postgess database from [NEON DB](https://www.neon.tech)**

Run using 

```bash
npm run dev

```


# API ENDPOINTS

## Admin Endpoints

### AUTH

- POST `/admin/login` -> Admin Login
- GET `/admin/me` -> Get admin profile
- PUT `/admin/me` -> update admin profile

### Restaurant Management(Admin)

- POST `/admin/restaurant` -> add new restaurant
- GET `/admin/restaurant` -> list all restaurants
- GET `/admin/restaurants/:id` -> get details of a restaurant
- PUT `/admin/restaurants/:id` -> update restaurant info
- DELETE `/admin/restaurant/:id` -> Delete restaruant

### Food Management (Admin)

- POST `/admin/restaurant/:restaurantId/foods` -> Add food items
- GET `/admin/restaurant/:restaurantId/foods` -> List food items
- GET `/admin/restaurant/:restaurantId/foods/:foodId` -> Get food details
- PUT `/admin/restaurants/:restaurantId/foods/:foodId` -> Update food
- DELETE `/admin/restaurants/:restaurantId/foods/:foodId` -> Delete food

## User endpoints

### Auth

- POST `/users/signup` -> Register new user
- POST `/users/login` -> User login
- GET `/users/me/:id` -> Get profile
- PUT `/users/me/:id` -> Update profile

### User Restaurant Browsing

- GET `/restaurants` -> List all restaurants
- GET `/restaurants/:id` -> Get detials of the menu

### Cart

- POST `/carts` -> Create a cart
- GET `/carts/:cartId` -> Get cart details
- PUT `/carts/:cartId` -> Update cart
- DELETE `/carts/:cartId` -> Delete cart

### Order

- POST `/orders` -> place an order
- GET `/orders` -> list all orders
- GET `/orders/:orderId` -> Get order details
- PUT `/orders/:orderId/cancel` -> Cancel order

### Reservation

- POST `/reservations` -> Make a reservation
- GET `/reservations` -> List all reservations of a user
- GET `/reservations/:id` -> Get reservation detials
- PUT `/reservations/:id/cancel` -> cancel reservation

<!-- ### PUBLIC / GENERAL ENDPOINTS -->

<!-- - GET `/restaurants` -> List restaurants (for users to browse)
- GET `/restaurants/:id/foods` -> List foods in a restaurant
- GET `/foods/:id` -> List foods in a restaurant -->
```
