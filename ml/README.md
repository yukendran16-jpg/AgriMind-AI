# AgriMind AI - Machine Learning Pipeline & Dataset Setup

Welcome to the AgriMind AI Crop Disease Detection Machine Learning Pipeline.

## Supported Disease Classes
1. `Tomato___Early_blight` (Display Name: Tomato Early Blight)
2. `Tomato___Late_blight` (Display Name: Tomato Late Blight)
3. `Tomato___healthy` (Display Name: Tomato Healthy)

---

## Dataset Placement Instructions

To train and evaluate the real CNN model, please place your image files in the following directories:

```text
ml/
└── dataset/
    ├── Tomato___Early_blight/    <-- Add JPG/PNG leaf images of Early Blight
    ├── Tomato___Late_blight/     <-- Add JPG/PNG leaf images of Late Blight
    └── Tomato___healthy/         <-- Add JPG/PNG leaf images of Healthy Tomato
```

### Supported Image Formats:
- `.jpg`, `.jpeg`, `.png`

---

## Running Dataset Validation

You can run the automated dataset validator using Python:

```bash
python ml/scripts/validate_dataset.py
```

This script will verify class folders, check for corrupted images, display class distributions, and output a report to `ml/outputs/reports/validation_report.txt`.

---

## Training the CNN Model & Generating Outputs

To train the CNN model, compute evaluation metrics, export confusion matrices, and generate Grad-CAM visualizations:

```bash
python ml/scripts/train_pipeline.py
```

Alternatively, open and run the interactive Jupyter Notebook:
`ml/notebooks/AgriMind_ML_Analysis.ipynb`

### Outputs Generated:
- Trained Keras Model: `ml/models/crop_disease_model.keras`
- Class Mapping: `ml/models/class_names.json`
- Model Metadata: `ml/models/model_metadata.json`
- Accuracy Graph: `ml/outputs/graphs/accuracy.png`
- Loss Graph: `ml/outputs/graphs/loss.png`
- Confusion Matrix: `ml/outputs/confusion_matrix/confusion_matrix.png`
- Classification Report: `ml/outputs/reports/classification_report.txt`
