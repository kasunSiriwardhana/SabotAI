#---------------------------------
# This module is responsible for integrating the system with Firebase services.
# It provides the following functionalities:
# - Upload images to Firebase storage
# - Log image data to Firebase Firestore
# - Send notifications to Firebase Firestore
#---------------------------------

import firebase_admin
import pyrebase
from firebase_admin import credentials, firestore
import uuid
import datetime
import os

class FirebaseIntegration:
    def __init__(self, firebase_config):
        self.config = firebase_config

        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            service_account_path = os.path.abspath(self.config['service_account'])
            self.cred = credentials.Certificate(service_account_path)
            self.app = firebase_admin.initialize_app(self.cred)
            self.db = firestore.client()

        self.firebase = pyrebase.initialize_app(self.config)
        self.storage = self.firebase.storage()
        self.database = self.firebase.database()
        

    def upload_image(self, file_name, image_path):
        folder_path = "img" # folder at firebase storage bucket
        self.storage.child(f"{folder_path}/{file_name}").put(image_path) # publish image to the firebase storage
        print(f"Image '{file_name}' sent to Firebase")
        image_path = f"img/{file_name}" # image path for saved image in the storage
        image_url = self.storage.child(image_path).get_url(None) # get the image URL
        print("Image URL:", image_url)
        return image_url


    def log_image(self, image_url, cam_id, error_type):
        custom_id = str(uuid.uuid4())  # generate custom document id
        data = {
            "camId": cam_id,
            "createdAt": datetime.datetime.now(),
            "errorType": error_type,
            "imageUrls": image_url,
            "desc": self.get_error_description(error_type)
        }
        self.db.collection("logs").document(custom_id).set(data)
        print("Image log is sent with custom ID:", custom_id)
        return custom_id
    
    def send_notification(self, img_log_id, error_type, cam_id):
   
        notification_data = {
            "camId": cam_id,
            "createdAt": datetime.datetime.now(tz=datetime.timezone.utc),
            "logId": img_log_id,
            "description": self.get_error_description(error_type),
            "title": f"Camera Alert {error_type}"
        }
        self.db.collection("notifications").add(notification_data)

    def get_error_description(self, error_type):
        error_descriptions = {
            0: "The camera is obstructed",
            1: "The camera is defocused",
            2: "The camera is normal"
        }
        return error_descriptions.get(error_type, "Unknown error")
    

# ---------------------------------
# End of File
# ---------------------------------
