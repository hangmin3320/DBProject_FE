'use client';

import React from 'react';
import Link from 'next/link';

interface HashtagLinkProps {
  tag: string;
}

const HashtagLink = ({ tag }: HashtagLinkProps) => {
  return (
    <Link 
      href={`/tags/${tag}`}
      className="text-blue-600 hover:underline"
    >
      #{tag}
    </Link>
  );
};

export { HashtagLink };