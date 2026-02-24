import resend

from app.core.config import settings


def send_password_reset_email(to_email: str, reset_url: str) -> None:
	if not settings.resend_api_key or not settings.resend_from_email:
		raise ValueError("Email service is not configured.")

	try:
		resend.api_key = settings.resend_api_key
		resend.Emails.send(
			{
				"from": settings.resend_from_email,
				"to": to_email,
				"subject": "Reset your Campus Provision password",
				"html": (
					"<div style=\"font-family: 'Space Grotesk', Arial, sans-serif;"
					"background: #f9fafb; padding: 32px;">"
					"<div style=\"max-width: 520px; margin: 0 auto; background: #ffffff;"
					"border-radius: 16px; padding: 28px; border: 1px solid #e5e7eb;">"
					"<h2 style=\"margin: 0 0 12px; color: #0f3627;\">"
					"Reset your password</h2>"
					"<p style=\"margin: 0 0 16px; color: #374151;\">"
					"We received a request to reset your Campus Provision password. "
					"If you made this request, use the button below.</p>"
					f"<a href=\"{reset_url}\" style=\"display: inline-block;"
					"padding: 12px 18px; background: #154734; color: #ffffff;"
					"text-decoration: none; border-radius: 999px; font-weight: 600;\">"
					"Reset password</a>"
					"<p style=\"margin: 20px 0 0; color: #6b7280; font-size: 14px;\">"
					"If you did not request this, you can safely ignore this email.</p>"
					"</div>"
					"<p style=\"text-align: center; color: #9ca3af; font-size: 12px;"
					"margin: 18px 0 0;\">Campus Provision</p>"
					"</div>"
				),
			}
		)
	except Exception as exc:
		print("[Resend ERROR]", type(exc).__name__, str(exc))
		raise ValueError("Email service failed: " + str(exc)) from exc
