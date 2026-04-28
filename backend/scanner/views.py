from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pickle
import os
from urllib.parse import urlparse

# Load model once
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "model.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)


def test_api(request):
    return JsonResponse({"message": "Backend is working"})


@csrf_exempt
def predict_url(request):
    if request.method == "POST":
        data = json.loads(request.body)
        url = data.get("url", "").strip()


        # INPUT VALIDATION
        parsed_url = urlparse(url)

        if not parsed_url.scheme:
            return JsonResponse({
                "error": "Invalid URL format"
            }, status=400)

        if not url:
            return JsonResponse({
                "error": "URL cannot be empty"
            }, status=400)

        if len(url) < 7:
            return JsonResponse({
                "error": "URL too short"
            }, status=400)

        if len(url) > 300:
            return JsonResponse({
                "error": "URL too long"
            }, status=400)

        # Simple feature extraction
        url_length = len(url)
        has_https = 1 if "https" in url else 0
        has_at_symbol = 1 if "@" in url else 0
        dots = url.count(".")
        has_ip = 1 if any(char.isdigit() for char in url) else 0

        features = [[url_length, has_https, has_at_symbol, dots, has_ip]]

        prediction = model.predict(features)[0]

        # confidence score (IMPORTANT)
        proba = model.predict_proba(features)[0]
        confidence = float(max(proba))

        result = "Phishing" if prediction == 1 else "Safe"

        return JsonResponse({
            "url": url,
            "prediction": result,
            "confidence": round(confidence, 2)
        })

    return JsonResponse({"error": "POST request required"})