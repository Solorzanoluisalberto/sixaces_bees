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
stress = "../2_Transform/hbcny_stress_19.csv"
df2 = pd.read_csv(stress)
df2 = df2[df2['state']!='Connecticut']
df2 = df2[df2['state']!='Maryland']
df2 = df2[df2['state']!='Massachusetts']
df2 = df2[df2['state']!='Oklahoma']
df2 = df2[df2['state']!='New Mexico']
df2 = df2[df2['state']!='Other States']
df1 = df1.merge(df2, left_on='state', right_on='state', suffixes=('_hb', '_stress'))
X = df1[['max_h_prod_cny','prod_held_stocks','v_mites', 'other_pest_para', 'diseases',
         'pesticides','other','unknown']].astype(int)
y = df1['yield/cny'].astype(int)
feature_names = X
print(X.shape, y.shape)

#Making model
#train test split
user1 = 9
user2 = 254
user3 = 6
user4 = 7
user5 = 8
user6 = 9
user7 = 945
user8 = 253
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42)
regr = make_pipeline(StandardScaler(),LinearSVR(random_state=23, tol=1e-5))
regr.fit(X, y)
final_pred = regr.predict([[user1,user2,user3,user4,user5,user6,user7,user8]])
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
        user3 = request.form["user3"]
        user4 = request.form["user4"]
        user5 = request.form["user5"]
        user6 = request.form["user6"]
        user7 = request.form["user7"]
        user8 = request.form["user8"]
        final_pred = regr.predict([[user1,user2,user3,user4,user5,user6,user7,user8]])
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
