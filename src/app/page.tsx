'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/bookmarks');
    });
  }, [router, supabase.auth]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-6">
      {/* Optional subtle overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
        {/* Header / Branding */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Smart Bookmark
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Save, organize, and sync your favorite links — instantly.
          </p>
        </div>

        {/* Google Sign-In Button */}
        <div className="px-8 pb-10">
          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-800 font-medium text-lg shadow-md hover:shadow-lg hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50"
            disabled={false} // you can add loading state later if needed
          >
            {/* Official Google "G" logo SVG */}
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.8z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.63c-.98.66-2.23 1.06-3.93 1.06-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.78 20.39 6.84 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.51 14.21c-.23-.66-.36-1.37-.36-2.21s.13-1.55.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.84 0 2.78 2.61.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
                fill="#EA4335"
              />
            </svg>

            <span className="group-hover:text-indigo-700 transition-colors">
              Continue with Google
            </span>
          </button>

          {/* Optional privacy note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            We only use your Google account for secure login. No passwords stored.
          </p>
        </div>
      </div>
    </div>
  );
}