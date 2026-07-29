const PRODUCTS_URL = 'https://fakestoreapi.com/products';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(PRODUCTS_URL);
  return handleResponse(response);
}
