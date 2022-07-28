from fastapi import Body, Request, FastAPI

app = FastAPI()

@app.get("/")
def test(request: Request):
    return {
        "Test" : "This is a test"
    }