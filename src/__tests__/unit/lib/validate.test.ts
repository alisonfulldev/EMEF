import { describe, it, expect } from 'vitest';
import {
  validateRegistroChamada,
  validateNota,
  validateJustificativa,
  validateAluno,
  validateTurma,
  validateAula,
  validateAvaliacao,
  validateRequired,
  validateDateRange,
  validateExcelFile,
} from '@/lib/validate';

describe('Validate - Registro de Chamada', () => {
  describe('validateRegistroChamada', () => {
    it('should validate correct status', () => {
      expect(validateRegistroChamada('presença')).toBeNull();
      expect(validateRegistroChamada('falta')).toBeNull();
      expect(validateRegistroChamada('atraso')).toBeNull();
      expect(validateRegistroChamada('justificada')).toBeNull();
    });

    it('should reject invalid status', () => {
      const result = validateRegistroChamada('invalido');
      expect(result).not.toBeNull();
      expect(result?.field).toBe('status');
      expect(result?.message).toBe('Status de chamada inválido');
    });
  });
});

describe('Validate - Nota', () => {
  describe('validateNota', () => {
    it('should accept null/undefined notes', () => {
      expect(validateNota(null, 10)).toBeNull();
      expect(validateNota(undefined, 10)).toBeNull();
    });

    it('should validate valid grades', () => {
      expect(validateNota(5, 10)).toBeNull();
      expect(validateNota(0, 10)).toBeNull();
      expect(validateNota(10, 10)).toBeNull();
    });

    it('should reject NaN', () => {
      const result = validateNota(NaN, 10);
      expect(result?.field).toBe('nota');
      expect(result?.message).toBe('Nota deve ser um número');
    });

    it('should reject negative grades', () => {
      const result = validateNota(-1, 10);
      expect(result?.field).toBe('nota');
      expect(result?.message).toBe('Nota não pode ser negativa');
    });

    it('should reject grades above maximum', () => {
      const result = validateNota(11, 10);
      expect(result?.field).toBe('nota');
      expect(result?.message).toContain('não pode ser maior que 10');
    });

    it('should handle different maximum values', () => {
      expect(validateNota(8.5, 10)).toBeNull();
      expect(validateNota(85, 100)).toBeNull();
    });
  });
});

describe('Validate - Justificativa', () => {
  describe('validateJustificativa', () => {
    it('should reject missing date', () => {
      const result = validateJustificativa('', 'motivo válido com 10 chars');
      expect(result?.field).toBe('data_falta');
    });

    it('should reject future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const result = validateJustificativa(tomorrow.toISOString(), 'motivo válido');
      expect(result?.field).toBe('data_falta');
      expect(result?.message).toContain('não pode ser futura');
    });

    it('should reject missing reason', () => {
      const result = validateJustificativa('2024-01-15', '');
      expect(result?.field).toBe('motivo');
      expect(result?.message).toBe('Motivo é obrigatório');
    });

    it('should reject reason shorter than 10 characters', () => {
      const result = validateJustificativa('2024-01-15', 'short');
      expect(result?.field).toBe('motivo');
      expect(result?.message).toContain('pelo menos 10 caracteres');
    });

    it('should accept valid justification', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = validateJustificativa(
        yesterday.toISOString().split('T')[0],
        'Fui para consulta médica'
      );
      expect(result).toBeNull();
    });

    it('should trim whitespace from reason', () => {
      const result = validateJustificativa(
        '2024-01-15',
        '          1234567890          '
      );
      expect(result).toBeNull();
    });
  });
});

describe('Validate - Aluno', () => {
  describe('validateAluno', () => {
    it('should reject empty name', () => {
      const result = validateAluno('', 'MAT001');
      expect(result?.field).toBe('nome_completo');
      expect(result?.message).toBe('Nome completo é obrigatório');
    });

    it('should reject name shorter than 5 characters', () => {
      const result = validateAluno('João', 'MAT001');
      expect(result?.field).toBe('nome_completo');
      expect(result?.message).toContain('pelo menos 5 caracteres');
    });

    it('should reject empty matricula', () => {
      const result = validateAluno('João Silva', '');
      expect(result?.field).toBe('matricula');
    });

    it('should reject invalid numero_chamada', () => {
      const result = validateAluno('João Silva', 'MAT001', 0);
      expect(result?.field).toBe('numero_chamada');
      expect(result?.message).toContain('deve ser positivo');
    });

    it('should accept valid student data', () => {
      const result = validateAluno('João Silva', 'MAT001', 1);
      expect(result).toBeNull();
    });

    it('should accept valid student without numero_chamada', () => {
      const result = validateAluno('João Silva', 'MAT001');
      expect(result).toBeNull();
    });
  });
});

describe('Validate - Turma', () => {
  describe('validateTurma', () => {
    it('should reject empty name', () => {
      const result = validateTurma('', 'matutino');
      expect(result?.field).toBe('nome');
    });

    it('should reject invalid turno', () => {
      const result = validateTurma('5º Ano A', 'invalido');
      expect(result?.field).toBe('turno');
      expect(result?.message).toBe('Turno inválido');
    });

    it('should accept valid turnos', () => {
      expect(validateTurma('5º Ano A', 'matutino')).toBeNull();
      expect(validateTurma('5º Ano A', 'vespertino')).toBeNull();
      expect(validateTurma('5º Ano A', 'noturno')).toBeNull();
    });

    it('should accept valid class data', () => {
      const result = validateTurma('5º Ano A', 'matutino');
      expect(result).toBeNull();
    });
  });
});

