def successors(board, x, y):
    if board[y][x] != 0:
        return {}
    y_row = [row[x] for row in board]
    x_row = board[y]
    start_x = (x // 3) * 3
    start_y = (y // 3) * 3
    if start_x == 9 or start_y == 9:
        return {}
    slice = []
    for i in range(0,3):
        for j in range(0,3):
            slice.append(board[start_y+i][start_x+j])
    output = {}
    for num in range(1,len(board)+1):
        if num not in y_row and num not in x_row and num not in slice:
            output[num] = num
    return output

def rec_solve(board, x, y, choices):
    for successor in choices:
        board[y][x] = successor
        new_y, new_x = find_next(board)
        if new_y == None or new_x == None:
            return board
        answer = rec_solve(board, new_x, new_y, successors(board, new_x, new_y))
        if answer is not None:
            return answer
    board[y][x] = 0
    return None

def solve(board):
    y , x = find_next(board)
    if (y == None or x == None):
        return None
    return rec_solve(board, x, y, successors(board, x, y))
     
def find_next(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                return row, col
    return None, None