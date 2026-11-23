const BASE_URL = 'http://185.233.185.109:8080/api/v1';

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type PostPayload = Pick<Post, 'title' | 'content'>; // Тип для создания и обновления (без системных полей id, created_at, updated_at)

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

export async function createPost(data: PostPayload): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}

export async function updatePost(id: number, data: Partial<PostPayload>): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT', // Если бэкенд принимает частичное обновление, можно заменить на 'PATCH'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Ошибка ${res.status}`);
  return res.json();
}