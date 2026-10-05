# Food Store Calculator API

A small REST API built with Express and TypeScript. It calculates the total price of an order, applying bundle discounts and a member discount.

## Requirements

- Node.js 18 or later
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server (reloads on file changes):

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

### Production build

```bash
npm run build
npm start
```

## Scripts

| Script              | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the server in watch mode with `tsx`    |
| `npm run build`     | Compile TypeScript into `dist/`              |
| `npm start`         | Run the compiled server from `dist/`         |
| `npm run typecheck` | Type-check the project without emitting files |

## API

### `POST /calculate`

Calculates the price of an order.

**Request body**

| Field              | Type   | Description                                      |
| ------------------ | ------ | ------------------------------------------------ |
| `memberId`         | string | Member card ID. Use an empty string for non-members. |
| `items`            | array  | Items in the order                               |
| `items[].code`     | string | Product code, e.g. `ORANGE`                      |
| `items[].quantity` | number | Number of sets                                   |

**Example request**

```bash
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "123456789",
    "items": [
      { "code": "ORANGE", "quantity": 2 },
      { "code": "RED", "quantity": 1 }
    ]
  }'
```

**Example response** `200 OK`

```json
{
  "success": true,
  "data": {
    "summary": {
      "items": [
        {
          "code": "ORANGE",
          "quantity": 2,
          "price": 120,
          "subtotal": 240,
          "discount": 12,
          "itemTotal": 228
        },
        {
          "code": "RED",
          "quantity": 1,
          "price": 50,
          "subtotal": 50,
          "discount": 0,
          "itemTotal": 50
        }
      ],
      "subtotal": 290,
      "bundleDiscount": 12,
      "memberDiscount": 27.8,
      "total": 250.2
    }
  }
}
```

**Response fields**

| Field              | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `items[].subtotal` | `price × quantity` before discounts                      |
| `items[].discount` | Bundle discount for the item                             |
| `items[].itemTotal`| `subtotal − discount`                                    |
| `subtotal`         | Sum of all item subtotals                                |
| `bundleDiscount`   | Sum of all bundle discounts                              |
| `memberDiscount`   | Member discount, calculated after bundle discounts       |
| `total`            | Final amount to pay                                      |

**Error response**

```json
{
  "success": false,
  "error": {
    "message": "Product with code BLACK not found"
  }
}
```

| Status | When                                                         |
| ------ | ------------------------------------------------------------ |
| `400`  | The body is not a JSON object, is malformed JSON, or contains an unknown product code |
| `404`  | The route does not exist                                     |
| `500`  | Unexpected server error                                      |

## Pricing Rules

### Products

| Code     | Name       | Price (THB) | Bundle discount |
| -------- | ---------- | ----------: | --------------- |
| `RED`    | Red set    | 50          | -               |
| `GREEN`  | Green set  | 40          | 5% per pair     |
| `BLUE`   | Blue set   | 30          | -               |
| `YELLOW` | Yellow set | 50          | -               |
| `PINK`   | Pink set   | 80          | 5% per pair     |
| `PURPLE` | Purple set | 90          | -               |
| `ORANGE` | Orange set | 120         | 5% per pair     |

### Discounts

- **Bundle discount:** Orange, Pink, and Green sets get 5% off for every pair ordered. Any leftover single set is charged at full price. For example, 3 Orange sets = 2 sets at 5% off + 1 set at full price.
- **Member discount:** Members get 10% off the total after bundle discounts are applied.

Product data and the member ID are mocked in `src/mock/`. The mock member ID is `123456789`.

## Project Structure

The project follows the MVC pattern.

```
src/
├── server.ts                         # Starts the HTTP server
├── app.ts                            # Express app setup
├── routes/
│   └── calculate.routes.ts           # Route definitions
├── controllers/
│   └── calculate.controller.ts       # Handles requests and responses
├── models/
│   └── calculation.model.ts          # Types and request parsing
├── views/
│   ├── calculate.view.ts             # Success response format
│   └── error.view.ts                 # Error response format
├── services/
│   └── calculator.service.ts         # Price calculation logic
├── middlewares/
│   └── error-handler.ts              # 404 and error handling
├── errors/
│   └── http-error.ts                 # Error class with HTTP status
└── mock/
    ├── member.ts                     # Mock member ID
    └── products.ts                   # Mock product list
```
