export function homeSteps(hasHabits: boolean) {
  const steps: any[] = [];

  steps.push({
    id: "welcome",
    title: "Welcome to StepUp! 🌱",
    text: "Let's take a quick tour!",
  });

  steps.push({
    id: "progress-bar",
    title: "Daily Progress",
    text: "Here you can track how many habits you completed today.",
    selector: "#onboarding-progress-bar",
    position: "bottom",
  });

  steps.push({
    id: "days-slider",
    title: "Switch Days",
    text: "Tap a day to view its habits.",
    selector: "#onboarding-days-slider",
    position: "bottom",
  });

  // ⭐ שלב חדש — הסבר על אזור ההרגלים
  steps.push({
    id: "today-habits-explain",
    title: "Your Habits Area",
    text: hasHabits
      ? "Here you can see all the habits planned for today."
      : "Here is where your habits will appear. We added two example habits so you can see how it works!",
    selector: "#onboarding-today-habits",
    position: "top",
  });

  // ⭐ אם יש הרגלים אמיתיים — הדגש נוסף
  if (hasHabits) {
    steps.push({
      id: "today-habits",
      title: "Today's Habits",
      text: "These are your habits for today. Tap one to mark it as done.",
      selector: "#onboarding-today-habits",
      position: "top",
    });
  }

  steps.push({
    id: "add-habit",
    title: "Add Habit",
    text: hasHabits
      ? "Tap + anytime to create more habits."
      : "Let’s create your first habit!",
    selector: "#onboarding-add-habit-button",
    position: "top",
  });

  return steps;
}
