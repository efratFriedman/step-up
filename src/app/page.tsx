import LoginForm from "./components/User/LoginForm/LoginForm";
import NewHabit from "./components/Habit/AddHabit/NewHabit/NewHabit";

export default function Home() {
  return (
    <div>

      <LoginForm />

      <NewHabit/>
    </div>
  );
}
