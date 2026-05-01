export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(phone);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPEG or PNG image' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size should be less than 10MB' };
  }

  return { valid: true };
};