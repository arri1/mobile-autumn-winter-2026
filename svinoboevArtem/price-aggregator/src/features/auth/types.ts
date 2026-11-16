export type OtpChannel = 'email' | 'phone';

export type UserProfile = {
  id: string;
  email: string | null;
  phone: string | null;
  display_name: string | null;
  role: 'user' | 'moderator' | 'admin';
};
