const AUTH_KEY = "pelatihdash-session";
const SESSION_USER_KEY = "pelatihdash-user";

export const DUMMY_ACCOUNTS = [
  {
    username: "paskus",
    password: "paskus123",
    label: "Staff Command",
  },
  {
    username: "recruiter",
    password: "recruiter123",
    label: "Recruiter Desk",
  },
];

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(AUTH_KEY) === "authenticated";
}

export function setAuthenticated(value) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.sessionStorage.setItem(AUTH_KEY, "authenticated");
    return;
  }

  window.sessionStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem(SESSION_USER_KEY);
}

export function authenticateUser(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  return (
    DUMMY_ACCOUNTS.find(
      (account) =>
        account.username === normalizedUsername && account.password === password,
    ) ?? null
  );
}

export function setAuthenticatedUser(account) {
  if (typeof window === "undefined") {
    return;
  }

  if (!account) {
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    return;
  }

  window.sessionStorage.setItem(
    SESSION_USER_KEY,
    JSON.stringify({
      username: account.username,
      label: account.label,
    }),
  );
}

export function getAuthenticatedUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}
