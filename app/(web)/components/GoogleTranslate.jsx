"use client";
import Script from "next/script";
import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    window.googleTranslateElementInit = function googleTranslateElementInit() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "bn,en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    const hideGoogleTranslateToolbar = () => {
      const translateIframe = document.querySelector("iframe.goog-te-banner-frame");
      if (translateIframe) {
        translateIframe.style.display = "none";
      }
    };

    const observer = new MutationObserver(() => {
      hideGoogleTranslateToolbar();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div id="google_translate_element"></div>
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
    </div>
  );
};

export default GoogleTranslate;
