'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/useUserStore';
import { MapPinOff } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import ErrorPageLayout from './components/ErrorPageLayout/ErrorPageLayout';

export default function NotFound() {
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;

  const handleBack = () => {
    if (isAuthenticated) {
      router.push(ROUTES.HOME);
    } else {
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <ErrorPageLayout
      title="STEPUP: Lost Your Way? (404)"
      description="It looks like you've missed a step. The page you were looking for doesn't exist."
      buttonText="Go Back"
      onButtonClick={handleBack}
      icon={<MapPinOff size={64} strokeWidth={1.5} />}
    />
  );
}
