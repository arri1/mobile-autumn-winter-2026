const BASE_URL = 'http://185.233.185.109:8080/api/v1';

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

export async function createPost(title: string, content: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function updatePost(id: number, title: string, content: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
}