export function validateName(name: string): string {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateFirstName(name: string): string {
  if (!name.trim()) return 'First name is required';
  if (name.trim().length < 2) return 'First name must be at least 2 characters';
  return '';
}

export function validateLastName(name: string): string {
  if (!name.trim()) return 'Last name is required';
  if (name.trim().length < 2) return 'Last name must be at least 2 characters';
  return '';
}

export function validateAge(age: string): string {
  if (!age.trim()) return 'Age is required';
  const value = Number(age);
  if (!Number.isInteger(value) || value < 13 || value > 120) {
    return 'Enter a valid age (13–120)';
  }
  return '';
}

export function validateEmail(email: string): string {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Enter a valid email address';
  return '';
}

export function validatePhone(phone: string): string {
  if (!phone.trim()) return 'Phone is required';
  if (!/^\+?[\d\s\-()]{10,}$/.test(phone.trim()))
    return 'Enter a valid phone number';
  return '';
}

export function validateAddress(address: string): string {
  if (!address.trim()) return 'Address is required';
  if (address.trim().length < 5) return 'Address must be at least 5 characters';
  return '';
}

export function validateCity(city: string): string {
  if (!city.trim()) return 'City is required';
  if (city.trim().length < 2) return 'City must be at least 2 characters';
  return '';
}

export function validateState(state: string): string {
  if (!state.trim()) return 'State is required';
  return '';
}

export function validateZip(zip: string): string {
  if (!zip.trim()) return 'Zip code is required';
  if (!/^\d{5}(-\d{4})?$/.test(zip.trim())) return 'Enter a valid zip code';
  return '';
}
