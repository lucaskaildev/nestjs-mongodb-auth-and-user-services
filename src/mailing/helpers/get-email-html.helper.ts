export function getVerificationEmailHtml(
  verificationHref: string,
  username: string,
): string {
  const verificationEmailTemplate: string = `<!DOCTYPE html>\n
    <html>\n
    <head>\n
    <title>Email Verification</title>\n
</head>\n
<body>\n
    <table width="100%" border="0" cellspacing="0" cellpadding="0">\n
    <tr>\n
    <td align="center">\n
    <table border="0" cellspacing="0" cellpadding="0">\n
    <tr>\n
                        <td>\n
                        <h1>Hi, ${username}!</h1>\n
                            <p>Click the button below to verify your email address:</p>\n
                            <p><a href=${verificationHref} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>\n
                            <p>If you didn't create an account, you can ignore this email.</p>\n
                        </td>\n
                        </tr>\n
                </table>\n
            </td>\n
            </tr>\n
    </table>\n
</body>\n
</html>
`;
  return verificationEmailTemplate;
}

export function getReactivationEmail(
  reactivationHref: string,
  username: string,
): string {
  const verificationEmailTemplate: string = `<!DOCTYPE html>\n
      <html>\n
      <head>\n
      <title>Account reactivation</title>\n
  </head>\n
  <body>\n
      <table width="100%" border="0" cellspacing="0" cellpadding="0">\n
      <tr>\n
      <td align="center">\n
      <table border="0" cellspacing="0" cellpadding="0">\n
      <tr>\n
                          <td>\n
                          <h1>Hi, ${username}!</h1>\n
                              <p>Click the button below to activate your ${process.env.APP_NAME_PUBLIC} Account:</p>\n
                              <p><a href=${reactivationHref} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>\n
                              <p>If you think you received this email by mistake, you can ignore it.</p>\n
                          </td>\n
                          </tr>\n
                  </table>\n
              </td>\n
              </tr>\n
      </table>\n
  </body>\n
  </html>
  `;
  return verificationEmailTemplate;
}

export function getDeactivationEmailHtml(username: string): string {
  const deactivationEmailTemplate = `<!DOCTYPE html>\n
    <html>\n
    <head>\n
        <title>Account Deactivation Confirmation</title>\n
        <link rel="shortcut icon" href="#">
    </head>\n
    <body>\n
        <table width="100%" cellpadding="0" cellspacing="0">\n
            <tr>\n
                <td align="center">\n
                    <table width="600" cellpadding="0" cellspacing="0">\n
                        <tr>\n
                            <td align="center" bgcolor="#f1f1f1" style="padding: 20px;">\n
                                <h2>Account Deactivation Confirmation</h2>\n
                            </td>\n
                        </tr>\n
                        <tr>\n
                            <td bgcolor="#ffffff" style="padding: 20px;">\n
                                <p>\n
                                    Hi, ${username}\n
                                </p>\n
                                <p>\n
                                    This email confirms the successful deactivation of your ${process.env.APP_NAME_PUBLIC} account. Your account has been deactivated and is no longer accessible.\n
                                </p>\n
                                <p>\n
                                    You can request for a reactivation within the next 30 days after receiving this email by logging into your account again at our website.\n
                                </p>\n
                                <p>\n
                                    We appreciate your time with us and hope to see you again in the future.\n
                                </p>\n
                                <p>\n
                                    Best regards,\n
                                    The ${process.env.APP_NAME_PUBLIC} Team\n
                                </p>\n
                            </td>\n
                        </tr>\n
                        <tr>\n
                            <td bgcolor="#f1f1f1" style="padding: 20px;">\n
                                <p>\n
                                    This is an automated message. Please do not reply to this email.\n
                                </p>\n
                            </td>\n
                        </tr>\n
                    </table>\n
                </td>\n
            </tr>\n
        </table>\n
    </body>\n
    </html>
    `;
  return deactivationEmailTemplate;
}

export function getAuthCodeEmail(username: string, code: string): string {
  const authCodeEmailTemplate = `<!DOCTYPE html>\n
    <html>\n
    <head>\n
      <title></title>\n
    </head>\n
    <body>\n
      <div style="font-family: Arial, sans-serif; text-align: center;">\n
        <p>Hey, ${username},</p>\n
        <p>Your 6-digit authorization code is:</p>\n
        <div style="font-size: 24px; font-weight: bold; color: #007bff;">\n
          <p>${code}</p>\n
        </div>\n
        <p>This code will expire in 5 minutes.</p>\n
        <p>Thank you for using our service!</p>\n
      </div>\n
    </body>\n
    </html>`;
  return authCodeEmailTemplate;
}

export function getResetPasswordEmail(
  username: string,
  resetPasswordHref: string,
): string {
  const resetPasswordEmailTemplate = `<!DOCTYPE html>\n
    <html>\n
    <head>\n
      <title></title>\n
    </head>\n
    <body>\n
      <div style="font-family: Arial, sans-serif; text-align: center;">\n
        <p>Hey, ${username},</p>\n
        <p>someone requested a password reset for your account. If it was not you, please ignore this email.</p>\n
        <p>Click the button below to stablish your new password:</p>\n
        <p><a href=${resetPasswordHref} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Email</a></p>\n
        <p>This email will expire soon</p>\n
        <p>Thank you for using our service!</p>\n
      </div>\n
    </body>\n
    </html>`;
  return resetPasswordEmailTemplate;
}
