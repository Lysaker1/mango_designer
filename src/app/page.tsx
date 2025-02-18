'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Hello boys! 👋</h1>
      <p className="text-lg mb-8">We might have a landing page here</p>
      <p className="text-lg mb-8">Our main page is at /configurator</p>
      <button
        onClick={() => router.push('/configurator')}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Go to Configurator
      </button>
    </div>
  );
}
