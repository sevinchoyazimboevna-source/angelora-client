# ANGELORA Client — React SPA

Premium ANGELORA jewelry storefront based on the supplied Base44 visual design. The UI, imagery, icons, spacing, animations and page structure are preserved; Base44 SDK/network logic has been removed and replaced with REST API integration.

## Run

```bash
npm install
npm run dev
```

Client: http://localhost:5173
API: http://localhost:3007

## Environment

Only the public API URL belongs in the client:

```env
VITE_API_URL=http://localhost:3007
```

Do **not** put MongoDB credentials, `SECRET_SESSION`, or `TOKEN_SECRET` in this project. Those belong only in the backend `.env`.

## REST endpoints expected by the client

### Authentication
- `POST /member/login` — `{ memberPhone, memberPassword }`
- `POST /member/signup` — multipart: `memberNick`, `memberPhone`, `memberPassword`, optional `memberImage`
- `GET /member/check-me`
- `POST /member/logout`
- `POST /member/forgot-password`
- `POST /member/reset-password`

### Catalog
- `GET /product/all`
- `GET /product/:id`

### Orders
- `POST /order/create`
- `GET /order/all`
- `GET /order/:id`

If your backend uses different member/order route names, change them only in `src/api/restClient.js`; the UI does not need to change.

## Product mapping

The REST adapter accepts both the storefront names and the existing ANGELORA backend names such as `productName`, `productPrice`, `productImages`, `productMaterial`, `productCarat`, `productDesc`, `productLeftCount`, and `productCollection`.

## Architecture

- React + Vite SPA
- React Router
- Redux Toolkit
- REST API via native `fetch`
- JWT token in localStorage
- Local cart/wishlist/recently-viewed persistence
- Existing Base44 design/components retained
