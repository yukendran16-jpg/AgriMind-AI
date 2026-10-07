import os
import sys
from PIL import Image
from class_config import DISEASE_CLASSES_CONFIG, CLASS_NAMES

def validate_dataset(dataset_dir: str = "ml/dataset") -> dict:
    print("=" * 60)
    print("AgriMind AI - Dataset Validation Started...")
    print("=" * 60)

    if not os.path.exists(dataset_dir):
        print(f"[ERROR] Dataset directory '{dataset_dir}' does not exist.")
        return {"valid": False, "reason": "Dataset directory missing"}

    stats = {}
    total_images = 0
    corrupted_files = []
    unsupported_files = []
    supported_extensions = {".jpg", ".jpeg", ".png"}

    for class_folder in CLASS_NAMES:
        class_path = os.path.join(dataset_dir, class_folder)
        if not os.path.exists(class_path):
            print(f"[ERROR] Required class folder missing: '{class_folder}'")
            stats[class_folder] = {"count": 0, "status": "MISSING"}
            continue

        files = os.listdir(class_path)
        valid_count = 0

        for f in files:
            file_path = os.path.join(class_path, f)
            if os.path.isdir(file_path):
                continue

            ext = os.path.splitext(f)[1].lower()
            if ext not in supported_extensions:
                unsupported_files.append(file_path)
                continue

            # Check image integrity
            try:
                with Image.open(file_path) as img:
                    img.verify()
                valid_count += 1
            except Exception:
                corrupted_files.append(file_path)

        display_name = DISEASE_CLASSES_CONFIG[class_folder]["display_name"]
        print(f"Class: {class_folder} ({display_name})")
        print(f"  Valid Images: {valid_count}")

        stats[class_folder] = {
            "display_name": display_name,
            "count": valid_count,
            "status": "OK" if valid_count > 0 else "EMPTY"
        }
        total_images += valid_count

    print("-" * 60)
    print(f"Total Valid Images Found: {total_images}")
    print(f"Corrupted Files Detected: {len(corrupted_files)}")
    print(f"Unsupported File Types: {len(unsupported_files)}")
    print("=" * 60)

    # Export report to ml/outputs/reports/validation_report.txt
    report_path = "ml/outputs/reports/validation_report.txt"
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    with open(report_path, "w") as f:
        f.write("AgriMind AI - Dataset Validation Report\n")
        f.write("=======================================\n")
        for k, v in stats.items():
            f.write(f"{k} ({v['display_name']}): {v['count']} images [{v['status']}]\n")
        f.write(f"\nTotal Valid Images: {total_images}\n")
        f.write(f"Corrupted Files: {len(corrupted_files)}\n")
        f.write(f"Unsupported Files: {len(unsupported_files)}\n")

    print(f"Validation report saved to: {report_path}")

    is_valid = total_images > 0 and all(v["count"] > 0 for v in stats.values())
    return {
        "valid": is_valid,
        "total_images": total_images,
        "stats": stats,
        "corrupted_files": corrupted_files
    }

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    dataset_path = os.path.join(base_dir, "ml", "dataset")
    validate_dataset(dataset_path)
