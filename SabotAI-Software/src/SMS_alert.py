# --------------------------------
# This file contains the SMSAlert class which is used to send SMS alerts using the Twilio API.
# --------------------------------

import requests

class SMSAlert:
    def __init__(self, twilio_config):
        self.config = twilio_config
        self.account_sid = self.config['account_sid']
        self.auth_token = self.config['auth_token']
        self.to_phone_number = self.config['to_phone_number']
        self.from_phone_number = self.config['from_phone_number']

    def send_sms(self, message):
        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Messages.json"
        auth = (self.account_sid, self.auth_token)
        payload = {
            "Body": message,
            "To": self.to_phone_number,
            "From": self.from_phone_number
        }
        response = requests.post(url, data=payload, auth=auth)
        return response.status_code == 200

# --------------------------------
# End of File
# --------------------------------