1) git pull origin main
2) In frontend folder : npm i
3) Make env according to your system
   a. python -m venv env
   b. env\Scripts\activate (Windows)
      source env/bin/activate (Linux)
4) In that env install these 3
    a. pip install django
    b. pip install djangorestframework
    c. pip install django-cors-headers
Now run backend:
cd backend
py manage.py runserver

run frontend:
cd frontend
npm start