describe('Validate - Aula', () => {
  describe('validateAula', () => {
    it('should reject missing date', () => {
      const result = validateAula('', '08:00', '09:00');
      expect(result?.field).toBe('data');
    });

    it('should reject missing start time', () => {
      const result = validateAula('2024-01-15', '', '09:00');
      expect(result?.field).toBe('horario_inicio');
    });

    it('should reject missing end time', () => {
      const result = validateAula('2024-01-15', '08:00', '');
      expect(result?.field).toBe('horario_fim');
    });

    it('should reject invalid time range', () => {
      const result = validateAula('2024-01-15', '09:00', '08:00');
      expect(result?.field).toBe('horario_fim');
      expect(result?.message).toContain('após horário inicial');
    });

    it('should reject equal times', () => {
      const result = validateAula('2024-01-15', '08:00', '08:00');
      expect(result?.field).toBe('horario_fim');
    });

    it('should accept valid lesson data', () => {
      const result = validateAula('2024-01-15', '08:00', '09:00');
      expect(result).toBeNull();
    });

    it('should handle different time formats', () => {
      const result = validateAula('2024-01-15', '07:30', '08:30');
      expect(result).toBeNull();
    });
  });
});

describe('Validate - Avaliação', () => {
  describe('validateAvaliacao', () => {
    it('should reject empty title', () => {
      const result = validateAvaliacao('', 'prova', '2024-01-15', 10);
      expect(result?.field).toBe('titulo');
    });

    it('should reject invalid type', () => {
      const result = validateAvaliacao('Prova 1', 'invalido', '2024-01-15', 10);
      expect(result?.field).toBe('tipo');
      expect(result?.message).toBe('Tipo de avaliação inválido');
    });

    it('should accept valid types', () => {
      const validTypes = ['prova', 'trabalho', 'participacao', 'outro'];
      for (const type of validTypes) {
        expect(validateAvaliacao('Prova 1', type, '2024-01-15', 10)).toBeNull();
      }
    });

    it('should reject missing date', () => {
      const result = validateAvaliacao('Prova 1', 'prova', '', 10);
      expect(result?.field).toBe('data_aplicacao');
    });

    it('should reject invalid max value', () => {
      expect(validateAvaliacao('Prova 1', 'prova', '2024-01-15', 0)?.field).toBe('valor_maximo');
      expect(validateAvaliacao('Prova 1', 'prova', '2024-01-15', -5)?.field).toBe('valor_maximo');
    });

    it('should reject max value above 100', () => {
      const result = validateAvaliacao('Prova 1', 'prova', '2024-01-15', 101);
      expect(result?.field).toBe('valor_maximo');
      expect(result?.message).toContain('não pode exceder 100');
    });

    it('should accept valid evaluation data', () => {
      const result = validateAvaliacao('Prova 1', 'prova', '2024-01-15', 10);
      expect(result).toBeNull();
    });
  });
});

describe('Validate - Required', () => {
  describe('validateRequired', () => {
    it('should reject null/undefined/empty values', () => {
      expect(validateRequired(null, 'field')).not.toBeNull();
      expect(validateRequired(undefined, 'field')).not.toBeNull();
      expect(validateRequired('', 'field')).not.toBeNull();
    });

    it('should accept non-empty values', () => {
      expect(validateRequired('value', 'field')).toBeNull();
      expect(validateRequired(123, 'field')).toBeNull();
    });

    it('should check minimum length', () => {
      const result = validateRequired('abc', 'field', 5);
      expect(result).not.toBeNull();
      expect(result?.message).toContain('pelo menos 5 caracteres');
    });

    it('should accept strings with enough length', () => {
      expect(validateRequired('abcde', 'field', 5)).toBeNull();
    });
  });
});

describe('Validate - Date Range', () => {
  describe('validateDateRange', () => {
    it('should accept date within range', () => {
      const result = validateDateRange('2024-01-15', '2024-01-01', '2024-01-31');
      expect(result).toBeNull();
    });

    it('should reject date before range', () => {
      const result = validateDateRange('2023-12-31', '2024-01-01', '2024-01-31');
      expect(result).not.toBeNull();
    });

    it('should reject date after range', () => {
      const result = validateDateRange('2024-02-01', '2024-01-01', '2024-01-31');
      expect(result).not.toBeNull();
    });

    it('should accept date at range boundaries', () => {
      expect(validateDateRange('2024-01-01', '2024-01-01', '2024-01-31')).toBeNull();
      expect(validateDateRange('2024-01-31', '2024-01-01', '2024-01-31')).toBeNull();
    });
  });
});

describe('Validate - Excel File', () => {
  describe('validateExcelFile', () => {
    it('should accept valid xlsx file', () => {
      const file = new File(
        ['content'],
        'test.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      expect(validateExcelFile(file)).toBeNull();
    });

    it('should accept valid xls file', () => {
      const file = new File(
        ['content'],
        'test.xls',
        { type: 'application/vnd.ms-excel' }
      );
      expect(validateExcelFile(file)).toBeNull();
    });

    it('should reject non-excel file', () => {
      const file = new File(
        ['content'],
        'test.txt',
        { type: 'text/plain' }
      );
      const result = validateExcelFile(file);
      expect(result).not.toBeNull();
      expect(result?.message).toContain('Excel');
    });

    it('should reject files larger than 10MB', () => {
      const largeContent = new Uint8Array(11 * 1024 * 1024);
      const file = new File(
        [largeContent],
        'large.xlsx',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      );
      const result = validateExcelFile(file);
      expect(result).not.toBeNull();
      expect(result?.message).toContain('10MB');
    });
  });
});
