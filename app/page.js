'use client';
import React, { useEffect } from 'react';
import ModularCodeIDE from '../components/ModularCodeIDE';

export default function Home() {
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <ModularCodeIDE />
  );
}
