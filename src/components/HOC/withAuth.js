"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthComponent(props) {
    const router = useRouter();
    const { isAuthenticated } = props;

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/auth/signin');
      }
    }, [isAuthenticated]);

    return <Component {...props} />;
  };
}