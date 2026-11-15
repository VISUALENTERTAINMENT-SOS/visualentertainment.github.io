import json
import os
import threading
from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory

BASE = os.path.dirname(os.path.abspath(__file__))
FILE_SARAN = os.path.join(BASE, "saran.json")

# Hanya file website yang disajikan (index.html, style.css, script.js, folder img).
# app.py dan saran.json TIDAK bisa dibuka lewat browser.
app = Flask(__name__, static_folder=None)
kunci = threading.Lock()


# Izin CORS: website di Vercel (domain lain) boleh mengirim saran ke server ini lewat ngrok.
@app.after_request
def izinkan_cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type, ngrok-skip-browser-warning"
    return resp


def baca_saran():
    try:
        with open(FILE_SARAN, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


@app.get("/")
def beranda():
    return send_from_directory(BASE, "index.html")


@app.get("/style.css")
def css():
    return send_from_directory(BASE, "style.css")


@app.get("/script.js")
def js():
    return send_from_directory(BASE, "script.js")


@app.get("/img/<path:nama>")
def gambar(nama):
    return send_from_directory(os.path.join(BASE, "img"), nama)


@app.post("/api/saran")
@app.post("/saran")
def terima_saran():
    data = request.get_json(force=True, silent=True) or {}
    nama = str(data.get("nama", "")).strip()[:40]
    saran = str(data.get("saran", "")).strip()[:500]
    if not nama or not saran:
        return jsonify(ok=False), 400

    item = {
        "waktu": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "nama": nama,
        "saran": saran,
    }
    with kunci:
        semua = baca_saran()
        semua.append(item)
        with open(FILE_SARAN, "w", encoding="utf-8") as f:
            json.dump(semua, f, ensure_ascii=False, indent=2)

    # tampil langsung di terminal VS Code
    try:
        print(f"\n[{item['waktu']}] Saran baru dari {nama}:\n  {saran}\n", flush=True)
    except UnicodeEncodeError:
        pass
    return jsonify(ok=True)


if __name__ == "__main__":
    # host 0.0.0.0 = laptop lain di Wi-Fi yang sama bisa mengakses
    app.run(host="0.0.0.0", port=5000)