from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
import os

app = Flask(__name__)

@app.route("/webhook", methods=['POST'])
def whatsapp_webhook():
    """Handle incoming WhatsApp messages."""
    incoming_msg = request.values.get('Body', '').lower()
    from_number = request.values.get('From', '')

    print(f"Received message: '{incoming_msg}' from {from_number}")

    # Store the incoming message in a log file
    with open("messages.log", "a") as f:
        f.write(f"From: {from_number}, Message: {incoming_msg}\n")

    # Start our TwiML response
    resp = MessagingResponse()
    msg = resp.message()

    if 'hello' in incoming_msg:
        msg.body("Hello there! You said hello.")
    elif 'bye' in incoming_msg:
        msg.body("Goodbye! It was nice chatting.")
    else:
        msg.body("I've received your message: " + incoming_msg)

    # In a real application, you would store from_number and incoming_msg in a database
    # For now, we just print it to the console.

    return str(resp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
