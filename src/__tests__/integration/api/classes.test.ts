import { describe, it, expect } from 'vitest';
import { mockClass, mockClassList, mockCreateClassData } from '../../fixtures/class.fixtures';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Classes API Integration', () => {
  describe('GET /api/admin/turmas', () => {
    it('should fetch all classes', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data).toHaveLength(mockClassList.length);
      expect(data.count).toBe(mockClassList.length);
    });

    it('should return array of classes with correct structure', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas`);
      const data = await response.json();

      expect(Array.isArray(data.data)).toBe(true);
      if (data.data.length > 0) {
        const classItem = data.data[0];
        expect(classItem).toHaveProperty('id');
        expect(classItem).toHaveProperty('nome');
        expect(classItem).toHaveProperty('serie');
        expect(classItem).toHaveProperty('turno');
        expect(classItem).toHaveProperty('professor_id');
      }
    });
  });

  describe('GET /api/admin/turmas/:turmaId', () => {
    it('should fetch a specific class', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas/class-1`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data).toHaveProperty('id', 'class-1');
      expect(data.data).toHaveProperty('nome', mockClass.nome);
      expect(data.data).toHaveProperty('serie', mockClass.serie);
    });

    it('should return 404 for non-existent class', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas/non-existent`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/admin/turmas', () => {
    it('should create a new class', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCreateClassData),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('nome', mockCreateClassData.nome);
      expect(data.data).toHaveProperty('serie', mockCreateClassData.serie);
      expect(data.data).toHaveProperty('turno', mockCreateClassData.turno);
      expect(data.data).toHaveProperty('criado_em');
    });

    it('should include all required fields in response', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCreateClassData),
      });

      const data = await response.json();
      expect(data.data.nome).toBe(mockCreateClassData.nome);
      expect(data.data.ano_letivo).toBe(mockCreateClassData.ano_letivo);
      expect(data.data.serie).toBe(mockCreateClassData.serie);
      expect(data.data.professor_id).toBe(mockCreateClassData.professor_id);
      expect(data.data.capacidade).toBe(mockCreateClassData.capacidade);
    });
  });

  describe('PATCH /api/admin/turmas/:turmaId', () => {
    it('should update an existing class', async () => {
      const updateData = {
        nome: '5º Ano A - Atualizado',
        professor_id: 'teacher-2',
      };

      const response = await fetch(`${BASE_URL}/api/admin/turmas/class-1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.nome).toBe(updateData.nome);
      expect(data.data.professor_id).toBe(updateData.professor_id);
      expect(data.data).toHaveProperty('atualizado_em');
    });

    it('should preserve other fields when updating', async () => {
      const updateData = {
        capacidade: 32,
      };

      const response = await fetch(`${BASE_URL}/api/admin/turmas/class-1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      expect(data.data.nome).toBe(mockClass.nome);
      expect(data.data.serie).toBe(mockClass.serie);
      expect(data.data.capacidade).toBe(updateData.capacidade);
    });
  });

  describe('DELETE /api/admin/turmas/:turmaId', () => {
    it('should delete a class', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/turmas/class-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/admin/disciplinas', () => {
    it('should fetch all subjects', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/disciplinas`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should return subjects with correct structure', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/disciplinas`);
      const data = await response.json();

      if (data.data.length > 0) {
        const subject = data.data[0];
        expect(subject).toHaveProperty('id');
        expect(subject).toHaveProperty('nome');
        expect(subject).toHaveProperty('codigo');
        expect(subject).toHaveProperty('professor_id');
      }
    });
  });
});
