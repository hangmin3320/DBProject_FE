'use client';

import { useState, useEffect } from 'react';
import { Navbar as NavbarComponent } from './Navbar';

// 클라이언트 전용으로 Navbar를 렌더링하는 래퍼 컴포넌트
export default function NavbarWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // 서버 사이드에서는 빈 div만 렌더링
    return <div className="bg-white shadow-md h-16" />;
  }

  return <NavbarComponent />;
}