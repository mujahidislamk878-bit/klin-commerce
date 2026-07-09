type AuthMode = "login" | "signup";

export interface EmailAuthPayload {
  mode: AuthMode;
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  provider: "google" | "resend" | "mock";
  message: string;
}

const emailEndpoint = import.meta.env.VITE_AUTH_EMAIL_ENDPOINT || "";
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  import.meta.env.VITE_AUTH_GOOGLE_CLIENT_ID ||
  "";
const redirectUrl =
  import.meta.env.VITE_AUTH_REDIRECT_URL ||
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ||
  `${window.location.origin}/auth/callback`;
const resendApiKey =
  import.meta.env.VITE_RESEND_API_KEY ||
  import.meta.env.VITE_AUTH_RESEND_API_KEY ||
  import.meta.env.RESEND_API_KEY ||
  "";
const emailFrom = import.meta.env.VITE_AUTH_EMAIL_FROM || import.meta.env.VITE_RESEND_FROM || "no-reply@yourdomain.com";
const mongoUri = import.meta.env.VITE_MONGODB_URI || import.meta.env.MONGODB_URI || "";
const jwtSecret = import.meta.env.VITE_JWT_SECRET || import.meta.env.JWT_SECRET || "";

export const authConfig = {
  emailEndpoint,
  googleClientId,
  redirectUrl,
  resendApiKey,
  emailFrom,
  mongoUri,
  jwtSecret,
};

export async function initiateGoogleAuth(mode: AuthMode): Promise<AuthResponse> {
  if (!authConfig.googleClientId) {
    return {
      ok: false,
      provider: "google",
      message: "Set VITE_AUTH_GOOGLE_CLIENT_ID to enable Google OAuth.",
    };
  }

  const params = new URLSearchParams({
    client_id: authConfig.googleClientId,
    redirect_uri: authConfig.redirectUrl,
    response_type: "code",
    scope: "openid email profile",
    state: JSON.stringify({ mode, source: "klin-auth" }),
    prompt: "select_account",
  });

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);

  return {
    ok: true,
    provider: "google",
    message: `Redirecting you to Google ${mode === "signup" ? "sign up" : "sign in"} flow.`,
  };
}

export async function submitEmailAuth(payload: EmailAuthPayload): Promise<AuthResponse> {
  if (authConfig.emailEndpoint) {
    const response = await fetch(authConfig.emailEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        provider: "resend",
        from: authConfig.emailFrom,
        resendApiKey: authConfig.resendApiKey,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "We could not complete that request.");
    }

    return {
      ok: true,
      provider: "resend",
      message:
        payload.mode === "signup"
          ? "Check your inbox for a confirmation email from Resend."
          : "Check your inbox for a magic link from Resend.",
    };
  }

  return {
    ok: true,
    provider: "mock",
    message:
      payload.mode === "signup"
        ? "Demo mode: email sign-up is ready. Configure VITE_AUTH_EMAIL_ENDPOINT and VITE_AUTH_RESEND_API_KEY to connect Resend."
        : "Demo mode: email sign-in is ready. Configure VITE_AUTH_EMAIL_ENDPOINT and VITE_AUTH_RESEND_API_KEY to connect Resend.",
  };
}
