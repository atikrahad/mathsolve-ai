export const routes = {
  home: "/",
  dashboard: "/dashboard",
  problems: "/problems",
  profile: "/profile",
  rankings: "/rankings",
  resources: "/resources",
  auth: {
    login: "/login",
    register: "/register",
    resetPassword: "/reset-password",
  },
  api: {
    auth: "/api/auth",
    problems: "/api/problems",
    solutions: "/api/solutions",
    users: "/api/users",
    resources: "/api/resources",
  },
} as const;

export type Routes = typeof routes;