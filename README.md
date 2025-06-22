# SabotAI 
Implementation of an Outdoor Camera Sabotage Detection System Model using Deep Learning

![SabotAI](logo/sabotai.jpg)

--- 

## 🔍 Overview
This project introduces an **AI-powered camera tamper monitoring system** for **outdoor surveillance**.  
It uses **deep learning** to detect common tampering events such as:
- 🔄 **Changes in camera orientation**
- 🔍 **Defocusing**
- 🏢 **Occlusion (blocking the camera view)**

The system provides **real-time monitoring** via a **user-friendly web portal** and sends **SMS alerts** upon tampering detection.

---

## 🚀 Features
✅ **Deep Learning-Based Detection** – Uses **CNN models** to detect tampering.  
✅ **Multi-Camera Support** – Handles multiple camera sources.  
✅ **Real-Time Processing** – Detects issues instantly.  
✅ **Web Dashboard** – Provides visual feedback.  
✅ **SMS Alerts** – Sends notifications on tampering events.  

---

## 🛠️ Tech Stack
- **Python** (Multiprocessing, OpenCV)
- **Deep Learning** (TensorFlow / PyTorch)
- **VueJS** (Web-based monitoring dashboard)
- **Twilio** (SMS notifications)

---

## ⚙️ Installation & Setup
### Clone the Repository
```sh
git clone <your-repo-url>
cd SabotAI
```
### Run the SabotAI Software
```sh
cd SabotAI/SabotAI-Software
```
#### Install Dependencies
```sh
pip install -r requirements.txt
```
#### Run the Project
```sh
python run.py
```
Note:
- The trained model is not included.  
- You need to set up your Firebase configuration and service account.  
- You need to set up your Twilio account.  

---

### Run the SabotAI WebApp
```sh
cd SabotAI/SabotAI-WebApp
```
#### Install Dependencies
```sh
pnpm install
```
#### Compile and Hot-Reload for Development
```sh
pnpm dev
```
#### Compile and Minify for Production
```sh
pnpm build
```
#### Lint with ESLint
```sh
pnpm lint
```

---

## 📹 Demo Video
[![Watch the Video](https://img.youtube.com/vi/IXs6eHfta20/maxresdefault.jpg)](https://www.youtube.com/watch?v=IXs6eHfta20)  

---

## 📜 Publication
For more details on our research and findings, refer to our publication:

- 📄 Title:Implementation of an Outdoor Camera Sabotage Detection System Model
- 📚 Journal/Conference: IEEE IC_ASET 2024
- 📅 Year: 2024
- 🔗 DOI / Link: [click here!](https://ieeexplore.ieee.org/document/10596200/)  

## 📚 License
This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for more details.

---

## 🤝 Contributing
We welcome contributions!  
1. Fork the repo  
2. Create a new branch (`feature-xyz`)  
3. Commit changes and push  
4. Open a Pull Request 🚀  

---



