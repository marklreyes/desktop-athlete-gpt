import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";
import type { ToastProps } from "../types/toast";
import { trackEvent } from "~/utils/trackEvent";

export function Toast({
  showToast,
  setShowToast,
  message,
  link
}: ToastProps) {
  const { theme } = useTheme();

	useEffect(() => {
    const toastState = sessionStorage.getItem("toastClosed");
    if (toastState === "true") {
      setShowToast(false);
    }
  }, [setShowToast]);

  const handleClose = () => {
    setShowToast(false);
    sessionStorage.setItem("toastClosed", "true");
  };

  if (!showToast) return null;

  return (
		<div
			className="toast w-full max-w-xs md:max-w-md z-50"
			role="alert"
			aria-live="polite"
		>
		<div className={`
			${theme.background}
			${theme.text}
			rounded-none
			alert
			alert-success
			p-2
			md:p-4
			relative
			border-white
			border-2
		`}>
			<button
				className={`
					bg-[${theme.primary}]
					btn btn-circle btn-xs md:btn-sm
					border-2
					border-white
					absolute top-1 right-2`}
				onClick={() => {
					handleClose();
					// Track event for close button click
					trackEvent("button_click", {
						params: {
							action: "Click",
							event_category: "Toast",
							event_label: "Close notification",
							component: "Toast Component"
						},
					});
				}}
				aria-label="Close notification"
			>
				<span aria-hidden="true">✕</span>
			</button>
			<div className="flex items-center gap-2">
				<span className="text-left text-xs sm:text-sm md:text-base whitespace-normal break-words">
				{message}{" "}
				{link && (
					<NavLink
					to={link.to}
					onClick={
						() => {
							// Track event for text click
							trackEvent("nav_click", {
								params: {
									event_category: "Navigation",
									event_sub_category: "Toast",
									event_label: `${link.text}`,
									component: "Toast Component"
								},
							});
						}
					}
					className="underline hover:text-white"
					aria-label={`${link.text} - Navigate to ${link.to}`}
					>
					{link.text}
					</NavLink>
				)}
				{link && "!"}
				</span>
			</div>
			</div>
		</div>
  );
}
