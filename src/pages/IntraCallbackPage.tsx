import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import axiosInstance from '@api/axios';

export type IntraTokenResponse = {
  token: {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
    secret_valid_until: number;
  };
};

export function IntraCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    async function exchangeCodeOnce() {
      if (!code) {
        setStatus('error');
        return;
      }

      try {
        const res = await axiosInstance.post<IntraTokenResponse>('/auth/oauth/intra', { code }) as unknown as IntraTokenResponse;

        const access_token = res?.token?.access_token;

        console.log('✅ Token received from backend:', access_token);

        if (!access_token)
          throw new Error('Could not retrieve access token from the backend');

        const userRes = await axios.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${access_token}` },
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
          console.log('✅ Intra login successful, sent to opener');
          // setTimeout(() => window.close(), 3000);
        } else {
          console.warn('⚠️ window.opener is null');
          setStatus('error');
        }
      } catch (err) {
        console.error('❌ Intra login failed', err);
        if (window.opener) {
          window.opener.postMessage({ error: 'intra_login_failed' }, window.location.origin);
        }
        setStatus('error');
        // setTimeout(() => window.close(), 3000);
      }
    }

    exchangeCodeOnce();
  }, []);

  return (
    <div className="dark:bg-black text-green-400 font-mono h-screen w-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-lg sm:text-xl md:text-2xl animate-fade-in">
        {status === 'loading' && (
          <div>
            <p className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-green-400 pr-2">
              Logging in with Intra...
            </p>
            <p className="mt-4 text-green-600 text-sm opacity-80 animate-pulse">
              Injecting caffeine... Establishing connection... Bypassing firewalls...
            </p>
          </div>
        )}
        {status === 'success' && (
          <div className="animate-fade-in">
            <p className="text-green-500 animate-typing whitespace-nowrap border-r-4 border-green-500 pr-2">
              ✅ Login successful.
            </p>
            <p className="mt-4 text-green-600 text-sm opacity-90">You may now close this window. Or don’t. I'm not your boss.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="animate-fade-in">
            <p className="text-red-500 animate-typing whitespace-nowrap border-r-4 border-red-500 pr-2">
              ❌ Login failed.
            </p>
            <p className="mt-4 text-red-400 text-sm opacity-80">
              Someone spilled coffee on the authentication server.
              <br />
              This window will self-destruct shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
}
