import { useEffect, useState } from 'react';
import axios from 'axios';

export function IntraCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const maxRetries = 2;

    async function exchangeCodeWithRetry(attempt = 1) {
      try {
        const res = await axios.post(
          'https://api.intra.42.fr/oauth/token',
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: import.meta.env.VITE_INTRA_CLIENT_ID!,
            client_secret: import.meta.env.VITE_INTRA_CLIENT_SECRET!,
            code: code!,
            redirect_uri: import.meta.env.VITE_INTRA_REDIRECT_URI!,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const accessToken = res.data.access_token;

        const userRes = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { id, first_name, last_name, email, image } = userRes.data;
        const picture_url = image?.versions?.medium || image?.link || '';

        if (window.opener) {
          window.opener.postMessage(
            {
              intra_user_id: id.toString(),
              first_name,
              last_name,
              email,
              picture_url,
            },
            window.location.origin
          );
          setStatus('success');
          console.log('✅ Sent user info to opener');

          setTimeout(() => window.close(), 1500);
        } else {
          console.warn('⚠️ window.opener is null');
          setStatus('error');
        }
      } catch (err) {
        console.error(`❌ Attempt ${attempt} failed`, err);

        if (attempt < maxRetries) {
          setTimeout(() => exchangeCodeWithRetry(attempt + 1), 1000);
        } else {
          if (window.opener) {
            window.opener.postMessage({ error: 'intra_login_failed' }, window.location.origin);
            console.error('⚠️ Posted login error to opener');
          }
          setStatus('error');
          setTimeout(() => window.close(), 3000);
        }
      }
    }

    if (code) {
      exchangeCodeWithRetry();
    } else {
      setStatus('error');
    }
  }, []);

  return (
    <p className="text-center mt-8 text-gray-600 dark:text-gray-300">
      {status === 'loading' && 'Logging in with Intra...'}
      {status === 'success' && 'Login successful. You can close this window.'}
      {status === 'error' && 'This window will close shortly.'}
    </p>
  );
}
