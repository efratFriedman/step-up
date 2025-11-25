'use client'; // חובה בגלל useRouter

import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import ErrorPageLayout from '../components/ErrorPageLayout/ErrorPageLayout'; 
import { ROUTES } from '@/config/routes';

export default function UnauthenticatedError() {
  const router = useRouter();
  
  const handleLoginRedirect = () => {
    router.push(ROUTES.LOGIN); 
  };

  return (
    <ErrorPageLayout
      title="STEPUP: Access Denied (401)"
      description="To continue tracking your progress and habits, you must be logged in. Step up and sign in!"
      buttonText="Sign In to Continue"
      onButtonClick={handleLoginRedirect} 
      icon={<LogIn size={64} strokeWidth={1.5} />}
    />
  );
}