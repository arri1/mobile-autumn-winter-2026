// Клиент API курса (go-server). Swagger: http://185.233.185.109:8080/swagger/index.html
const BASE_URL = 'http://185.233.185.109:8080/api/v1';

// База общая на всю группу: свои посты помечаю фамилией в заголовке
// и редактирую/удаляю только их.
export const AUTHOR_TAG = 'Свинобоев';

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string; // ISO-дата
  updated_at: string;
};

export type PostInput = {
  title: string;
  content: string;
};

// Сервер присылает ошибку как { "error": "пост не найден" } — показываю этот текст.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);

  if (!res.ok) {
    let message = `Ошибка ${res.status}`;
    try {
      const body = await res.json();
      if (body && typeof body.error === 'string') message = body.error;
    } catch {
      // тело не JSON — оставляем код ответа
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function getPosts(): Promise<Post[]> {
  return request<Post[]>('/posts');
}

export function getPost(id: number): Promise<Post> {
  return request<Post>(`/posts/${id}`);
}

export function createPost(input: PostInput): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function updatePost(id: number, input: PostInput): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function deletePost(id: number): Promise<void> {
  return request<void>(`/posts/${id}`, { method: 'DELETE' });
}

export function isMyPost(post: Post): boolean {
  return post.title.includes(AUTHOR_TAG);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
