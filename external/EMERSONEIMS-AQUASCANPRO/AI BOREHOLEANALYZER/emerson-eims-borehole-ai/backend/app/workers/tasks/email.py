import logging
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.workers.celery_app import celery_app
from app.config import Config

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email(self, to_email: str, subject: str, content: str, html: bool = False):
    """
    Send an email via SMTP or SendGrid.

    Falls back to logging if no SMTP/SendGrid credentials are configured.
    """
    sendgrid_key = Config.SENDGRID_API_KEY
    from_email = Config.FROM_EMAIL

    if sendgrid_key:
        # --- SendGrid HTTP API ---
        try:
            import urllib.request
            import json

            payload = {
                "personalizations": [{"to": [{"email": to_email}]}],
                "from": {"email": from_email},
                "subject": subject,
                "content": [{"type": "text/html" if html else "text/plain", "value": content}],
            }
            req = urllib.request.Request(
                "https://api.sendgrid.com/v3/mail/send",
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {sendgrid_key}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            resp = urllib.request.urlopen(req, timeout=15)
            logger.info(f"Email sent via SendGrid to {to_email} (status={resp.status})")
            return {"status": "sent", "to": to_email, "provider": "sendgrid"}

        except Exception as e:
            logger.warning(f"SendGrid send failed: {e}")
            raise self.retry(exc=e)

    # --- SMTP fallback ---
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")

    if smtp_host:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = from_email
            msg["To"] = to_email
            msg.attach(MIMEText(content, "html" if html else "plain"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as server:
                server.ehlo()
                server.starttls()
                if smtp_user:
                    server.login(smtp_user, smtp_pass)
                server.sendmail(from_email, [to_email], msg.as_string())

            logger.info(f"Email sent via SMTP to {to_email}")
            return {"status": "sent", "to": to_email, "provider": "smtp"}

        except Exception as e:
            logger.warning(f"SMTP send failed: {e}")
            raise self.retry(exc=e)

    # --- No provider configured → log only ---
    logger.warning(f"No email provider configured. Would send to {to_email}: {subject}")
    return {"status": "logged", "to": to_email, "provider": "none"}