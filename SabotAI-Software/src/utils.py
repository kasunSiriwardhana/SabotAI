# ------------------------------------
# This file contains utility functions that are used in the project to load the config.yaml.
# ------------------------------------

import yaml

def get_config(config_path="config/config.yaml"):
    with open(config_path, "r") as file:
        return yaml.safe_load(file)

# ------------------------------------
# end of file
# ------------------------------------