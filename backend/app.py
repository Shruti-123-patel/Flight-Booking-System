from flask import Flask, jsonify,request
from flask_cors import CORS
from model import db,flight,flight_class
from sqlalchemy import cast, Date
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import pandas as pd
import re
from flask_migrate import Migrate

app = Flask(__name__)
migrate = Migrate(app, db)

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

    # print("hello garima ")
    # print(from_location,to_location)
    scrape_flights(from_location, to_location, take_off)

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

@app.route('/api/get_To', methods=['GET'])
def To():
    from view import get_To
    sts = get_To()
    return jsonify({'st': sts})

@app.route('/api/get_From', methods=['GET'])
def From():
    from view import get_From
    sts = get_From()
    return jsonify({'st': sts})



def setup_driver():
    options = Options()
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--disable-popup-blocking')
    options.add_argument('--disable-blink-features=AutomationControlled')  # Avoid detection as bot
    options.add_argument('--headless')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def date_mod(depart_date):
    from datetime import datetime

    # Input date in dd-mm-yyyy format
    input_date = depart_date
    print(input_date)
    # Convert the string to a datetime object
    date_object = datetime.strptime(input_date, "%Y-%m-%d")

    # Format the date to the desired output
    formatted_date = date_object.strftime("%a, %d %b %y")  # %a for weekday, %d for day, %b for month, %y for year

    print(formatted_date)

def scrape_flight_data(driver, from_city, to_city, depart_date):
    driver.get("https://tickets.paytm.com/flights")

    # Input "Leaving from"
    from_input = driver.find_element(By.ID, "srcCode")
    driver.execute_script("arguments[0].click();", from_input)
    from_input_field = driver.find_element(By.ID, "text-box")
    from_input_field.send_keys(from_city)
    time.sleep(10)
    from_input_field.send_keys(Keys.ENTER)

    # Input "Going to"
    to_input = driver.find_element(By.ID, "destCode")
    driver.execute_script("arguments[0].click();", to_input)
    to_input_field = driver.find_element(By.ID, "text-box")
    to_input_field.send_keys(to_city)
    time.sleep(10)
    to_input_field.send_keys(Keys.ENTER)

    # date input
    date_input = driver.find_element(By.ID, "departureDate")
    travel_date = date_mod(depart_date)  # Format: MM-DD-YYYY
    driver.execute_script("arguments[0].value = arguments[1];", date_input, travel_date)

    # Click "Search"
    search_button = driver.find_element(By.XPATH, "//button[@id='flightSearch']")
    driver.execute_script("arguments[0].click();", search_button)
    time.sleep(5)

    # Scrape flight data
    flight_results = driver.find_elements(By.XPATH, "//div[@class='pIInI']")
    scraped_data = []
    for flight in flight_results:  # Limit to first 5 results
        try:
            airline = flight.find_element(By.XPATH, ".//div[@class='_2eEvR']//div[@class='_2cP56']").text
            
            departure = flight.find_element(By.XPATH, ".//div[@class='_29g4q']//span[@class='_3gpc5']").text
            departure = departure.replace("\n", " ").strip()
            
            arrival = flight.find_element(By.XPATH, ".//div[@class='_29g4q _2amoT']//span[@class='_3gpc5']").text
            arrival = arrival.replace("\n", " ").strip()
            
            dur_stop = flight.find_element(By.XPATH, ".//div[@class='_2nwRl']//span[@class='_1J4f_']").text
            cleaned_text = dur_stop.strip(" \u2014")
            parts = cleaned_text.split(" \u2022 ")
            duration = parts[0].strip()
            stop_status = parts[1].strip() if len(parts) > 1 else None

            price = flight.find_element(By.XPATH, ".//div[@class='_3VUCr']//div[@class='_2PJH4']//div[@class='_2MkSl']").text
            price = int(re.sub(r"[^\d]", "", price))  

            # from view import add_flight
            # add_flight(from_city, to_city, departure,depart_date, arrival, duration, airline, "Economic", price)
            print(from_city,to_city)
            scraped_data.append({
                "From": from_city,
                "To": to_city,
                "Company": airline,
                "Date": depart_date,
                "Take_off": departure,
                "Arrival": arrival,
                "Duration": duration,
                "NumberOfStops" : stop_status,
                "Price": price
            })
        except Exception as e:
            print("Error scraping flight:", e)

    return scraped_data

def save_to_csv(flight_data, filename="flights.csv"):
    df = pd.DataFrame(flight_data)
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

def csv_to_db():
    from view import add_flight
    data = pd.read_csv("flights.csv")

    for index, row in data.iterrows():
        add_flight(row["From"],row["To"],row["Take_off"],row["Date"],row["Arrival"],row["Duration"],row["Company"],"Economy",row["Price"],row["NumberOfStops"])

def scrape_flights(from_city, to_city, depart_date):
    # Setup the driver
    driver = setup_driver()
    try:
        # Scrape flight data
        # print("from calling",from_city,to_city)
        flight_data = scrape_flight_data(driver, from_city, to_city, depart_date)

        # Save the data to CSV (optional, but you can store it in the database as well)
        save_to_csv(flight_data)
        csv_to_db()
        return jsonify({"flights": flight_data})
    finally:
        driver.quit()



with app.app_context():
    db.create_all() 

if __name__ == '__main__':
    app.run(debug=True)
