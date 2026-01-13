import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* ================= CLASS NAME ================= */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ================= FORMAT PRICE ================= */
/**
 * Format giá tiền VND
 * VD: 12000000 -> "12.000.000 ₫"
 */
export function formatPrice(price?: number | string | null, currency: string = 'VND'): string {
  const value = Number(price);

  if (isNaN(value) || value <= 0) {
    return '0 ₫';
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/* ================= IS MAIN IMAGE ================= */
/**
 * Kiểm tra ảnh có phải ảnh chính hay không
 * Hỗ trợ nhiều kiểu dữ liệu từ API
 */
export function isMainImage(image: any): boolean {
  if (!image) return false;

  const flag = image.is_main;

  return (
    flag === 1 ||
    flag === true ||
    flag === '1' ||
    (typeof flag === 'string' && flag.toLowerCase() === 'true')
  );
}
