export interface ITodayHabit {
  _id: string;
  name: string;
  isDone: boolean;
  size?: 'small' | 'medium' | 'large';
  category: {
    name: string;
    colorTheme?: string; 
    image?: string;     
  };
}
