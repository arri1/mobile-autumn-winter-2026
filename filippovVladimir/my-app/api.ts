const BASE_URL = 'http://185.233.185.109:8080/api/v1';

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) return false;
  const post = value as Record<string, unknown>;
  return typeof post.id === 'number' && Number.isInteger(post.id) &&
    typeof post.title === 'string' && typeof post.content === 'string' &&
    typeof post.created_at === 'string' && typeof post.updated_at === 'string';
}

async function getJson(response: Response): Promise<unknown> {
  if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
  try {
    return await response.json();
  } catch {
    throw new Error('Сервер вернул некорректный ответ');
  }
}

export async function getPosts(signal?: AbortSignal): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`, { signal });
  const data = await getJson(response);
  if (!Array.isArray(data) || !data.every(isPost)) {
    throw new Error('Сервер вернул список постов в неизвестном формате');
  }
  return data;
}

export async function getPost(id: number, signal?: AbortSignal): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { signal });
  const data: unknown = await getJson(response);
  if (!isPost(data)) throw new Error('Сервер вернул пост в неизвестном формате');
  return data;
}
