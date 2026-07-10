export const resetPasswordTemplate = (resetLink: string) => `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 40px 0;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; padding: 40px;">
      
      <tr>
        <td style="text-align: center; padding-bottom: 20px;">
          <h2 style="margin: 0; color: #333;">Second Brain</h2>
        </td>
      </tr>

      <tr>
        <td>
          <h3 style="color: #333;">Reset your password</h3>
          <p style="color: #555; font-size: 14px;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>
        </td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <p style="color: #777; font-size: 12px;">
            This link will expire in 15 minutes for security reasons.
          </p>

          <p style="color: #777; font-size: 12px;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #aaa; font-size: 11px; text-align: center;">
            If the button doesn’t work, copy and paste this link into your browser:
          </p>
          <p style="color: #4f46e5; font-size: 11px; word-break: break-all; text-align: center;">
            ${resetLink}
          </p>
        </td>
      </tr>

    </table>
  </div>
  `
