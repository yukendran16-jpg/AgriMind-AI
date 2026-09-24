import os
import json
from typing import Dict, List

# Supported Dataset Classes Mapping
DISEASE_CLASSES_CONFIG: Dict[str, Dict[str, str]] = {
    "Tomato___Early_blight": {
        "display_name": "Tomato Early Blight",
        "scientific_name": "Alternaria solani",
        "key": "EARLY_BLIGHT",
        "symptoms": [
            "Concentric dark rings on mature lower leaves",
            "Yellow chlorotic halos surrounding lesions",
            "Foliar necrosis and early defoliation"
        ]
    },
    "Tomato___Late_blight": {
        "display_name": "Tomato Late Blight",
        "scientific_name": "Phytophthora infestans",
        "key": "LATE_BLIGHT",
        "symptoms": [
            "Water-soaked dark lesions on leaf tips and stems",
            "White velvety fungal growth on leaf undersides during high humidity",
            "Rapid desiccation and canopy decay"
        ]
    },
    "Tomato___healthy": {
        "display_name": "Tomato Healthy",
        "scientific_name": "Solanum lycopersicum",
        "key": "HEALTHY",
        "symptoms": [
            "Vibrant green leaf coloration",
            "Turgid leaf structure without necrotic spots",
            "Optimal foliage growth"
        ]
    }
}

CLASS_NAMES: List[str] = list(DISEASE_CLASSES_CONFIG.keys())
DISPLAY_NAMES: List[str] = [v["display_name"] for v in DISEASE_CLASSES_CONFIG.values()]
IMAGE_SIZE = (128, 128)
CONFIDENCE_THRESHOLD = 0.60
