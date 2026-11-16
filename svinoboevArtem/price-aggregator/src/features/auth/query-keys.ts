/** Всё, что относится к текущему пользователю, живёт под этим ключом и чистится при смене сессии. */
export const meKeys = {
  all: ['me'] as const,
  profile: () => [...meKeys.all, 'profile'] as const,
};
