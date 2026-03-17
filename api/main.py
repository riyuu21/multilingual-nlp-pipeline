from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pipeline.main_pipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request format
class TextRequest(BaseModel):
    text: str


# Root route (for testing)
@app.get("/")
def home():
    return {"message": "NLP API is running"}


# Main API route
@app.post("/analyze")
def analyze_text(request: TextRequest):

    result = run_pipeline(request.text)

    return result