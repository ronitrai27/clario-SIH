/* eslint-disable @typescript-eslint/no-explicit-any */
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
  video_url: string | null;
};

export type DBUser =  {
  id: number;
  userName: string;
  userEmail: string;
  avatar: string;
  created_at: string;
  totalCredits: number;
  remainingCredits: number;
  invite_link: string;
  current_status: string;
  userPhone: string;
  institutionName: string;
  mainFocus: string;
  calendarConnected: boolean;
  is_verified: boolean;
  isQuizDone: boolean;
}

export type UserQuizData =  {
  id: number; 
  created_at: string; 
  quizInfo: Record<string, any>; //depends on user current_status and mainFocus
  userId: string; 
  user_current_status: string; 
  user_mainFocus: string; 
}

export type UserCalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  start: Date; // mapped from start_time
  end: Date;   // mapped from end_time
  created_at?: string;
  updated_at?: string;
};