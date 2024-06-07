import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Todo } from "../type/Todo";

interface TodolistState {
  loading: boolean;
  todolist: Todo[];
}

const initialState: TodolistState = {
  loading: false,
  todolist: [],
};

export const todolistSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todolist = [...action.payload];
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todolist = [action.payload, ...state.todolist];
    },
    removeTodo(state, action: PayloadAction<number>) {
      state.todolist = state.todolist.filter((item, index) => {
        return index !== action.payload;
      });
    },
    editTodo(state, action: PayloadAction<Todo>) {
      state.todolist = state.todolist.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, content: action.payload.content };
        } else {
          return item;
        }
      });
    },
    removeAllTodos(state) {
      state.todolist = [];
    },
  },
  // extraReducers: (builder) => {
  //     builder.addCase()
  // },
});

export const { setTodos, addTodo, removeTodo, editTodo, removeAllTodos } =
  todolistSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTodolist = (state: RootState) => state.todos.todolist;

export default todolistSlice.reducer;
