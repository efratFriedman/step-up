export function getInsightMessage(streak: number, achievements: number, completed: number) {
    if (streak > 3) {
        return "You're in a great series! Keep up the good work!💪🔥";
      }
    
      if (streak > 0) {
        return `Well done! You've been on a streak for ${streak} days now✨`;
      }
    
      if (completed >= 5) {
        return `You completed ${completed} tasks today! That's amazing, maybe add a little something before bed? 🙂`;
      }
    
      if (completed > 0) {
        return `Great! You've ticked off ${completed} habits today. One more little one and you'll have a super successful day! 🌼`;
      }
    
      return "You didn't mark your feet today... that's okay! Tomorrow is a new opportunity🌱";
    }