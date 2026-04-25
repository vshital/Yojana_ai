import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yojana AI — Find Government Benefits You Deserve",
  description: "India's AI-powered welfare navigator. Free, instant, trusted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="text/javascript"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (window.location.pathname === '/language') return;
                if (window.location.pathname === '/chat') return;
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'hi,mr,ta,te,bn,gu,pa,kn,ml',
                  autoDisplay: false
                }, 'google_translate_element');
              }

              function applyTranslation() {
                if (window.location.pathname === '/language') return;
                if (window.location.pathname === '/chat') return;
                var gtLang = localStorage.getItem('gtLang');
                if (!gtLang) return;
                var select = document.querySelector('.goog-te-combo');
                if (select) {
                  select.value = gtLang;
                  select.dispatchEvent(new Event('change'));
                } else {
                  setTimeout(applyTranslation, 500);
                }
              }

              window.addEventListener('load', function() {
                setTimeout(applyTranslation, 1500);
              });
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame { display: none !important; }
            .goog-logo-link { display: none !important; }
            .goog-te-gadget { display: none !important; }
            body { top: 0 !important; }
            #google_translate_element { display: none; }
            .skiptranslate { display: none !important; }
            .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }
          `
        }} />
      </head>
      <body>
        <div id="google_translate_element" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}