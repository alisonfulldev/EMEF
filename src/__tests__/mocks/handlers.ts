import { http, HttpResponse } from 'msw';
import { mockStudent, mockStudentList, mockGradeRecord, mockAttendanceRecord } from '../fixtures/student.fixtures';
import { mockClass, mockClassList, mockSubjectList } from '../fixtures/class.fixtures';
import { mockUser, mockLoginResponse } from '../fixtures/auth.fixtures';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const handlers = [
  // Auth endpoints
  http.post(`${BASE_URL}/api/auth/signup`, async () => {
    return HttpResponse.json(
      {
        user: mockUser,
        session: mockLoginResponse.session,
      },
      { status: 201 }
    );
  }),

  http.post(`${BASE_URL}/api/auth/login`, async () => {
    return HttpResponse.json(mockLoginResponse, { status: 200 });
  }),

  http.post(`${BASE_URL}/api/auth/logout`, async () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  http.get(`${BASE_URL}/api/auth/user`, async () => {
    return HttpResponse.json({ user: mockUser }, { status: 200 });
  }),

  // Students endpoints
  http.get(`${BASE_URL}/api/admin/alunos`, async () => {
    return HttpResponse.json(
      {
        data: mockStudentList,
        count: mockStudentList.length,
      },
      { status: 200 }
    );
  }),

  http.get(`${BASE_URL}/api/admin/alunos/:alunoId`, async ({ params }) => {
    if (params.alunoId === 'student-1') {
      return HttpResponse.json({ data: mockStudent }, { status: 200 });
    }
    return HttpResponse.json(
      { error: 'Aluno não encontrado' },
      { status: 404 }
    );
  }),

  http.post(`${BASE_URL}/api/admin/alunos`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          id: 'new-student-id',
          ...body,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.patch(`${BASE_URL}/api/admin/alunos/:alunoId`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          ...mockStudent,
          ...body,
          atualizado_em: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  }),

  http.delete(`${BASE_URL}/api/admin/alunos/:alunoId`, async () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Classes endpoints
  http.get(`${BASE_URL}/api/admin/turmas`, async () => {
    return HttpResponse.json(
      {
        data: mockClassList,
        count: mockClassList.length,
      },
      { status: 200 }
    );
  }),

  http.get(`${BASE_URL}/api/admin/turmas/:turmaId`, async ({ params }) => {
    if (params.turmaId === 'class-1') {
      return HttpResponse.json({ data: mockClass }, { status: 200 });
    }
    return HttpResponse.json(
      { error: 'Turma não encontrada' },
      { status: 404 }
    );
  }),

  http.post(`${BASE_URL}/api/admin/turmas`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          id: 'new-class-id',
          ...body,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.patch(`${BASE_URL}/api/admin/turmas/:turmaId`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          ...mockClass,
          ...body,
          atualizado_em: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  }),

  http.delete(`${BASE_URL}/api/admin/turmas/:turmaId`, async () => {
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Subjects endpoints
  http.get(`${BASE_URL}/api/admin/disciplinas`, async () => {
    return HttpResponse.json(
      {
        data: mockSubjectList,
        count: mockSubjectList.length,
      },
      { status: 200 }
    );
  }),

  // Attendance endpoints
  http.post(`${BASE_URL}/api/professor/chamada`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          id: 'new-attendance-id',
          ...body,
          criado_em: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/api/professor/chamada/:aulaId`, async () => {
    return HttpResponse.json(
      {
        data: [mockAttendanceRecord],
      },
      { status: 200 }
    );
  }),

  // Grades endpoints
  http.post(`${BASE_URL}/api/professor/notas`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          id: 'new-grade-id',
          ...body,
          criado_em: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/api/professor/notas/:alunoId`, async () => {
    return HttpResponse.json(
      {
        data: [mockGradeRecord],
      },
      { status: 200 }
    );
  }),

  http.patch(`${BASE_URL}/api/professor/notas/:notaId`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        data: {
          ...mockGradeRecord,
          ...body,
        },
      },
      { status: 200 }
    );
  }),
];
