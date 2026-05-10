import pandas as pd
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pickle
import os
from urllib.parse import urlparse
from .models import ScanHistory
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

# Load model once
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "model.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)


def test_api(request):
    return JsonResponse({"message": "Backend is working"})

from django.http import JsonResponse

def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "username": request.user.username
        })

    return JsonResponse({
        "error": "Not authenticated"
    }, status=401)

# Login logic --------------------------------
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON body"})

        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return JsonResponse({"error": "Username and password required"})

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"})

        user = User.objects.create_user(username=username, password=password)
        login(request, user)

        return JsonResponse({"message": "User registered successfully"})

    return JsonResponse({"error": "POST request required"})

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON body"})

        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        if not username or not password:
            return JsonResponse({"error": "Username and password required"})

        user = authenticate(username=username, password=password)

        if user:
            login(request, user)
            return JsonResponse({"message": "Login successful"})

        return JsonResponse({"error": "Invalid credentials"})

    return JsonResponse({"error": "POST request required"})

def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})
# ----------------------------------

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_history(request):
    ScanHistory.objects.filter(user=request.user).delete()
    return JsonResponse({"message": "History deleted"})

@csrf_exempt
def predict_url(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except Exception as e:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
       
        url = data.get("url", "").strip()


        # INPUT VALIDATION
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
        
        parsed_url = urlparse(url)

        if not parsed_url.scheme:
            return JsonResponse({
                "error": "Invalid URL format"
            }, status=400)

        # Simple feature extraction
        url_length = len(url)
        has_https = 1 if "https" in url else 0
        has_at_symbol = 1 if "@" in url else 0
        dots = url.count(".")
        has_ip = 1 if any(char.isdigit() for char in url) else 0

        features = pd.DataFrame([{
            "url_length": url_length,
            "has_https": has_https,
            "has_at_symbol": has_at_symbol,
            "dots": dots,
            "has_ip": has_ip
        }])

        prediction = model.predict(features)[0]

        # confidence score 
        proba = model.predict_proba(features)[0]
        confidence = float(max(proba))

        result = "Phishing" if prediction == 1 else "Safe"

        # Save scan result to database
        if request.user.is_authenticated:
            ScanHistory.objects.create(
                user=request.user,
                url=url,
                prediction=result,
                confidence=round(confidence, 2)
            )
        else:
            ScanHistory.objects.create(
                url=url,
                prediction=result,
                confidence=round(confidence, 2)
            )

        return JsonResponse({
            "url": url,
            "prediction": result,
            "confidence": round(confidence, 2)
        })

    return JsonResponse({"error": "POST request required"})

def scan_history(request):
    if request.user.is_authenticated:
        scans = ScanHistory.objects.filter(
            user=request.user
        ).order_by("-created_at")[:10]
    else:
        scans = ScanHistory.objects.none()

    data = []

    for scan in scans:
        data.append({
            "url": scan.url,
            "prediction": scan.prediction,
            "confidence": scan.confidence,
            "date": scan.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return JsonResponse(data, safe=False)