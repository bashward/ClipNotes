'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authProvider';
import { Spinner } from './ui/spinner';

const Protected = ({ children }) => {
  const { authUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);

  if (loading || !authUser) {
    return <div className='h-[100vh] w-full flex justify-center items-center'><Spinner className='size-12 text-bg-primary'/></div>;
  }

  return <>{children}</>;
};

export default Protected;
