import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';

// Logger function
const apiLogger = (message: string, data?: any) => {
  console.log(`[NextAuth API] ${message}`, data ? JSON.stringify(data, null, 2) : '');
};

async function handler(req: Request) {
  const headersList = headers();
  const origin = headersList.get('origin');
  const url = new URL(req.url);

  apiLogger('📥 Incoming request', {
    method: req.method,
    path: url.pathname,
    origin,
    headers: {
      'user-agent': headersList.get('user-agent'),
      'content-type': headersList.get('content-type'),
      'accept': headersList.get('accept'),
    }
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    apiLogger('👋 Handling CORS preflight request');
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Headers': 'authorization,content-type,x-auth-token',
      },
    });
  }

  try {
    const response = await NextAuth(authOptions)(req);
    
    // Add CORS headers to the response
    if (response) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
      
      apiLogger('📤 Sending response', {
        status: response.status,
        headers: {
          'content-type': response.headers.get('content-type'),
          'set-cookie': response.headers.get('set-cookie') ? '[PRESENT]' : '[MISSING]'
        }
      });
    }

    return response;
  } catch (error) {
    apiLogger('❌ Error handling request', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': origin || '*',
        }
      }
    );
  }
}

export { handler as GET, handler as POST };
