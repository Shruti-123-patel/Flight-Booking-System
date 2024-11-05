from app import db
from flask import  jsonify
from model import flight,flight_class
from datetime import datetime, date, time, timedelta
import app
import json

def add_flight(From,To,Take_off_time,Duration,Company,Class_flight,Price):
    Take_off_time_ = datetime.strptime(Take_off_time, '%Y-%m-%dT%H:%M:%S')
    new_f = flight(From = From,To = To,Take_off_time = Take_off_time_,Duration = Duration,Company =Company )
    db.session.add(new_f)
    db.session.commit()
    new_p = flight_class(Fid = new_f.Fid,Price=Price,Class_flight=Class_flight)
    db.session.add(new_p)
    db.session.commit()

def add_flights_from_list(flights):
    print(flights)
    if flights is not None:
        for flight_data in flights:
            print(flight_data)
            # print(**flight_data)
            add_flight(**flight_data)

def list_from_json(file):
    with open(file, 'r') as file:
        json_data = json.load(file)  
    array = json_data["data"]
    add_flights_from_list(array)

def clear_db():
    with db.session.begin():
        for table in db.metadata.tables.values():
            db.session.execute(table.delete())

    db.session.commit()
            

