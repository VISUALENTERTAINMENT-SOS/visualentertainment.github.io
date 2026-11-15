import json
import os

FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "saran.json")

try:
    with open(FILE, encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    data = []

if not data:
    print("Belum ada saran.")
else:
    for i, d in enumerate(data, 1):
        print(f"{i}. [{d['waktu']}] {d['nama']}\n   {d['saran']}\n")
    print(f"Total: {len(data)} saran")