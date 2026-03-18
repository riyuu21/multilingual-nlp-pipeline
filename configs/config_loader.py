import yaml
import os

CONFIG_PATH = os.path.join(os.path.dirname(__file__), "router_rules.yaml")

def load_config():
    if not os.path.exists(CONFIG_PATH):
        raise FileNotFoundError("router_rules.yaml not found in configs folder")
    
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)