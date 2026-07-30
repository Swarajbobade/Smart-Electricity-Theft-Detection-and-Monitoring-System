from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

apparentPower = 0.0
voltage = 0.0
current = 0.0
theft = False


@app.route('/send', methods=['POST'])
@cross_origin()
def send():
    global apparentPower, voltage, current
    data = request.get_json()
    voltage = float(data['voltage'])
    current = float(data['current'])
    apparentPower = float(data['apparentPower'])
    print(f"Voltage: {voltage}V, Current: {current}A, Apparent Power: {apparentPower}W")
    return 'Success'


@app.route('/fetch', methods=['GET'])
@cross_origin()
def fetch():
    return str(apparentPower)


@app.route('/voltage', methods=['GET'])
@cross_origin()
def get_voltage():
    return jsonify(voltage)


@app.route('/current', methods=['GET'])
@cross_origin()
def get_current():
    return jsonify(current)


@app.route('/theft', methods=['GET'])
@cross_origin()
def get_theft():
    return jsonify(theft=theft)


@app.route('/setTheft', methods=['POST'])
@cross_origin()
def set_theft():
    global theft
    data = request.get_json()
    if 'theft' in data:
        theft = bool(data['theft'])
        print(f"Theft status updated to: {theft}")
        return jsonify(status='updated', theft=theft), 200
    else:
        return jsonify(status='error', message='Missing theft value'), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
