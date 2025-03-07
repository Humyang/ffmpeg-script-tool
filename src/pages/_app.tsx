import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head'; // Import Head component
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', 'G-9MHHN25EKW', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>FFmpeg Script Tool</title>
        <meta name="description" content="A tool for generating FFmpeg scripts : splitting videos, cropping videos, and converting to GIF." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-9MHHN25EKW`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9MHHN25EKW', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
