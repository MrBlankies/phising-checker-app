import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
data = pd.read_csv("dataset.csv")

# Features and label
X = data.drop("phishing", axis=1)
y = data["phishing"]

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    max_depth=8
)
model.fit(X_train, y_train)

# Accuracy check
print("Model Accuracy:", model.score(X_test, y_test))

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model saved successfully")