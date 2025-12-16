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
    steps.push({
        id: "add-habit",
        title: "Add Habit",
        text: hasHabits
            ? "Tap + anytime to create more habits."
            : "Let’s create your first habit!",
        selector: "#onboarding-add-habit-button",
        position: "top",
    });

    steps.push({
        id: "today-habits-explain",
        title: "Your Habits Area",
        text: "Here you can see all the habits planned for selected date.",
        selector: "#onboarding-today-habits",
        position: "top",
    });

    return steps;
}
