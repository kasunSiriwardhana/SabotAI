# --------------------------------------------------------------------
# Description: This file contains the model class which is responsible
# for loading the model and performing inference on the input image.
# --------------------------------------------------------------------

import torch
from torchvision import models, transforms

class Model:
    def __init__(self, model_config):
        self.config = model_config
        self.model = None
        self.num_classes = self.config['num_classes']

    def load_model(self):
        weights = models.AlexNet_Weights.IMAGENET1K_V1 if self.config['pretrained'] else None
        self.model = models.alexnet(weights=weights)  # Load model with new weights syntax
        self.model.classifier[6] = torch.nn.Linear(4096, self.num_classes)
        
        self.model.load_state_dict(torch.load(self.config['path'], map_location=torch.device('cpu')))
        self.model.eval()
        return self  # Keep this if you want to chain calls

    def infer(self, image, cam_id):
        transform = transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.25, 0.25, 0.25])
        ])

        input_tensor = transform(image)
        input_batch = input_tensor.unsqueeze(0)
        input_batch = input_batch.to('cuda' if torch.cuda.is_available() else 'cpu')
        

        with torch.no_grad():
            output = self.model(input_batch)

        _, predicted_class = torch.max(output, 1)
        print(f"Predicted Class: {predicted_class}")
        
        self.err_type = predicted_class.item()
        print(f"error type: {self.err_type} in {cam_id}")
        return self.err_type

# --------------------------------------------------------------------
# end of file
# --------------------------------------------------------------------