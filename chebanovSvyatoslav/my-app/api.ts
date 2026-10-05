const BASE_URL = 'https://jsonplaceholder.typicode.com';

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export type CreatePostPayload = {
  title: string;
  body: string;
  userId: number;
};

/** GET /posts?_limit=20 */
export async function getPosts(limit = 20): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки постов: ${res.status}`);
  }
  return res.json();
}

/** GET /posts/{id} */
export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  if (!res.ok) {
    throw new Error(`Ошибка загрузки поста: ${res.status}`);
  }
  return res.json();
}

/** POST /posts */
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Ошибка создания поста: ${res.status}`);
  }
  return res.json();
}