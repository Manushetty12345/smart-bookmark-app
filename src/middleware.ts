import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Match everything except static files, images, favicon, and api routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};