'use client';
import React, { useEffect } from 'react';
import CodeIDE from '../components/CodeIDE';

export default function Home() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <CodeIDE />
  );
}
