'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [authTest, setAuthTest] = useState<string>('');

  const testProviders = async () => {
    try {
      const response = await fetch('/api/auth/providers');
      const providers = await response.json();
      setAuthTest(JSON.stringify(providers, null, 2));
    } catch (error) {
      setAuthTest(`Error: ${error}`);
    }
  };

  const testSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const sessionData = await response.json();
      setAuthTest(JSON.stringify(sessionData, null, 2));
    } catch (error) {
      setAuthTest(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">NextAuth Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Session Status</h2>
            <p>Status: {status}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Session Data</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => signIn('google')}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Sign In with Google
            </button>
            <button 
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <button 
              onClick={testProviders}
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            >
              Test Providers API
            </button>
            <button 
              onClick={testSession}
              className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
            >
              Test Session API
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold">API Test Result</h2>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto h-96">
              {authTest || 'Click a test button above'}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Environment Check</h2>
        <div className="bg-gray-100 p-3 rounded">
          <p>NEXTAUTH_URL: {typeof window !== 'undefined' ? 'Check server logs' : 'N/A'}</p>
          <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
} 