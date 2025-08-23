const { COOKIE_CONSTANTS } = require('../config/constants');

class CookieUtil {
  // Default cookie configuration
  static DEFAULT_OPTIONS = {
    httpOnly: COOKIE_CONSTANTS.HTTP_ONLY,
    secure: COOKIE_CONSTANTS.SECURE,
    sameSite: COOKIE_CONSTANTS.SAME_SITE,
    path: COOKIE_CONSTANTS.PATH
  };

  // Refresh token specific configuration
  static REFRESH_TOKEN_OPTIONS = {
    ...this.DEFAULT_OPTIONS,
    maxAge: COOKIE_CONSTANTS.REFRESH_TOKEN_MAX_AGE,
  };

  // Access token specific configuration (if ever needed in cookies)
  static ACCESS_TOKEN_OPTIONS = {
    ...this.DEFAULT_OPTIONS,
    maxAge: COOKIE_CONSTANTS.ACCESS_TOKEN_MAX_AGE,
  };

  /**
   * Set refresh token cookie
   */
  static setRefreshTokenCookie(res, token) {
    res.cookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, token, this.REFRESH_TOKEN_OPTIONS);
  }

  /**
   * Set access token cookie (if needed)
   */
  static setAccessTokenCookie(res, token) {
    res.cookie(COOKIE_CONSTANTS.ACCESS_TOKEN_NAME, token, this.ACCESS_TOKEN_OPTIONS);
  }

  /**
   * Set custom cookie with default options
   */
  static setCookie(res, name, value, options = {}) {
    const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
    res.cookie(name, value, finalOptions);
  }

  /**
   * Clear refresh token cookie
   */
  static clearRefreshTokenCookie(res) {
    res.clearCookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, this.DEFAULT_OPTIONS);
  }

  /**
   * Clear access token cookie
   */
  static clearAccessTokenCookie(res) {
    res.clearCookie(COOKIE_CONSTANTS.ACCESS_TOKEN_NAME, this.DEFAULT_OPTIONS);
  }

  /**
   * Clear all auth cookies
   */
  static clearAllAuthCookies(res) {
    this.clearRefreshTokenCookie(res);
    this.clearAccessTokenCookie(res);
  }

  /**
   * Get cookie configuration for specific type
   */
  static getRefreshTokenOptions() {
    return { ...this.REFRESH_TOKEN_OPTIONS };
  }

  static getAccessTokenOptions() {
    return { ...this.ACCESS_TOKEN_OPTIONS };
  }

  static getDefaultOptions() {
    return { ...this.DEFAULT_OPTIONS };
  }
}

module.exports = {
  CookieUtil,
  setRefreshTokenCookie: CookieUtil.setRefreshTokenCookie.bind(CookieUtil),
  setAccessTokenCookie: CookieUtil.setAccessTokenCookie.bind(CookieUtil),
  setCookie: CookieUtil.setCookie.bind(CookieUtil),
  clearRefreshTokenCookie: CookieUtil.clearRefreshTokenCookie.bind(CookieUtil),
  clearAccessTokenCookie: CookieUtil.clearAccessTokenCookie.bind(CookieUtil),
  clearAllAuthCookies: CookieUtil.clearAllAuthCookies.bind(CookieUtil),
  getRefreshTokenOptions: CookieUtil.getRefreshTokenOptions.bind(CookieUtil),
  getAccessTokenOptions: CookieUtil.getAccessTokenOptions.bind(CookieUtil),
  getDefaultOptions: CookieUtil.getDefaultOptions.bind(CookieUtil)
};