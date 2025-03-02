# ---------------------------------------------------------------------------------------------------------------
# Name: CameraProcess
# Description: 
# This file contains the CameraProcess class 
# which is a subclass of the multiprocessing.Process class. 
# This class is responsible for capturing frames from the camera source, 
# processing the frames using the model, and sending the image logs and notifications to the Firebase database. 
# The CameraProcess class also sends SMS alerts using the SMSAlert class. 
# The CameraProcess class is used by the CameraManager class to create a separate process for each camera source.
# ---------------------------------------------------------------------------------------------------------------

import os
import cv2
import multiprocessing
import time
from datetime import datetime
import numpy as np
from PIL import Image
from .model import Model
from .firebase_integration import FirebaseIntegration
from .SMS_alert import SMSAlert
from .utils import get_config

class CameraProcess(multiprocessing.Process):
    def __init__(self, camera_id, camera_source, config):
        super().__init__()
        self.config = config
        self.camera_id = camera_id 
        self.camera_source = camera_source
        self.target_frame_rate = self.config['camera']['target_frame_rate']
        self.frame_interval = 1.0 / self.target_frame_rate
        

    def run(self):
        cap = cv2.VideoCapture(self.camera_source)
        cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
        cap.set(3, self.config['camera']['resolution'][0])
        cap.set(4, self.config['camera']['resolution'][1])

        fgbg = cv2.createBackgroundSubtractorMOG2()
        ret, frame = cap.read()
        if ret:
            fgmask = fgbg.apply(frame)
        kernel = np.ones((5, 5), np.uint8)

        self.firebase = FirebaseIntegration(self.config['firebase'])
        self.alert = SMSAlert(self.config['twilio'])
        model = Model(self.config['model'])
        model.load_model()


        last_save_time = 0
        while True:
            start_time = time.time()
            ret, frame = cap.read()
            if not ret or frame is None:
                print(f"End of frame for camera {self.camera_id}")
                break

            cv2.imshow(f'Frame {self.camera_source}', frame)
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            predicted_class = model.infer(image, self.camera_id)

            current_time = time.time()
            if current_time - last_save_time >= 2:
                if predicted_class in [0, 1]:
                    img_log_id = self.img_log( predicted_class, self.camera_id, frame) # Send image logs to Firestore database
                    self.img_notf(img_log_id, predicted_class, self.camera_id) # Send notifications to Firestore database
                else:
                    print("Normal image")
                last_save_time = current_time

            elapsed_time = time.time() - start_time
            if elapsed_time < self.frame_interval:
                time.sleep(self.frame_interval - elapsed_time)

    def save_img(self, frame, cam_id):
        base_dir = os.path.abspath(os.path.join(os.getcwd(), "images"))
        os.makedirs(base_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%H-%M-%S--%d-%m-%y")
        file_name = f"{cam_id}_{timestamp}.jpg"
        image_path = os.path.join(base_dir, file_name)
        success = cv2.imwrite(image_path, frame)
        
        if success:
            print(f"Image saved to {image_path}")
            return file_name, image_path
        else:
            print("Failed to save image")
            return None, None

    def img_log(self, error_type, cam_id, frame):
        file_name, image_path = self.save_img(frame, cam_id)  # Save image to local storage
        if file_name and image_path:
            image_url = self.firebase.upload_image(file_name, image_path) # Upload image to Firebase storage
            print(image_url)
        log_id = self.firebase.log_image(image_url, cam_id, error_type) # Send image logs to Firestore database
        print(f"Image '{file_name}' logged with ID {log_id}")
        return log_id

    def img_notf(self, img_log_id, error_type, cam_id):

        self.firebase.send_notification(img_log_id, error_type, cam_id) # Send notifications to Firestore database
        print("Notification sent..........")
        self.send_sms(cam_id) # Send SMS alert

    def send_sms(self,cam_id):
        message = f"{cam_id}! is in trouble"
        success = self.alert.send_sms(message)

        if success:
            print("SMS sent successfully")
        else:
            print("Failed to send SMS") 

# ---------------------------------------------------------------------------------------------------------------
# End of File
# ---------------------------------------------------------------------------------------------------------------