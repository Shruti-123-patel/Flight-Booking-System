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

def get_flights_day_wise(From, To,Date):
    from sqlalchemy import func
    from datetime import date

    target_date = datetime.strptime(Date, "%Y-%m-%d").date()

    flights = db.session.query(flight).filter(
        func.date(flight.Take_off_time) == target_date,
        flight.From==From,
        flight.To==To
    ).all()
    flights_list = [flight.to_dict() for flight in flights]
    return flights_list

def get_flight_price(fid):
    flights = flight_class.query.filter_by(Fid = fid).all()
    flight_actual = flight.query.filter_by(Fid = fid)
    for f in flight_actual:
        flight_actual_dict = f.to_dict()
        flights_list = [flight_actual_dict | flight.to_dict() for flight in flights]
    return flights_list

def get_To():
    flight_To = db.session.query(flight.To).distinct().all()
    json_serializable_data = [item[0] for item in flight_To]
    print(json_serializable_data)
    return json_serializable_data


def get_From():
    flight_From = db.session.query(flight.From).distinct().all()
    json_serializable_data = [item[0] for item in flight_From]
    print(json_serializable_data)
    return json_serializable_data
