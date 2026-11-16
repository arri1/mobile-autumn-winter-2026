const baseUrl = (process.env.EXPO_PUBLIC_POSTS_API_URL || 'http://185.233.185.109:8080/api/v1').replace(/\/+$/, '');

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && Number.isSafeInteger(value.id) &&
    'title' in value && typeof value.title === 'string' &&
    'content' in value && typeof value.content === 'string' &&
    'created_at' in value && typeof value.created_at === 'string';
}

async function read(path: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(`${baseUrl}${path}`, { method: 'GET', signal });
  if (response.status === 404 && path !== '/posts') throw new Error('Пост не найден (404).');
  if (!response.ok) throw new Error(`Сервер вернул ошибку ${response.status}.`);
  return response.json();
}

export async function getPosts(signal: AbortSignal): Promise<Post[]> {
  const data = await read('/posts', signal);
  if (!Array.isArray(data) || !data.every(isPost)) throw new Error('Сервер вернул некорректный список постов.');
  return data;
}

export async function getPost(id: number, signal: AbortSignal): Promise<Post> {
  const data = await read(`/posts/${id}`, signal);
  if (!isPost(data) || data.id !== id) throw new Error('Сервер вернул некорректные данные поста.');
  return data;
}

export async function createPost(title: string, content: string, signal: AbortSignal): Promise<Post> {
  const response = await fetch(`${baseUrl}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
    signal,
  });
  if (response.status === 400) throw new Error('Сервер отклонил пост. Проверь заголовок и текст.');
  if (!response.ok) throw new Error(`Сервер вернул ошибку ${response.status}. Проверь ленту перед повторной отправкой.`);

  const post: unknown = await response.json().catch(() => null);
  if (!isPost(post)) throw new Error('Сервер прислал неожиданный ответ. Проверь ленту перед повторной отправкой.');
  return post;
}

export function formatPostDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return 'Дата не указана';
  return date.toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
