from models import create_classes
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
# import matplotlib.pyplot as plt
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import LinearSVR
from sklearn.pipeline import make_pipeline

#Loading in and cleaning data
honey = "static/data/hp_prod_19.csv"
df1 = pd.read_csv(honey)
df1 = df1[df1['state']!='United States']
X = df1[['max_h_prod_cny','prod_held_stocks']]
y = df1['yield/cny'].astype(int)
feature_names = X
print(X.shape, y.shape)

#Making model
#train test split
user1 = 9
user2 = 254
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
regr = make_pipeline(StandardScaler(),LinearSVR(random_state=23, tol=1e-5))
regr.fit(X, y)
final_pred = regr.predict([[user1,user2]])
final = [value for value in final_pred]

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

Pet = create_classes(db)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        name = request.form["petName"]
        user1 = request.form["petLat"]
        user2 = request.form["petLon"]
        final_pred = regr.predict([[user1,user2]])
        final = [value for value in final_pred]
        print(final)
        return str(final)
    return render_template("form.html")

@app.route("/api/prediction")
def pals():

    pred_honey = [{
        "type": "yield of honey",
        "final_pred": final,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
                "color": "rgb(8,8,8)",
                "width": 1
            },
        }
    }]

    return jsonify(pred_honey)


if __name__ == "__main__":
    app.run()
