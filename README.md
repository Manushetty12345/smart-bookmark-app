#  Smart Bookmark Manager


## 📌 Problems I Faced & How I Solved Them

### 1️⃣ Handling Google OAuth Redirect in App Router
**Problem:** The session was not being properly stored after login. Users were redirected but appeared logged out.
**Why:** Next.js App Router requires strict cookie handling on both server and client. Without a proper callback exchange, the session is lost.
**Solution:** * Created a dedicated route `/api/auth/callback` to handle the code exchange.
* Used `exchangeCodeForSession(code)` to finalize the login.
* Configured Middleware to refresh cookies on every request.

### 2️⃣ Data Privacy via Row Level Security (RLS)
**Problem:** Ensuring User A cannot see User B's bookmarks.
**Solution:** I moved security to the database level rather than just the frontend.
* Enabled **RLS** on the `bookmarks` table.
* Created a policy using `auth.uid() = user_id`.
* **Result:** The database automatically filters data based on the user's JWT, making it impossible for a user to "hack" into another person's data.

### 3️⃣ Real-time Updates Across Tabs
**Problem:** New bookmarks didn't appear in other open tabs without a manual refresh.
**Solution:** * Enabled the `supabase_realtime` publication for the table.
* Implemented a `supabase.channel()` listener in a `useEffect` hook.
* **Cleanup:** Ensured `supabase.removeChannel(channel)` is called on unmount to prevent memory leaks and duplicate listeners.

### 4️⃣ Stable Session Persistence
**Problem:** Users would occasionally be logged out after a hard refresh.
**Cause:** In the App Router, session cookies require manual refreshing via Middleware.
**Solution:** Created a `middleware.ts` file using `@supabase/ssr` to call `supabase.auth.getUser()`. This keeps the session alive and stable on Vercel's edge network.

### 5️⃣ Secure Database Ownership
**Problem:** Manually passing `user_id` from the frontend is a security risk.
**Solution:** * Set the `user_id` column to `DEFAULT auth.uid()`.
* This ensures that even if a frontend request is intercepted, the database correctly assigns the bookmark to the actual authenticated user, not a spoofed ID.