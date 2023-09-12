export enum AuthRoutes {
    _BASE_ROUTE = 'http://localhost:3000/auth',
    _REGISTER = 'register',

    _REQUEST_EMAIL_VERIFICATION = 'request-verification-email',

    _VERIFY_EMAIL = 'verify-email/:verificationToken',

    _VERIFY_EMAIL_BASE = 'verify-email',

    _REQUEST_PHONE_VERIFICATION = 'request-phone-verification',

    _VERIFY_PHONE_NUMBER = 'verify-phone-number',

    _VALIDATE_LOGIN_2FA_OTP = 'validate-login',

    _GOOGLE_OAUTH_LOGIN = 'google-oauth',

    _GOOGLE_OAUTH_LOGIN_REDIRECT = 'google-redirect',

    _LOGOUT = 'logout',

    _REQUEST_PASSWORD_RESET = 'request-password-reset',

    _VALIDATE_PASSWORD_RESET_OTP = 'validate-password-reset-otp',

    _RESET_PASSWORD = 'reset-password',

    _DEACTIVATE_ACCOUNT = 'deactivate-account',

    _REACTIVATE_ACCOUNT_BASE = 'reactivate-account',

    _REQUEST_ENABLE_2FA = 'request-enable-2fa',

    _ENABLE_2FA = 'enable-2fa',

    _GOOGLE_OAUTH_REGISTER = 'google-oauth-register'
}