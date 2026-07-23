export function validateName(name) {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
}

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
}

export function validatePhone(phone) {
  if (!phone.trim()) return 'Phone is required';
  if (!/^\+?[\d\s\-()]{10,}$/.test(phone.trim())) return 'Enter a valid phone number';
  return '';
}

export function validateAddress(address) {
  if (!address.trim()) return 'Address is required';
  if (address.trim().length < 5) return 'Address must be at least 5 characters';
  return '';
}
