
import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from flask import Flask, jsonify

engine = create_engine ("sqlite:///hawaii.sqlite")
Base = automap_base()
Base.prepare(engine, reflect = True)

Station = Base.classes.station
Measurements = Base.classes.measurements
session = Session(engine)

app = Flask(__name__)


# Query for dates and temperature observations from the last year.
# Convert query results to a dictionary using the date as a key and tobs and the value.
# Return the json representation of the dictionary.
@app.route("/api/v1.0/precipitation")
def precipitation():
	date_delta = dt.date.today() - dt.timedelta(days = 365)

	precipitation = session.query(Measurements.date, func.avg(Measurements.prcp)).\
	filter(Measurements.date >= date_delta).group_by(Measurements.date).\
	order_by(Measurements.date).all()

	all_precipitation = []
	for precipitate in precipitation:
		precipitation_dict = {}
		precipitation_dict[precipitate[0]] = precipitate[1]
		all_precipitation.append(precipitation_dict)
	return jsonify(all_precipitation) 


# Return a json list of stations from the dataset.
@app.route("/api/v1.0/stations")
def stations():
	station = session.query(Station.station).all()

	all_station = []
	for stat in station:
		station_dict = {}
		station_dict["Station"] = station[0]
		all_station.append(station_dict)
	return jsonify(all_station)


# Return a json list of tobs for the previous year.
@app.route("/api/v1.0/tobs")
def temperatures():
	date_delta = dt.date.today() - dt.timedelta(days = 365)

	temperature = session.query(Measurements.date, func.avg(Measurements.tobs)).\
	filter(Measurements.date >= date_delta).group_by(Measurements.date).\
	order_by(Measurements.date).all()

	all_temps = []
	for temp in temperature:
		temp_dict = {}
		temp_dict["Date"] = temp[0]
		temp_dict["Average_Temperature"] = temp[1]
		all_temps.append(temp_dict)
	return jsonify(all_temps)


# Enter a start date. Get data from that date forward.
# Enter a start and end date.  Get data between the dates.
# Return tmin, tmax, tave for range of dates--one set of outputs (info via daniel)
@app.route("/api/v1.0/date")
def date():
	return (
		f"If only the start_date is given, enter as '/api/v1.0/date/(insert start_date)'<br/>"
		f"If the start_date and end_date are given, enter as '/api/v1.0/date/(insert start_date)/(insert end_date)'<br/>"
		f"<br/>"
		f"All dates should be listed in YYYYMMDD format."
		)


@app.route("/api/v1.0/date/<start>")
def start_date(start):
	date = str(start)
	year = date[0:4]
	month = date[4:6]
	day = date[6:]
	new_date = f"{year}-{month}-{day}"
	start_dates = session.query(func.min(Measurements.tobs), func.max(Measurements.tobs),func.avg(Measurements.tobs)).\
	filter(Measurements.date >= new_date).all()

	all_starts = []
	for starts in start_dates:
		start_dict = {}
		start_dict["Tmin"] = starts[0]
		start_dict["Tmax"] = starts[1]
		start_dict["Tave"] = starts[2]
		all_starts.append(start_dict)
	return jsonify(all_starts)


@app.route("/api/v1.0/date/<start>/<end>")
def start_end_date(start, end):
	date1 = str(start)
	year1 = date1[0:4]
	month1 = date1[4:6]
	day1 = date1[6:]
	new_date1 = f"{year1}-{month1}-{day1}"

	date2 = str(end)
	year2 = date2[0:4]
	month2 = date2[4:6]
	day2 = date2[6:]
	new_date2 = f"{year2}-{month2}-{day2}"

	start_end_dates = session.query(func.min(Measurements.tobs), func.max(Measurements.tobs),\
		func.avg(Measurements.tobs)).\
	filter(Measurements.date >= new_date1).filter(Measurements.date <= new_date2).all()

	all_start_ends = []
	for start_end in start_end_dates:
		start_end_dict = {}
		start_end_dict["Tmin"] = start_end[0]
		start_end_dict["Tmax"] = start_end[1]
		start_end_dict["Tave"] = start_end[2]
		all_start_ends.append(start_end_dict)
	return jsonify(all_start_ends)


@app.route("/")
def welcome():
	return (
		f"Welcome to the Hawaiian Weather API!<br/>"
		f"<br/>"
		f"Available Routes:<br/>"
		f"/api/v1.0/precipitation<br/>"
		f"/api/v1.0/stations<br/>"
		f"/api/v1.0/tobs<br/>"
		f"/api/v1.0/date<br/>"
		f"/api/v1.0/date/(insert start_date)<br/>"
		f"/api/v1.0/date/(insert start_date)/(insert end_date)<br/>"
		f"<br/>"
		f"start_date and end_date format: YYYYMMDD"
		)
		

if __name__ == '__main__':
	app.run(debug = True)