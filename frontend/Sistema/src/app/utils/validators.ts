/**
 * Valida um CNPJ
 * @param cnpj CNPJ (apenas dígitos, sem formatação)
 * @returns true se for válido, false se for inválido
 */
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false;

  // Cálculo de validação
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

/**
 * Valida um email
 * @param email Email a ser validado
 * @returns true se for válido, false se for inválido
 */
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

/**
 * Valida se uma string contém apenas letras e espaços
 * @param text Texto a ser validado
 * @returns true se for válido, false se for inválido
 */
export function validateText(text: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s.,&'-]+$/.test(text);
}

/**
 * Valida se uma string contém apenas números
 * @param text Texto a ser validado
 * @returns true se for válido, false se for inválido
 */
export function validateNumber(text: string): boolean {
  return /^\d+$/.test(text);
}

/**
 * Valida um número de telefone
 * @param phone Número de telefone
 * @returns true se for válido, false se for inválido
 */
export function validatePhone(phone: string): boolean {
  return /^[\d\s()+-]+$/.test(phone);
}