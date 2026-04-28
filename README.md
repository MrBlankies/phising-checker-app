# 🛡️ HookTrap – AI Phishing URL Detection Web App

## Project Overview
HookTrap is a full-stack web application that uses machine learning to detect whether a URL is **safe or phishing**.  
It is designed as a cybersecurity-focused project combining AI and cloud/web technologies.

---

## Features
- User inputs a URL
- AI model predicts if the URL is **Phishing or Safe**
- REST API built with Django
- Machine Learning classification model (Random Forest)
- Simple testing interface using API tools
- Backend ready for frontend integration (React)

---

## AI Component
- Model Type: Classification (Random Forest)
- Input Features:
  - URL length
  - HTTPS presence
  - '@' symbol detection
  - Number of dots in URL
- Output:
  - `Phishing` or `Safe`

---

## Tech Stack

### Backend
- Django
- Django REST Framework

### AI / ML
- Python
- Pandas
- Scikit-learn

### Tools
- Git & GitHub
- Thunder Client (API testing)

---

## API Endpoints

### Test Endpoint
GET /api/test/

### Prediction Endpoint
POST /api/predict/


Example request:
```json
{
  "url": "http://example.com"
}
```
Example response:
```json
{
  "url": "https://example.com",
  "prediction": "Safe"
}
```
