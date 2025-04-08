export interface ToastProps {
	role?: string;
	"aria-live"?: string;
	showToast: boolean;
	setShowToast: (show: boolean) => void;
	message: string;
	link?: {
		to: string;
		text: string;
	};
}
