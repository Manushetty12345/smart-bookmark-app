'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Bookmark {
  id: string;
  url: string;
  title: string;
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      setBookmarks(data || []);
      setLoading(false);
    };

    fetchBookmarks();

    // Realtime subscription (FIXED VERSION)
const channel = supabase
  .channel('bookmarks-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'bookmarks',
    },
    () => {
      fetchBookmarks(); // 🔥 just refetch everything
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(channel);
};
  }, [router, supabase]);

  const isFormValid = title.trim() !== '' && url.trim() !== '';

 const addBookmark = async () => {
  if (!isFormValid) return;
  setLoading(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      title: title.trim(),
      url: url.trim(),
      user_id: user.id,
    })
    .select()
    .single();

 if (error) {
  console.error(error);
}

  setTitle('');
  setUrl('');
  setLoading(false);
};
  const deleteBookmark = async (id: string) => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

 if (error) {
  console.error(error);
}
};

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Bookmarks
          </h1>
          <button
            onClick={signOut}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Add Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-10">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Bookmark title (e.g., Awesome React Tutorial)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <button
              onClick={addBookmark}
              disabled={!isFormValid || loading}
              className={`w-full py-3 px-6 font-medium rounded-lg text-white transition-all ${
                isFormValid && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  : 'bg-indigo-400 cursor-not-allowed'
              }`}
            >
              {loading ? 'Adding...' : 'Add Bookmark'}
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            Loading your bookmarks...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No bookmarks yet
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Add your first bookmark above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {bookmark.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {bookmark.url}
                    </p>
                  </a>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}