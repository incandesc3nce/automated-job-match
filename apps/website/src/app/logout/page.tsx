'use client';

import { logout } from './actions/logout';
import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    logout();
  }, []);

  return (
    <div>
      <p>Вы вышли из системы. Пожалуйста, подождите...</p>
    </div>
  );
}
