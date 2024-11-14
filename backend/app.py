from flask import Flask, jsonify,request
from flask_cors import CORS
from model import db,flight,flight_class
from sqlalchemy import cast, Date

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
# db = SQLAlchemy(app)

db.init_app(app)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/get_all_flights', methods=['GET'])
def get_all_flights():
    arr = []
    flights = flight.query.all()
    flights_list = [flight.to_dict() for flight in flights]
    for f in flights_list:
        # print(f)
        price_list = flight_class.query.filter_by(Fid=f['Fid']).all()
        for p in price_list:
            obj = f | p.to_dict()
            arr.append(obj)
    # print(arr)
    return jsonify({"flights": arr})

@app.route('/api/find_flight_date',methods=['POST'])
def find_flight():
    from model import flight
    from view import get_flights_day_wise
    #print(request.get_json())
    data = request.get_json()
    from_location = data.get('from')
    to_location = data.get('to')
    take_off = data.get('date')
    # print(take_off)
    # flights = flight.query.filter_by(From=from_location, To=to_location , Take_off_time = take_off).all()
    flights = get_flights_day_wise(from_location,to_location,take_off)
    return jsonify({"flights": flights})

@app.route('/api/find_fight_data',methods=['GET'])
def find_flight_class_price():
    from view import get_flight_price
    fid = request.args.get('fid')
    flights = get_flight_price(fid)
    return jsonify({"flights": flights})

@app.route('/api/delete_all',methods=['GET'])
def delete_all():
    from view import clear_db
    clear_db()
    return jsonify({"message": "Deletion done"})

@app.route('/api/add_dummy',methods=['GET'])
def add_all():
    from view import list_from_json,add_flights_from_list
    list = list_from_json('dummy.json')
    add_flights_from_list(list)
    return jsonify({"message": "addition done"})

@app.route('/api/update', methods=['PUT'])
def update_user(fid,request):
    new_price = request.json.get('Price')
    new_class = request.json.get('Class')

    flight_ = flight.query.get(fid)
    if flight_ is None:
        return jsonify({'error': 'Flight not found'}), 404

    if new_price:
        flight_.Price = new_price
    if new_class:
        flight_.Class = new_class

    db.session.commit()

    return jsonify({'message': 'Flight updated successfully'})

with app.app_context():
    db.create_all() 

if __name__ == '__main__':
    app.run(debug=True)
