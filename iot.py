# Reads data from Arduino and saves to file
import serial
import pyrebase
import math

config = {
  "apiKey": "AIzaSyBmxV78S_W_68fp7H_qgSQFubJdjVyaOCE",
  "authDomain": "thinktech-34ceb.firebaseapp.com",
  "databaseURL": "https://thinktech-34ceb.firebaseio.com",
  "storageBucket": "thinktech-34ceb.appspot.com",
}
firebase = pyrebase.initialize_app(config)

db = firebase.database()

ser = serial.Serial("COM6", 9600)

while True:
	value = ser.readline().decode().strip('\r\n')
	db.child('lights').set(value)
	#print(value)

