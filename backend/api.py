from flask import Flask, request, jsonify, send_from_directory
from transformers import AutoModelForImageClassification, AutoImageProcessor
from PIL import Image
import torch
import io

# 1️Initialize Flask

app = Flask(__name__, static_folder="static")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico')

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to the FoodLens Image-Prediction API",
        "endpoints": {
            "POST /predict": "Upload an image file under form-field `file`"
        }
    })


# load the current mode
MODEL_DIR = "../food" 
model = AutoModelForImageClassification.from_pretrained(MODEL_DIR)
processor = AutoImageProcessor.from_pretrained(MODEL_DIR)
model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# define the endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "no file uploaded"}), 400

    img_bytes = request.files["file"].read()
    image = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # preprocess
    inputs = processor(images=image, return_tensors="pt").to(device)

    #inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        idx = logits.argmax(-1).item()

    # map idx to human label
    label = model.config.id2label[idx]
    return jsonify({"predicted_label": label})

# run the api
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
