from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class flight(db.Model):
    Fid = db.Column(db.Integer, primary_key=True)
    From = db.Column(db.String(80), nullable=False)
    To = db.Column(db.String(80), nullable=False)
    Take_off_time = db.Column(db.DateTime,nullable = False)
    Duration = db.Column(db.Integer,nullable = False)
    Company = db.Column(db.String(80), nullable=False)
    NonStop = db.Column(db.Boolean, nullable=False)
    def to_dict(self):
        return {
            "Fid": self.Fid,
            "From": self.From,
            "To":self.To,
            "Take_off_time":self.Take_off_time,
            "Duration":self.Duration,
            "Company":self.Company,
            "NoneStop":self.Nonestop
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
