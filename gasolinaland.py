import cgi
import datetime
import urllib
import webapp2

from google.appengine.ext import db
from google.appengine.api import users

import jinja2
import os

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class Calculation(db.Model):
    rent = db.FloatProperty()
    savings = db.FloatProperty()
    interest = db.FloatProperty()
    payments = db.FloatProperty()
    price =  db.FloatProperty()
    public = db.BooleanProperty()
    city = db.StringProperty()
    datetime = db.DateTimeProperty(auto_now_add=True)

def mortgage_advisor_key():
    return db.Key.from_path('MortgageAdvisor', 'mortgage_advisor')

class MainPage(webapp2.RequestHandler):
    def get(self):
        calcs = db.GqlQuery("SELECT * "
                            "FROM Calculation "
                            "WHERE ANCESTOR IS :1 "
                            "AND public = TRUE " 
                            "ORDER BY datetime DESC LIMIT 20",
                            mortgage_advisor_key())
        
        interest = self.request.get('interest')
        rent = self.request.get('rent')
        savings = self.request.get('savings')
        payments = self.request.get('payments')
        price = self.request.get('price')
        public = self.request.get('public')
        
        if price:
            template_values = {
                'show_results': True,
                'interest': interest,
                'rent': rent,
                'savings': savings,
                'payments': payments,
                'price': price,
                'public': public,
                'calculations': calcs
            }
        else:
            template_values = {'calculations': calcs}

        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render(template_values))

        if price:
            calc = Calculation( parent = mortgage_advisor_key() )    
            calc.interest = float(interest)
            calc.rent = float(rent)
            calc.savings = float(savings)
            calc.payments = float(payments)
            calc.price = float(price)
            calc.public = True if public == "on" else False
            calc.city = self.request.get('X-AppEngine-City')
            
            calc.put()

app = webapp2.WSGIApplication([('/', MainPage)],
                              debug=True)
