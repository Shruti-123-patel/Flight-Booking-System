Team Members
1. Shruti Patel 24M0825
2. Siddhi Pevekar 24M2126
3. Garima Jain 24M0772

1. In frontend folder : npm i
2. Make env according to your system
   a. python -m venv env 
   b. env\Scripts\activate (Windows)
      source env/bin/activate (Linux) 
3. In that env install these 3 
    a. pip install flask
    b. pip install SQLAlchemy
    c. pip install sqlite
    d. install any other dependencies if needed (based on your env)


Do the following on the backend server to operate on the data

1. To add dummy data into the database: /api/add_dummy 
2. To delete the data: api/delete_all
3. To search the flight: /api/find_flight
4. To update flight data: /api/update/{flightid} 


Now run backend: 
  cd backend 
  py app.py 

run frontend: 
cd frontend 
npm start


