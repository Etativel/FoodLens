from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoModelForImageClassification, AutoImageProcessor
from PIL import Image, UnidentifiedImageError
import torch
import io
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FoodLensAPI")

app = Flask(__name__, static_folder="static")
CORS(
    app,
    resources={r"/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]}}
)
    
@app.route('/favicon.ico')
def favicon():
    try:
        return send_from_directory(app.static_folder, 'favicon.ico')
    except Exception as e:
        logger.error(f"Favicon error: {e}")
        return '', 204


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to the FoodLens Image-Prediction API",
        "endpoints": {
            "POST /predict": "Upload an image file under form-field `file`"
        }
    })


USE_HF_HUB = os.getenv("USE_HF_HUB", "false").lower() == "true"
MODEL_ID = "nateraw/food"
LOCAL_MODEL_DIR = "../../model"

if USE_HF_HUB:
    token = os.getenv("HUGGINGFACE_AUTH_TOKEN")
    if not token:
        raise RuntimeError("HUGGINGFACE_AUTH_TOKEN must be set when USE_HF_HUB=true")

    logger.info(f"Loading model from Hugging Face Hub: {MODEL_ID}")
    model = AutoModelForImageClassification.from_pretrained(
        MODEL_ID, token=token
    )
    processor = AutoImageProcessor.from_pretrained(
        MODEL_ID, token=token
    )
else:
    logger.info(f"Loading model locally from: {LOCAL_MODEL_DIR}")
    model = AutoModelForImageClassification.from_pretrained(LOCAL_MODEL_DIR)
    processor = AutoImageProcessor.from_pretrained(LOCAL_MODEL_DIR)

model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
logger.info(f"Model loaded on device: {device}")

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    # Ensure file is present
    if "file" not in request.files:
        logger.warning("No file part in request.files")
        return jsonify({"error": "no file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        logger.warning("Empty filename in uploaded file")
        return jsonify({"error": "no file uploaded"}), 400

    # Read and validate image bytes
    try:
        img_bytes = file.read()
        logger.info(f"Received file: {file.filename}, size: {len(img_bytes)} bytes, content-type: {file.content_type}")
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except UnidentifiedImageError:
        logger.error("PIL cannot identify image file", exc_info=True)
        return jsonify({"error": "cannot identify image file"}), 400
    except Exception as e:
        logger.exception("Unexpected error loading image")
        return jsonify({"error": f"error loading image: {e}"}), 500

    # Preprocess
    try:
        inputs = processor(images=image, return_tensors="pt").to(device)
    except Exception as e:
        logger.exception("Error during preprocessing")
        return jsonify({"error": f"preprocessing failed: {e}"}), 500

    # Inference
    try:
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            idx = logits.argmax(-1).item()
        label = model.config.id2label[idx]
    except Exception as e:
        logger.exception("Error during model inference")
        return jsonify({"error": f"inference failed: {e}"}), 500

    logger.info(f"Predicted label: {label}")
    return jsonify({"predicted_label": label}), 200

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)