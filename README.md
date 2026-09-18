# Cartly — React E-commerce POC (v2)

A proof-of-concept storefront demonstrating React fundamentals, components, hooks,
HTTP calls, and state management — now extended with authentication, order
confirmation, form validation, SEO, accessibility, and lazy loading.

## What's new in this version

- **Zustand** replaces the old Context + `useReducer` cart — see `src/store/`
- **Yup** validates the Login and Registration forms — see `src/validation/schemas.js`
- **Login**, **Order Confirmation**, and **Account** pages added
- **Registration** now includes Username / Password / Confirm Password
- **Checkout** delivery date & payment method are plain info rows (no longer
  fake-selectable radio cards)
- **Header** shows an avatar + username with a Profile/Logout dropdown once
  logged in, and Login/Register links when logged out
- **SEO**: every page sets its own `<title>` and meta description via
  `react-helmet-async`
- **Accessibility**: semantic landmarks, skip-to-content link, labelled form
  fields with `aria-describedby` errors, accessible avatar dropdown menu
  (keyboard + click-outside + focus return), `aria-live` regions for dynamic
  content, alt text on all product images
- **Lazy loading**: every route is code-split with `React.lazy` + `Suspense`;
  all non-critical images use `loading="lazy"`
- **Folder structure**: one folder per component/page, each holding its
  `.jsx` and `.css` together

## Pages

| Route             | Page                 | Notes |
|--------------------|----------------------|-------|
| `/`                | Home                 | Search + category filter, 10-per-page grid, pagination |
| `/product/:id`     | Product Detail       | Quantity selector, Add to Cart (button micro-feedback) / Buy Now |
| `/cart`            | Cart                 | Line items, quantity editing, order summary |
| `/checkout`        | Checkout             | Shipping address, delivery date & payment method as info rows, order summary |
| `/order-confirmation` | Order Confirmation | Shown after "Place order" — order number, delivery estimate, items |
| `/register`        | Registration         | Personal + address + account (username/password) fields, Yup-validated |
| `/login`            | Login                | Email/password, Yup-validated, calls the login API |
| `/account`         | Account (protected)  | Dashboard — Dashboard / Profile / Logout only; redirects to `/login` if signed out |

## State management — Zustand

- `src/store/useCartStore.js` — cart items, `addItem`, `updateQuantity`,
  `removeItem`, `clearCart`, plus derived `itemCount`/`subtotal`. Persisted to
  `localStorage` under `cartly-cart` via Zustand's `persist` middleware.
- `src/store/useAuthStore.js` — `user`, `token`, `isAuthenticated`, `login()`,
  `logout()`. Persisted to `localStorage` under `cartly-auth`.

No `<Provider>` wrapping is needed for either — components import the hook
directly (`useCartStore`, `useAuthStore`) and subscribe to just the slice of
state they need, e.g. `useCartStore((state) => state.itemCount)`.

## Form validation — Yup

`src/validation/schemas.js` exports `loginSchema`, `registrationSchema`, and a
`validateWithYup(schema, values)` helper that runs `schema.validate(values, {
abortEarly: false })` and flattens Yup's error array into a `{ field: message
}` map — a drop-in replacement for the hand-written `validate()` functions
used previously, without pulling in `react-hook-form`.

## APIs

- **Register**: `POST http://localhost:5000/api/register` — `RegistrationPage.jsx`
- **Login**: `POST http://localhost:5000/api/login` — `LoginPage.jsx`, expects
  `{ user: { username, firstName, lastName, email }, token }` back on success

Both calls have `try/catch` error handling and surface a readable message if
the API is unreachable (e.g. the local server isn't running) or returns a
non-2xx status.

Product data still comes from the public `fakestoreapi.com` (unchanged).

## Folder structure

```
src/
  components/
    Header/          Header.jsx, Header.css — auth-aware nav, cart badge
    Footer/          Footer.jsx, Footer.css
    ProductCard/      ProductCard.jsx, ProductCard.css
    StarRating/       StarRating.jsx, StarRating.css
    UserMenu/         UserMenu.jsx, UserMenu.css — avatar dropdown (Profile/Logout)
    ProtectedRoute/   ProtectedRoute.jsx — redirects to /login if signed out
  pages/
    HomePage/
    ProductDetailPage/
    CartPage/
    CheckoutPage/
    OrderConfirmationPage/
    RegistrationPage/
    LoginPage/
    AccountPage/
      each folder holds that page's .jsx + .css together
  store/
    useCartStore.js   Zustand cart store (persisted)
    useAuthStore.js   Zustand auth store (persisted)
  validation/
    schemas.js        Yup schemas + validateWithYup helper
  hooks/
    useFetch.js       Reusable GET hook
  App.jsx             Lazy-loaded route definitions
  main.jsx            Entry point (HelmetProvider + BrowserRouter)
  index.css           Design tokens, skip-link, focus-visible styles
```

## Getting started

```bash
npm install
npm --prefix server install
```

Then start the storefront and the account API in two terminals:

```bash
npm run dev
npm run dev:api
```

- React (Vite): `http://localhost:5173`
- Account API: `http://localhost:5000` (`POST /api/register`, `POST /api/login`)

The API lives in `server/` (Express). Registered users are stored in
`server/data/users.txt` (created on first run; not committed). See
`server/README.md` for request/response shapes.

## Notes / next steps for the team demo

- `/account`'s order history and stats are placeholder data — swap in a real
  orders API and this is a good spot to demo another `useFetch` usage.
- The checkout "Change" buttons on shipping address / payment method are
  inert — natural next step to build out an address book / saved cards flow.
- `useAuthStore`'s `token` is stored in `localStorage` for POC simplicity;
  a production app would weigh that against `httpOnly` cookies for XSS safety.
