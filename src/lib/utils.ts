import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ptBR });
  } catch {
    return '';
  }
}

export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return time;
  }
}

export function formatDateTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch {
    return '';
  }
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return '';
  }
}

export function calculateFrequencia(presencas: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((presencas / total) * 100);
}

export function isFrequenciaAlerta(frequencia: number, minimo = 75): boolean {
  return frequencia < minimo;
}

export function sortByName<T extends { nome?: string; nome_completo?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    const nameA = (a.nome || a.nome_completo || '').toLowerCase();
    const nameB = (b.nome || b.nome_completo || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

export function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function generateMatricula(): string {
  return `MAT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+55|55)?\d{11}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) return phone;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function getPaginationRange(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return {
    start,
    end,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function downloadFile(content: Blob, filename: string) {
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
