#------------------------------------

# This script is the entry point for the application. 
# It reads the configuration file and starts the camera processes.    
# The camera processes are started in parallel using the multiprocessing module.

#------------------------------------

import multiprocessing
from src.camera_process import CameraProcess
from src.utils import get_config

def main():
    config = get_config()
    processes = []

    for cam_config in config['camera']['camera_sources']:
        camera_id = cam_config['id']
        camera_source = cam_config['source']
        camera_process = CameraProcess(camera_id, camera_source, config)
        processes.append(camera_process)
        camera_process.start()
    
    for process in processes:
        process.join()

if __name__ == '__main__':
    main()

