import type { Product } from '../../shared/types';

const PRODUCTS_URL = 'https://fakestoreapi.com/products';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL);
  return handleResponse<Product[]>(response);
}
