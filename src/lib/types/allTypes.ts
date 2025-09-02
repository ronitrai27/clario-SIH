export type DBMentor = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  linkedin: string | null;
  bio: string | null;
  expertise: string[];
  current_position: string;
  availability: boolean;
  rating: number;
  avatar: string | null;
  created_at: string;
  is_verified: boolean;
};