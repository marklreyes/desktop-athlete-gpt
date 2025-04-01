export function DefaultMeta() {
	const baseUrl = process.env.NODE_ENV === "development"
	  ? "http://localhost:8888"
	  : "https://desktopathlete.com";

	return (
	  <>
		{/* Standard Meta Tags */}
		<meta property="og:site_name" content="DesktopAthlete.com | AI Assistant for HIIT, Tabata, Calisthenics Workouts" />
		<meta property="og:type" content="website" />
		<meta property="og:image" content={`${baseUrl}/desktopathlete-share.jpg`} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />

		{/* Twitter Card Tags */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:site" content="@desktopathlete" />
		<meta name="twitter:image" content={`${baseUrl}/desktopathlete-share.jpg`} />
	  </>
	);
  }
