import { describe, it, expect, beforeEach } from 'vitest';
import { mockStudent, mockStudentList, mockCreateStudentData } from '../../fixtures/student.fixtures';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Students API Integration', () => {
  describe('GET /api/admin/alunos', () => {
    it('should fetch all students', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data).toHaveLength(mockStudentList.length);
      expect(data.count).toBe(mockStudentList.length);
    });

    it('should return array of students with correct structure', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos`);
      const data = await response.json();

      expect(Array.isArray(data.data)).toBe(true);
      if (data.data.length > 0) {
        const student = data.data[0];
        expect(student).toHaveProperty('id');
        expect(student).toHaveProperty('nome');
        expect(student).toHaveProperty('email');
        expect(student).toHaveProperty('matricula');
      }
    });
  });

  describe('GET /api/admin/alunos/:alunoId', () => {
    it('should fetch a specific student', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos/student-1`);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data).toHaveProperty('id', 'student-1');
      expect(data.data).toHaveProperty('nome', mockStudent.nome);
      expect(data.data).toHaveProperty('email', mockStudent.email);
    });

    it('should return 404 for non-existent student', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos/non-existent`);
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/admin/alunos', () => {
    it('should create a new student', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCreateStudentData),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('nome', mockCreateStudentData.nome);
      expect(data.data).toHaveProperty('email', mockCreateStudentData.email);
      expect(data.data).toHaveProperty('criado_em');
    });

    it('should include all provided fields in response', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCreateStudentData),
      });

      const data = await response.json();
      expect(data.data.nome).toBe(mockCreateStudentData.nome);
      expect(data.data.email).toBe(mockCreateStudentData.email);
      expect(data.data.matricula).toBe(mockCreateStudentData.matricula);
      expect(data.data.cpf).toBe(mockCreateStudentData.cpf);
      expect(data.data.turma_id).toBe(mockCreateStudentData.turma_id);
    });
  });

  describe('PATCH /api/admin/alunos/:alunoId', () => {
    it('should update an existing student', async () => {
      const updateData = {
        nome: 'João Silva Updated',
        email: 'joao.updated@example.com',
      };

      const response = await fetch(`${BASE_URL}/api/admin/alunos/student-1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.nome).toBe(updateData.nome);
      expect(data.data.email).toBe(updateData.email);
      expect(data.data).toHaveProperty('atualizado_em');
    });

    it('should preserve other fields when updating', async () => {
      const updateData = {
        email: 'newemail@example.com',
      };

      const response = await fetch(`${BASE_URL}/api/admin/alunos/student-1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      expect(data.data.nome).toBe(mockStudent.nome);
      expect(data.data.email).toBe(updateData.email);
    });
  });

  describe('DELETE /api/admin/alunos/:alunoId', () => {
    it('should delete a student', async () => {
      const response = await fetch(`${BASE_URL}/api/admin/alunos/student-1`, {
        method: 'DELETE',
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
