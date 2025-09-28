
export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}
