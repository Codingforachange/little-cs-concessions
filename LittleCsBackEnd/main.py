import os
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

# 1. PERMISSION SLIP (CORS Middleware)
# This allows your Angular app (port 4200) to talk to this Python server (port 8000)
origins = [
    "http://localhost:4200",
    "https://little-cs-concessions.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection Helper
def get_db_connection():
    database_url = os.environ.get("DATABASE_URL")

    if database_url:
        return psycopg2.connect(database_url, cursor_factory=RealDictCursor)
    else:
        return psycopg2.connect(
            dbname="little_cs_concessions",
            user="postgres",
            password="haley413", # Replace with your actual pgAdmin password
            host="localhost",
            port="5432",
            cursor_factory=RealDictCursor
        )

# 2. THE PREFLIGHT HANDLER
# Manually answers the browser's "Is it safe to send data?" question
@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# 3. DATA MODELS (The Blueprints)
class Event(BaseModel):
    location_id: int
    event_date: str
    start_time: str
    end_time: str
    notes: str

class Review(BaseModel):
    customer_name: str
    rating: int
    comment: str

class MenuItem(BaseModel):
    name: str
    category: str
    price: float

# 4. ROUTES (The Endpoints)

# --- GET: Fetch all events joined with location data for the map ---
@app.get("/api/events")
def get_events():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT s.id, l.name as location, l.address, l.city, s.event_date, s.start_time, s.end_time, s.notes
        FROM schedule s
        JOIN locations l ON s.location_id = l.id
        ORDER BY s.event_date ASC
    """)
    events = cur.fetchall()
    cur.close()
    conn.close()
    return events

# --- GET: Fetch all reviews ---
@app.get("/api/reviews")
def get_reviews():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM reviews ORDER BY review_date DESC")
    reviews = cur.fetchall()
    cur.close()
    conn.close()
    return reviews

# --- POST: Save a new review to the database ---
@app.post("/api/reviews")
async def add_review(review: Review):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO reviews (customer_name, rating, comment) VALUES (%s, %s, %s)",
        (review.customer_name, review.rating, review.comment)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Review saved to database!"}

# --- DELETE: Remove an event (Admin Logic) ---
@app.delete("/api/events/{event_id}")
async def delete_event(event_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM schedule WHERE id = %s", (event_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": f"Event {event_id} deleted"}

# --- Delete: Remove a review ---
@app.delete("/api/reviews/{review_id}")
def delete_review(review_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Review deleted"}

# Fetch menu items
@app.get("/api/menu")
def get_menu():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM menu_items WHERE is_available = true")
    menu = cur.fetchall()
    cur.close()
    conn.close()
    return menu

# Post add new item to the menu
@app.post("/api/menu")
async def add_menu_item(item: MenuItem):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO menu_items (name, category, price, is_available) VALUES(%s, %s, %s, true)",
    (item.name, item.category, item.price)
    )
    conn.commit()
    cur.close()
    conn.close()
    return{"message": "Menu item added successfully!"}

# Delete item from menu
@app.delete("/api/menu/{item_id}")
async def delete_menu_item(item_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM menu_items WHERE id = %s", (item_id))
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Menu item deleted successfully!"}

@app.get("/api/locations")
def get_locations():
    conn = get_db_connection()
    cur = conn.cursor()
    # Fetch todays scheduled location
    cur.execute("""
                SELECT l.name, l.address, l.city, l.latitude, l.longitude, s.start_time, s.end_time
                FROM locations l
                JOIN schedule s ON l.id = s.location_id
                WHERE s.event_date = CURRENT_DATE
""")
    location = cur.fetchone()
    cur.close()
    conn.close()
    return location if location else {"message": "No events scheduled for today"}

# 5. THE START BLOCK (Always at the very bottom)
if __name__ == "__main__":
    import uvicorn
    # host 0.0.0.0 makes it accessible on your local network
    uvicorn.run(app, host="0.0.0.0", port=8000)