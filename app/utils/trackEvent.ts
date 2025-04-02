/**
 * Utility function that returns an onClick handler for tracking events and playing audio using GA4
 * @param eventName - The name of the event to track
 * @param options - Additional options for tracking and audio
 * @returns An onClick handler function
 */
export const trackEvent = (
	eventName: string,
	options?: {
	  // GA4 uses custom parameters instead of predefined category/label/value
	  params?: Record<string, any>;
	  audioSrc?: string;
	  audioVolume?: number;
	  callback?: () => void;
	}
  ) => {
	return (event?: React.MouseEvent | MouseEvent) => {
	  // Play audio if specified
	  if (options?.audioSrc) {
		const audio = new Audio(options.audioSrc);
		audio.volume = options?.audioVolume ?? 0.1;
		audio.play().catch(err => console.error("Audio failed to play:", err));
	  }

	  // Track event with Google Analytics 4 if available
	  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
		// GA4 uses a simpler model with custom parameters
		window.gtag('event', eventName, options?.params || {});
	  } else {
		console.log(`GA4 Event (not sent): ${eventName}`, options?.params);
	  }

	  // Execute additional callback if provided
	  if (options?.callback) {
		options.callback();
	  }
	};
  };
