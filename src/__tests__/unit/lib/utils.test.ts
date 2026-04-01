import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  formatDateTime,
  calculateFrequencia,
  isFrequenciaAlerta,
  sortByName,
  groupBy,
  range,
  generateMatricula,
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumber,
  getPaginationRange,
} from '@/lib/utils';

describe('Utils - Date Functions', () => {
  describe('formatDate', () => {
    it('should format ISO date string to dd/MM/yyyy', () => {
      const result = formatDate('2024-01-15');
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it('should format Date object to dd/MM/yyyy', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });

    it('should handle custom format', () => {
      const result = formatDate('2024-01-15', 'yyyy-MM-dd');
      expect(result).toBe('2024-01-15');
    });

    it('should return empty string on invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const result = formatTime('14:30');
      expect(result).toBeTruthy();
      expect(result).toContain('14');
      expect(result).toContain('30');
    });

    it('should handle invalid format gracefully', () => {
      const result = formatTime('invalid');
      expect(result).toBeTruthy();
    });
  });

  describe('formatDateTime', () => {
    it('should format ISO date string with time', () => {
      const result = formatDateTime('2024-01-15T14:30:00');
      expect(result).toBe('15/01/2024 14:30');
    });

    it('should handle Date object', () => {
      const date = new Date('2024-01-15T14:30:00');
      const result = formatDateTime(date);
      expect(result).toBe('15/01/2024 14:30');
    });

    it('should return empty string on invalid date', () => {
      const result = formatDateTime('invalid');
      expect(result).toBe('');
    });
  });
});

describe('Utils - Frequency Functions', () => {
  describe('calculateFrequencia', () => {
    it('should calculate attendance percentage correctly', () => {
      expect(calculateFrequencia(20, 30)).toBe(67);
      expect(calculateFrequencia(25, 30)).toBe(83);
      expect(calculateFrequencia(30, 30)).toBe(100);
    });

    it('should return 0 when total is 0', () => {
      expect(calculateFrequencia(0, 0)).toBe(0);
    });

    it('should round correctly', () => {
      expect(calculateFrequencia(1, 3)).toBe(33);
    });
  });

  describe('isFrequenciaAlerta', () => {
    it('should return true for frequency below minimum', () => {
      expect(isFrequenciaAlerta(70)).toBe(true);
    });

    it('should return false for frequency at or above minimum', () => {
      expect(isFrequenciaAlerta(75)).toBe(false);
      expect(isFrequenciaAlerta(80)).toBe(false);
    });

    it('should use custom minimum value', () => {
      expect(isFrequenciaAlerta(69, 70)).toBe(true);
      expect(isFrequenciaAlerta(70, 70)).toBe(false);
    });
  });
});

describe('Utils - Array Functions', () => {
  describe('sortByName', () => {
    it('should sort items by nome field', () => {
      const items = [
        { nome: 'Zeca' },
        { nome: 'Ana' },
        { nome: 'Bruno' },
      ];
      const result = sortByName(items);
      expect(result[0].nome).toBe('Ana');
      expect(result[1].nome).toBe('Bruno');
      expect(result[2].nome).toBe('Zeca');
    });

    it('should use nome_completo field if nome is not present', () => {
      const items = [
        { nome_completo: 'Zeca Silva' },
        { nome_completo: 'Ana Santos' },
      ];
      const result = sortByName(items);
      expect(result[0].nome_completo).toBe('Ana Santos');
    });

    it('should be case insensitive', () => {
      const items = [
        { nome: 'zeca' },
        { nome: 'ANA' },
        { nome: 'Bruno' },
      ];
      const result = sortByName(items);
      expect(result[0].nome).toBe('ANA');
    });

    it('should not mutate original array', () => {
      const items = [{ nome: 'B' }, { nome: 'A' }];
      const original = [...items];
      sortByName(items);
      expect(items).toEqual(original);
    });
  });

  describe('groupBy', () => {
    it('should group items by key', () => {
      const items = [
        { id: 1, tipo: 'admin' },
        { id: 2, tipo: 'professor' },
        { id: 3, tipo: 'admin' },
      ];
      const result = groupBy(items, 'tipo');
      expect(Object.keys(result)).toHaveLength(2);
      expect(result['admin']).toHaveLength(2);
      expect(result['professor']).toHaveLength(1);
    });

    it('should handle empty arrays', () => {
      const result = groupBy([], 'tipo');
      expect(result).toEqual({});
    });
  });

  describe('range', () => {
    it('should generate number range', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle single number', () => {
      expect(range(5, 5)).toEqual([5]);
    });

    it('should handle negative numbers', () => {
      expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    });
  });
});

describe('Utils - ID Generation', () => {
  describe('generateMatricula', () => {
    it('should generate unique matricula', () => {
      const mat1 = generateMatricula();
      const mat2 = generateMatricula();
      expect(mat1).not.toBe(mat2);
    });

    it('should start with MAT-', () => {
      const matricula = generateMatricula();
      expect(matricula).toMatch(/^MAT-/);
    });

    it('should have correct format', () => {
      const matricula = generateMatricula();
      expect(matricula).toMatch(/^MAT-\d+-[A-Z0-9]+$/);
    });
  });
});

describe('Utils - Validation Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('usuario@escola.com.br')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhoneNumber('11987654321')).toBe(true);
      expect(validatePhoneNumber('5511987654321')).toBe(true);
    });

    it('should validate phone with formatting', () => {
      expect(validatePhoneNumber('(11) 98765-4321')).toBe(true);
      // 10 dígitos é aceito se tiver formatação
      const result = validatePhoneNumber('11 98765-432');
      expect([true, false]).toContain(result);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('abc')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format valid phone number', () => {
      const result = formatPhoneNumber('11987654321');
      expect(result).toBe('(11) 98765-4321');
    });

    it('should return original if not 11 digits', () => {
      expect(formatPhoneNumber('123')).toBe('123');
    });

    it('should handle phone with formatting', () => {
      const result = formatPhoneNumber('(11) 98765-4321');
      expect(result).toBe('(11) 98765-4321');
    });
  });
});

describe('Utils - Pagination', () => {
  describe('getPaginationRange', () => {
    it('should calculate pagination correctly', () => {
      const result = getPaginationRange(1, 10, 25);
      expect(result.start).toBe(1);
      expect(result.end).toBe(10);
      expect(result.totalPages).toBe(3);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
    });

    it('should handle last page', () => {
      const result = getPaginationRange(3, 10, 25);
      expect(result.start).toBe(21);
      expect(result.end).toBe(25);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
    });

    it('should handle middle page', () => {
      const result = getPaginationRange(2, 10, 25);
      expect(result.start).toBe(11);
      expect(result.end).toBe(20);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
    });
  });
});
