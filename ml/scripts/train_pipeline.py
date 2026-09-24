import os
import json
import time
import datetime
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image
from sklearn.metrics import classification_report, confusion_matrix

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau

from class_config import DISEASE_CLASSES_CONFIG, CLASS_NAMES, DISPLAY_NAMES, IMAGE_SIZE

def train_crop_disease_model(
    dataset_dir: str = "ml/dataset",
    epochs: int = 20,
    batch_size: int = 32
):
    print("=" * 60)
    print("AgriMind AI - CNN Training & ML Pipeline Execution")
    print(f"TensorFlow Version: {tf.__version__}")
    print("=" * 60)

    # Verify images exist
    total_imgs = 0
    for c in CLASS_NAMES:
        cpath = os.path.join(dataset_dir, c)
        if os.path.exists(cpath):
            total_imgs += len([f for f in os.listdir(cpath) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])

    if total_imgs == 0:
        print("[ERROR] No images found in ml/dataset/. Please place dataset images into:")
        for c in CLASS_NAMES:
            print(f"  ml/dataset/{c}/")
        print("Training aborted.")
        return

    # Load Train/Val Split using image_dataset_from_directory
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=batch_size
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=IMAGE_SIZE,
        batch_size=batch_size
    )

    # Save Class Names JSON
    actual_classes = train_ds.class_names
    class_json_path = "ml/models/class_names.json"
    os.makedirs(os.path.dirname(class_json_path), exist_ok=True)
    with open(class_json_path, "w") as f:
        json.dump(actual_classes, f, indent=4)
    print(f"Saved class mapping to: {class_json_path}")

    # Data Performance Pipeline
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # Build CNN Model Architecture
    model = models.Sequential([
        layers.Rescaling(1./255, input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.3),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.4),
        layers.Dense(len(actual_classes), activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    # Callbacks
    model_save_path = "ml/models/crop_disease_model.keras"
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
        ModelCheckpoint(model_save_path, monitor='val_accuracy', save_best_only=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3)
    ]

    print("\nStarting CNN Model Training...")
    start_time = time.time()
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks
    )
    training_time = time.time() - start_time
    print(f"\nTraining Completed in {training_time:.2f} seconds.")

    # 1. Plot Accuracy Graph
    plt.figure(figsize=(8, 5))
    plt.plot(history.history['accuracy'], label='Train Accuracy', color='#2ecc71', linewidth=2)
    plt.plot(history.history['val_accuracy'], label='Val Accuracy', color='#3498db', linewidth=2)
    plt.title('AgriMind AI - CNN Model Accuracy', fontsize=14, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    acc_path = "ml/outputs/graphs/accuracy.png"
    os.makedirs(os.path.dirname(acc_path), exist_ok=True)
    plt.savefig(acc_path)
    plt.close()
    print(f"Accuracy graph saved to: {acc_path}")

    # 2. Plot Loss Graph
    plt.figure(figsize=(8, 5))
    plt.plot(history.history['loss'], label='Train Loss', color='#e74c3c', linewidth=2)
    plt.plot(history.history['val_loss'], label='Val Loss', color='#f39c12', linewidth=2)
    plt.title('AgriMind AI - CNN Model Loss', fontsize=14, fontweight='bold')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.5)
    loss_path = "ml/outputs/graphs/loss.png"
    plt.savefig(loss_path)
    plt.close()
    print(f"Loss graph saved to: {loss_path}")

    # 3. Evaluate on Validation Set & Confusion Matrix
    y_true = []
    y_pred = []
    for images, labels in val_ds:
        preds = model.predict(images, verbose=0)
        y_true.extend(labels.numpy())
        y_pred.extend(np.argmax(preds, axis=1))

    cm = confusion_matrix(y_true, y_pred)
    display_labels = [DISEASE_CLASSES_CONFIG.get(c, {}).get("display_name", c) for c in actual_classes]

    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=display_labels, yticklabels=display_labels)
    plt.title('AgriMind AI - Confusion Matrix', fontsize=14, fontweight='bold')
    plt.xlabel('Predicted Class')
    plt.ylabel('True Class')
    cm_path = "ml/outputs/confusion_matrix/confusion_matrix.png"
    os.makedirs(os.path.dirname(cm_path), exist_ok=True)
    plt.savefig(cm_path, bbox_inches='tight')
    plt.close()
    print(f"Confusion matrix saved to: {cm_path}")

    # 4. Classification Report
    clr_report = classification_report(y_true, y_pred, target_names=display_labels)
    report_path = "ml/outputs/reports/classification_report.txt"
    with open(report_path, "w") as f:
        f.write("AgriMind AI - Model Classification Report\n")
        f.write("=======================================\n")
        f.write(clr_report)
    print(f"Classification report saved to: {report_path}")

    # 5. Metadata JSON Export
    final_val_acc = float(history.history['val_accuracy'][-1])
    final_val_loss = float(history.history['val_loss'][-1])

    metadata = {
        "model_name": "AgriMind Crop Disease Classifier (CNN)",
        "version": "1.0.0",
        "training_date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "dataset_classes": actual_classes,
        "display_classes": display_labels,
        "image_size": IMAGE_SIZE,
        "total_dataset_images": total_imgs,
        "epochs": len(history.history['accuracy']),
        "val_accuracy": round(final_val_acc, 4),
        "val_loss": round(final_val_loss, 4),
        "framework": f"TensorFlow {tf.__version__}"
    }

    meta_path = "ml/models/model_metadata.json"
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=4)
    print(f"Model metadata exported to: {meta_path}")

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    dataset_path = os.path.join(base_dir, "ml", "dataset")
    train_crop_disease_model(dataset_path)
