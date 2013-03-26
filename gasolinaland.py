import webapp2
import re

from google.appengine.ext import db
from google.appengine.api import users

import jinja2
import os

def number_filter(x, sep=',', dot='.'):
    num, _, frac = str(x).partition(dot)
    num = re.sub(r'(\d{3})(?=\d)', r'\1'+sep, num[::-1])[::-1]
    if frac:
        num += dot + frac
    return num

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

jinja_environment.filters['number_format'] = number_filter

class Calculation(db.Model):
    rent = db.FloatProperty()
    savings = db.FloatProperty()
    interest = db.FloatProperty()
    payments = db.FloatProperty()
    price =  db.FloatProperty()
    public = db.BooleanProperty()
    city = db.StringProperty()
    datetime = db.DateTimeProperty(auto_now_add=True)

class Feedback(db.Model):
    name = db.StringProperty()
    email = db.StringProperty()
    feedback = db.StringProperty()
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

class FeedbackPage(webapp2.RequestHandler):
    def post(self):
        name = self.request.get('name')
        email = self.request.get('email')
        feedback = self.request.get('content')
        
        f = Feedback(parent = mortgage_advisor_key())  
        f.name = name
        f.email = email
        f.feedback = feedback
        f.put()
         
class AboutPage(webapp2.RequestHandler):
    def get(self):
        a = 3
        
app = webapp2.WSGIApplication([('/', MainPage),
                               ('/feedback', FeedbackPage),
                               ('/about', AboutPage)],
                              debug=True)
