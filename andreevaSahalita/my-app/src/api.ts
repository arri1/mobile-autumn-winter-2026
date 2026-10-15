const BASE_URL = 'http://185.233.185.109:8080/api/v1';

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// Получение списка всех постов
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }
  return response.json();
}

// Получение одного поста по ID
export async function getPost(id: number): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  if (!response.ok) {
    throw new Error(`Пост не найден`);
  }
  return response.json();
}