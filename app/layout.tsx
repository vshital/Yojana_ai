import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yojana AI — Find Government Benefits You Deserve",
  description: "India's AI-powered welfare navigator. Find and apply for government schemes based on your profile. Free, instant, trusted.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'hi,mr,ta,te,bn,gu,pa,kn,ml,or',
                  autoDisplay: false,
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                }, 'google_translate_element');
              }

              function changeLanguage(lang) {
                var select = document.querySelector('.goog-te-combo');
                if (select) {
                  select.value = lang;
                  select.dispatchEvent(new Event('change'));
                }
              }
            `,
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            .goog-te-banner-frame { display: none !important; }
            .goog-te-menu-value span { display: none; }
            body { top: 0 !important; }
            #google_translate_element { display: none; }
            .skiptranslate { display: none !important; }
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