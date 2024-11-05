from flask import Flask, jsonify
from flask_cors import CORS
from model import db,flight,flight_class

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
# db = SQLAlchemy(app)

db.init_app(app)

CORS(app)  # Enable CORS for all routes to allow requests from the frontend

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/get_all_flights', methods=['GET'])
def get_all_flights():
    arr = []
    flights = flight.query.all()
    flights_list = [flight.to_dict() for flight in flights]
    for f in flights_list:
        print(f)
        price_list = flight_class.query.filter_by(Fid=f['Fid']).all()
        for p in price_list:
            obj = f | p.to_dict()
            arr.append(obj)
    print(arr)
    return jsonify({"flights": arr})

@app.route('/api/find_flight',methods=['POST'])
def find_flight(request):
    from model import flight
    data = request.get_json()
    from_location = data.get('from')
    to_location = data.get('to')
    take_off = data.get('take_off')
    flights = flight.query.filter_by(From=from_location, To=to_location , Take_off_time = take_off).all()

    if not flights:
        #call scraping function
        flights = flight.query.filter_by(From=from_location, To=to_location , Take_off_time = take_off).all()

    flights_list = [flight.to_dict() for flight in flights]
    return jsonify({"flights": flights_list})

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
