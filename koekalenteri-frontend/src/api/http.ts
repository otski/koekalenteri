export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8080'

async function http<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(API_BASE_URL + path, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json().catch(() => ({}));
}

const HTTP = {
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return http<T>(path, { method: 'get', ...init });
  },
  async post<T, U>(path: string, body: T, init?: RequestInit): Promise<U> {
    return http<U>(path, { method: 'post', body: JSON.stringify(body), ...init });
  },
  async put<T, U>(path: string, body: T, init?: RequestInit): Promise<U> {
    return http<U>(path, { method: 'put', body: JSON.stringify(body), ...init });
  },
  async delete<T, U>(path: string, body: T, init?: RequestInit): Promise<U> {
    return http<U>(path, { method: 'delete', body: JSON.stringify(body), ...init });
  }
};

export default HTTP;
