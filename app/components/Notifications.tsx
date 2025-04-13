import { trackEvent } from "~/utils/trackEvent";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router";

export default function Notifications() {
	const { theme } = useTheme();
	const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
	const location = useLocation(); // Get current route location
	const isWorkoutRoute = location.pathname === "/workout";

  // Function to create and show a welcome notification
  const showWelcomeNotification = () => {
    if (permissionStatus === "granted") {
      const notification = new Notification("Desktop Athlete", {
        body: "Thanks for enabling notifications! We'll let you know when it's time for your next workout.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "welcome-notification",
      });

      // Track notification display event
      trackEvent("notification_displayed", {
        params: {
          type: "welcome",
          success: true
        }
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        trackEvent("notification_click", {
          params: {
            type: "welcome"
          }
        });
      };
    }
  };

  // Function to show workout reminder notification
  const showWorkoutReminderNotification = () => {
    // Check permission directly from Notification API instead of using component state
    if ("Notification" in window && Notification.permission === "granted") {
      console.log("Showing workout reminder notification");
      const notification = new Notification("Time for a Workout! 💪", {
        body: "It's been 24 hours since your last exercise. Ready for another Desktop Athlete workout?",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "workout-reminder"
        // Removed the actions property as it's not supported in regular Notifications
      });

      // Track reminder notification
      trackEvent("notification_displayed", {
        params: {
          type: "workout_reminder",
          success: true
        }
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/chat'; // Navigate to workout page
        notification.close();
        trackEvent("notification_click", {
          params: {
            type: "workout_reminder"
          }
        });
      };
    } else {
      console.error("Cannot show notification: permission not granted");
    }
  };

  // Function to record workout completion timestamp
  const recordWorkoutCompletion = () => {
    localStorage.setItem('last-workout-timestamp', Date.now().toString());

    // Schedule next reminder in 24 hours
    scheduleNextReminder();
  };

  // Function to check if 24 hours have passed since last workout
  const check24HoursPassed = () => {
    const lastWorkout = localStorage.getItem('last-workout-timestamp');
    if (!lastWorkout) return false;

    const lastWorkoutTime = parseInt(lastWorkout, 10);
    const now = Date.now();
    const hoursSinceLastWorkout = (now - lastWorkoutTime) / (1000 * 60 * 60);

    return hoursSinceLastWorkout >= 24;
  };

  // Schedule the next reminder
  const scheduleNextReminder = () => {
    const lastWorkout = localStorage.getItem('last-workout-timestamp');

    // Clear any existing reminders
    const existingReminderId = localStorage.getItem('reminder-timeout-id');
    if (existingReminderId) {
      window.clearTimeout(parseInt(existingReminderId, 10));
    }

    if (lastWorkout) {
      const lastWorkoutTime = parseInt(lastWorkout, 10);
      const targetTime = lastWorkoutTime + (24 * 60 * 60 * 1000); // 24 hours after last workout
      const now = Date.now();
      const timeUntilReminder = Math.max(0, targetTime - now);

      // Also store the target timestamp for when the reminder should appear
      // This helps us recover if the timeout is lost due to browser refresh/close
      localStorage.setItem('next-reminder-timestamp', targetTime.toString());

      // Set timeout for next reminder
      const timeoutId = window.setTimeout(() => {
        if (check24HoursPassed()) {
          showWorkoutReminderNotification();
        }
      }, timeUntilReminder);

      // Store timeout ID so we can clear it if needed
      localStorage.setItem('reminder-timeout-id', timeoutId.toString());

      console.log(`Next workout reminder scheduled in ${(timeUntilReminder/(1000*60*60)).toFixed(1)} hours`);
    }
  };

  // Check for permission and set up reminders on mount
  useEffect(() => {
    // Check if the browser supports notifications
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);

      // If permission is already granted
      if (Notification.permission === "granted") {
        // Only show welcome notification if it's the first time
        if (!localStorage.getItem('notification-welcomed')) {
          showWelcomeNotification();
          localStorage.setItem('notification-welcomed', 'true');
        }

        // Check if the stored next reminder timestamp has passed
        const nextReminderTimestamp = localStorage.getItem('next-reminder-timestamp');
        if (nextReminderTimestamp && parseInt(nextReminderTimestamp, 10) <= Date.now()) {
          console.log("Stored reminder timestamp has passed, checking if workout reminder needed");
          if (check24HoursPassed()) {
            showWorkoutReminderNotification();
          }
        }

        // Always check if we need to remind about workout (as a fallback)
        else if (check24HoursPassed()) {
          console.log("24 hours have passed since last workout, showing reminder");
          showWorkoutReminderNotification();
        }

        // Schedule next reminder in all cases
        scheduleNextReminder();
      }
    }

    // Attach workout completed event listener
    window.addEventListener('workout-completed', recordWorkoutCompletion);

    return () => {
      window.removeEventListener('workout-completed', recordWorkoutCompletion);
    };
  }, []);

  // When permission status changes to granted, initialize notifications
  useEffect(() => {
    if (permissionStatus === "granted" && !localStorage.getItem('notification-welcomed')) {
      showWelcomeNotification();
      localStorage.setItem('notification-welcomed', 'true');
      scheduleNextReminder();
    }
  }, [permissionStatus]);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        trackEvent("notification_permission", { params: { status: permission } });
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-4">
      {permissionStatus !== "granted" && isWorkoutRoute && (
					<button
					onClick={requestNotificationPermission}
					className={`
						text-center px-4 py-2 border-4
						border-[${theme.primary}]
						bg-[${theme.primary}]
						text-[${theme.secondary}]
						font-bold shadow-[4px_4px_0px_0px]
						shadow-[${theme.secondary}]
						cursor-pointer
						hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px]
						active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
						transition-all
					`}
				>
					Enable Workout Reminders
				</button>
      )}
    </div>
  );
}
