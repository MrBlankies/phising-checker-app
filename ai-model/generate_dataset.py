import csv
import random

def generate_row():
    url_length = random.randint(10, 120)
    has_https = random.randint(0, 1)
    has_at_symbol = random.randint(0, 1)
    dots = random.randint(1, 8)

    # NEW FEATURE
    has_ip = random.randint(0, 1)

    risk_score = 0

    if url_length > 70:
        risk_score += 1
    if has_https == 0:
        risk_score += 1
    if has_at_symbol == 1:
        risk_score += 1
    if dots > 4:
        risk_score += 1
    if has_ip == 1:
        risk_score += 1

    if risk_score >= 3:
        label = 1 if random.random() > 0.1 else 0
    else:
        label = 0 if random.random() > 0.1 else 1

    return [url_length, has_https, has_at_symbol, dots, has_ip, label]


with open("dataset.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["url_length", "has_https", "has_at_symbol", "dots", "has_ip", "phishing"])
    for _ in range(2000):
        writer.writerow(generate_row())

print("new dataset created")