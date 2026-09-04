import type {
  RegisteredUser,
  RegisterFormData,
  RegisterPayload,
} from '../../shared/types';

const USERS_URL = 'https://fakestoreapi.com/users';

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
    ) {
      return body.message;
    }
  } catch {
    // Response body was not JSON.
  }
  return `Request failed with status ${response.status}`;
}

export function buildRegisterPayload(form: RegisterFormData): RegisterPayload {
  const street = form.address2.trim()
    ? `${form.address1.trim()}, ${form.address2.trim()}`
    : form.address1.trim();
  const city = form.state.trim()
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

export async function registerUser(form: RegisterFormData): Promise<RegisteredUser> {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildRegisterPayload(form)),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json() as Promise<RegisteredUser>;
}
