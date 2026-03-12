from fastapi import HTTPException
import mailtrap
from config.config import settings

class MailtrapClient:
    def __init__(self, api_token: str = settings.mail_api_key ):
        try:
            self.client = mailtrap.MailtrapClient(api_token)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to initialize email client: {str(e)}")

    def send_email(self, to_email: str, subject: str, html_content: str, text_content: str = ""):
        try:
            mail = mailtrap.Mail(
                    sender = mailtrap.Address(email="orders@ashxcode.me", name="Elased Team"),
                    to=[mailtrap.Address(email=to_email)],
                    subject=subject,
                    text=text_content,
                    html=html_content
                
            )
            self.client.send(mail)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")