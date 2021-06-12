
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from random import randrange

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/predict")
def predict(mileage, cylinders, bike_year, brand, model, price, id):
    # TODO:
    # - build dataframe
    # - load model
    # - make prediction
    return dict(price=11 * randrange(10))
