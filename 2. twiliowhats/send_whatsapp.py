import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv() # Load environment variables from .env file

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")

client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp:+14155238886',
  body='el mensaje es 123A#',
  to='whatsapp:+51940182884'
)

print(f"Message SID: {message.sid}")
print(f"Message Status: {message.status}")
print(f"Message Direction: {message.direction}")
print(f"From: {message.from_}")
print(f"To: {message.to}")
print(f"Body: {message.body}")
print(f"Date Sent: {message.date_sent}")
