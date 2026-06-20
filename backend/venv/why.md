# Friction RAG Engine - Backend Architecture ("The Brain")

## The Environment
* **Isolation:** `venv` (Python Virtual Environment). Used as a strict sandbox to ensure project dependencies do not conflict with global computer installations or other university projects.

## The Stack
* **API Framework:** FastAPI. Selected because it is the modern industry standard for Python backends. It is incredibly fast, easy to write, and automatically converts Python dictionaries into perfectly formatted JSON data for the frontend to consume.
* **Web Server:** Uvicorn. FastAPI only defines the logic; Uvicorn is the lightning-fast ASGI web server that physically listens to port 8000 on localhost and catches the incoming network traffic from the React frontend.

## Next Steps
* Write `main.py` to define the initial `/api/chat` endpoint.
* Connect the React frontend to fetch data from this Uvicorn server instead of relying purely on local React state.