from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class flight(db.Model):
    Fid = db.Column(db.Integer, primary_key=True)
    From = db.Column(db.String(80), nullable=False)
    To = db.Column(db.String(80), nullable=False)
    Date = db.Column(db.String(12), nullable=False)
    Take_off_time = db.Column(db.String,nullable = False)
    Arrival_time = db.Column(db.String, nullable = False)
    Duration = db.Column(db.String,nullable = False)
    Company = db.Column(db.String(80), nullable=False)
    def to_dict(self):
        return {
            "Fid": self.Fid,
            "From": self.From,
            "To":self.To,
            "Date": self.Date,
            "Take_off_time":self.Take_off_time,
            "Arrival_time" :self.Arrival_time,
            "Duration":self.Duration,
            "Company":self.Company
        }

    def __repr__(self):
        return f'<Flight {self.Fid,self.From,self.To}>'
    
class flight_class(db.Model):
    Fid = db.Column(db.Integer,db.ForeignKey('flight.Fid'),nullable=False)
    Class_flight = db.Column(db.String(80), nullable=False)
    Price = db.Column(db.Integer,nullable = False)

    __table_args__ = (
        db.PrimaryKeyConstraint('Fid', 'Class_flight'),
    )

    def to_dict(self):
        return {
            "Fid": self.Fid,
            "Class_flight": self.Class_flight,
            "Price":self.Price
        }

    def __repr__(self):
        return f'<Flight {self.Fid,self.Class_flight}>'
