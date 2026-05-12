from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os

app = FastAPI()

# 1. PERMISSION SLIP (CORS Middleware)
# This allows your Angular app (port 4200) to talk to this Python server (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. THE PREFLIGHT HANDLER
# Manually answers the browser's "Is it safe to send data?" question
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# 3. DATA MODELS (The Blueprints)
class Event(BaseModel):
    day: int
    month: str
    year: int
    title: str
    startTime: str
    location: str
    address: str

class Review(BaseModel):
    customer: str
    rating: int
    comment: str
    location: str

# 4. ROUTES (The Endpoints)

# --- GET: Fetch all events ---
@app.get("/api/events")
def get_events():
    if os.path.exists("events.json"):
        with open("events.json", "r") as f:
            return json.load(f)
    return []

# --- GET: Fetch all reviews ---
@app.get("/api/reviews")
def get_reviews():
    if os.path.exists("reviews.json"):
        with open("reviews.json", "r") as f:
            return json.load(f)
    return []

# --- POST: Save a new review ---
@app.post("/api/reviews")
async def add_review(review: Review):
    reviews = get_reviews()
    # Puts the newest review at the top of the list
    reviews.insert(0, review.model_dump())
    with open("reviews.json", "w") as f:
        json.dump(reviews, f, indent=4)
    return {"message": "Review saved!"}

# --- POST: Save a new event (The Admin Dashboard Logic) ---
@app.post("/api/events")
async def add_event(event: Event):
    events = get_events()
    events.append(event.model_dump())
    with open("events.json", "w") as f:
        json.dump(events, f, indent=4)
    return {"message": "Event added successfully!"}

@app.delete("/api/events/{title}")
async def delete_event(title: str):
    events = get_events()
    #Create new list excluding the one we want to delete
    updated_events = [e for e in events if e['title'] != title]

    with open("events.json", "w") as f:
        json.dump(updated_events, f, indent=4)
    return {"message": f"Event '{title}' deleted"}

@app.delete("/api/reviews/{customer}")
async def delete_review(customer: str):
    reviews = get_reviews()
    # Keep everything Execpt the one we want to delete
    updated_reviews = [r for r in reviews if r['customer'] != customer]

    with open ("reviews.json", "w") as f:
        json.dump(updated_reviews, f, indent=4)
    return {"message": f"Review from {customer} deleted"}

# 5. THE START BLOCK (Always at the very bottom)
if __name__ == "__main__":
    import uvicorn
    # host 0.0.0.0 makes it accessible on your local network
    uvicorn.run(app, host="0.0.0.0", port=8000)