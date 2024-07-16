export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "yeasty-boys-bread-cookie",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}
