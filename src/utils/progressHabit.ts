export function getEncouragingMessage(percentage: number): string {
    if (percentage === 0) return "Let's start your day strong!";
    if (percentage < 25) return "Great start! Keep going!";
    if (percentage < 50) return "You're making progress!";
    if (percentage < 75) return "You're doing amazing!";
    if (percentage < 100) return "You're almost done!";
    return "Perfect! You crushed it today! 🎉";
}
