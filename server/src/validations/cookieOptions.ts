export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  maxAge: number;
  sameSite: "none" | "lax";
  path?: string;
  domain?: string;
}

const isProduction = process.env.NODE_ENV === 'production'

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: isProduction ? 'lax' : 'lax',
  path: "/",
  ...(isProduction && { domain: "adamhq.site" }),
};
