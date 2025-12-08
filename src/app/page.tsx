// import CategoriesPreview from "./components/check";
import LandingPage from "./components/LandingPage/LandingPage";
import { usePushNotifications } from "@/app/home/hooks/usePushNotifications";

export default function Home() {
  usePushNotifications();
  return (
    <div>
      <LandingPage /> 
      {/* <CategoriesPreview/>   */}
    </div>
  );
}
