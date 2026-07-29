const PRODUCTS_URL = 'https://fakestoreapi.com/products';
const USERS_URL = 'https://fakestoreapi.com/users';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function readErrorMessage(response) {
  try {
    const body = await response.json();
    if (body && typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    // response body was not JSON
  }
  return `Request failed with status ${response.status}`;
}

export function buildRegisterPayload(form) {
  const street = form.address2?.trim()
    ? `${form.address1.trim()}, ${form.address2.trim()}`
    : form.address1.trim();
  const city = form.state?.trim()
    ? `${form.city.trim()}, ${form.state.trim()}`
    : form.city.trim();
  const localPart = form.email.split('@')[0] || 'user';
  const username = localPart.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 20) || 'user';

  return {
    email: form.email.trim(),
    username,
    password: 'cartly-poc',
    name: {
      firstname: form.firstName.trim(),
      lastname: form.lastName.trim(),
    },
    address: {
      city,
      street,
      number: 1,
      zip: form.zip.trim(),
      geolocation: {
        lat: '-37.3159',
        lng: '81.1496',
      },
    },
    phone: form.phone.trim(),
  };
}

export async function registerUser(form) {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRegisterPayload(form)),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(PRODUCTS_URL);
  return handleResponse(response);
}
