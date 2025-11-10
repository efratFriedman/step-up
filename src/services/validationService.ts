function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function isValidPhone(phone: string) {
  const phoneRegex = /^(\+972|0)([234589]|5[0-9])\d{7}$/;
  return phoneRegex.test(phone);
}

function isValidBirthDate(birthDate: string) {
  const date = new Date(birthDate);
  const now = new Date();
  if (isNaN(date.getTime()) || date > now) return false;
  const minAge = 8;
  const age = now.getFullYear() - date.getFullYear();
  if (age < minAge) return false;

  return true;
}

export {isValidBirthDate,isValidEmail,isValidPassword,isValidPhone};