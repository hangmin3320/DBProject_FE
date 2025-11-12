'use client';

import { useState, useEffect } from 'react';

export default function HashtagPage() {
  const [HashtagPageComponent, setHashtagPageComponent] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the client component after mounting
    import('./page.client').then((module) => {
      setHashtagPageComponent(() => module.default);
    });
  }, []);

  if (HashtagPageComponent) {
    return <HashtagPageComponent />;
  }

  // Render a loading state while the client component loads
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading...</p>
    </main>
  );
}