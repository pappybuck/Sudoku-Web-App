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
    solution = []
    for row in range(0, 9):
        quiz.append([])
        solution.append([])
        for col in range(0, 9):
            quiz[row].append(int(request.quiz[row * 9 + col]))
            solution[row].append(int(request.solution[row * 9 + col]))
    quiz = solve(quiz)
    quiz_str = ""
    for row in quiz:
        for col in row:
            quiz_str += str(col)
    if quiz != solution:        
        return {
            "Quiz": request.quiz,
            "Solution": "Solution found {}, Expected answer {}".format(quiz, solution)
        }
    else:
        return {
            "Quiz": request.quiz,
            "Solution": "{}".format(quiz_str)
        }