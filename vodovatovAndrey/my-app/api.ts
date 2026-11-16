
const BASE_URL = "http://185.233.185.109:8080/api/v1";

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`);

  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }

  return res.json();
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);

  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }

  return res.json();
}

export async function createPost(
  title: string,
  content: string
): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      title:title, 
      content:content 
    }),
  });

  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }

  return res.json();
}

export async function updatePost(
  id: number,
  title: string,
  content: string
): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      title:title, 
      content:content 
    }),
  });

  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }

  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
  }); 
  if (!res.ok) {
    throw new Error(`Ошибка ${res.status}`);
  }
}