import fastapi
from fastapi import FastAPI

router = fastapi.APIRouter()

@router.get('/eat')
def consume() -> dict:
    return {"data":"Yes I can consume this too!"}