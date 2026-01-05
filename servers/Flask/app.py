from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>HAALLOOOOOOOR!!</p>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)