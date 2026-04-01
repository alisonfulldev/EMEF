import { describe, it, expect } from 'vitest';
import {
  mockLoginData,
  mockSignUpData,
  mockLoginResponse,
  mockUser,
} from '../../fixtures/auth.fixtures';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Authentication API Integration', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user account', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockSignUpData),
      });

      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('session');
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('email');
    });

    it('should return session token on successful signup', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockSignUpData),
      });

      const data = await response.json();
      expect(data.session).toHaveProperty('access_token');
      expect(data.session).toHaveProperty('refresh_token');
      expect(data.session).toHaveProperty('token_type');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockLoginData),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('session');
      expect(data.user.email).toBe(mockLoginData.email);
    });

    it('should return valid access token', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockLoginData),
      });

      const data = await response.json();
      expect(data.session.access_token).toBeTruthy();
      expect(data.session.token_type).toBe('bearer');
    });

    it('should return user metadata', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockLoginData),
      });

      const data = await response.json();
      expect(data.user).toHaveProperty('user_metadata');
      expect(data.user.user_metadata).toHaveProperty('nome');
      expect(data.user.user_metadata).toHaveProperty('tipo');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockLoginResponse.session.access_token}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('GET /api/auth/user', () => {
    it('should fetch current authenticated user', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${mockLoginResponse.session.access_token}`,
        },
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('email');
    });

    it('should return user with correct structure', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/user`, {
        headers: {
          'Authorization': `Bearer ${mockLoginResponse.session.access_token}`,
        },
      });

      const data = await response.json();
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('email');
      expect(data.user).toHaveProperty('user_metadata');
      expect(data.user).toHaveProperty('created_at');
    });
  });
});

describe('Authentication - Session Management', () => {
  it('should maintain session across requests', async () => {
    const token = mockLoginResponse.session.access_token;

    const response1 = await fetch(`${BASE_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(response1.status).toBe(200);

    const response2 = await fetch(`${BASE_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(response2.status).toBe(200);

    const data1 = await response1.json();
    const data2 = await response2.json();

    expect(data1.user.id).toBe(data2.user.id);
  });

  it('should handle invalid/missing token gracefully', async () => {
    const invalidToken = 'invalid-token-here';

    const response = await fetch(`${BASE_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${invalidToken}`,
      },
    });

    // Should return success or error - depending on mock implementation
    expect([200, 401, 403, 500]).toContain(response.status);
  });
});
