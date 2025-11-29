'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [ProfilePageComponent, setProfilePageComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the client component after mounting
    import('./page.client').then((module) => {
      setProfilePageComponent(() => module.default);
    });
  }, []);

  if (ProfilePageComponent) {
    return <ProfilePageComponent />;
  }

  // Render a loading state while the client component loads
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>로딩 중...</p>
    </main>
  );
}