import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag: (
      key: string,
      trackingId: string,
      config: { page_path: string }
    ) => void
  }
}

export default function GoogleAnalytics() {
  const location = useLocation()
  const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID

  useEffect(() => {
    window.gtag("config", TRACKING_ID, {
      page_path: location.pathname + location.search,
    })
  }, [location])

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "${TRACKING_ID}");
          `,
        }}
      />
    </>
  )
}
