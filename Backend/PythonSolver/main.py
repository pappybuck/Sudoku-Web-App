import string
from fastapi import Request, FastAPI
from typing import Optional
from pydantic import BaseModel
from solver import solve

class Sudoku(BaseModel):
    """
    This class is used to represent a sudoku puzzle.
    """
    quiz: str
    solution: str


app = FastAPI()

@app.post("/")
def sudoku(request: Sudoku):
    quiz = []
    for row in range(0, 9):
        quiz.append([])
        for col in range(0, 9):
            quiz[row].append(int(request.quiz[row * 9 + col]))
    solution = solve(quiz)
    solution_str = ""
    for row in solution:
        for col in row:
            solution_str += str(col)
    return {
        "Quiz": request.quiz,
        "Solution": "{}".format(solution_str)
    }