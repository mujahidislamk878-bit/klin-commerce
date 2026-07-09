// Session management utilities
export type UserSession = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  onboarding?: boolean;
  token: string;
  createdAt: number;
};

const SESSION_KEY = "klin_user_session";

export const sessionManager = {
  // Save session to localStorage
  saveSession: (session: UserSession): void => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  },

  // Get session from localStorage
  getSession: (): UserSession | null => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored) as UserSession;

      // Check if session is still valid (not older than 30 days)
      const ageInDays = (Date.now() - session.createdAt) / (1000 * 60 * 60 * 24);
      if (ageInDays > 30) {
        sessionManager.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  },

  // Clear session from localStorage
  clearSession: (): void => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error("Failed to clear session:", error);
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return sessionManager.getSession() !== null;
  },
};
