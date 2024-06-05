import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addTodo, editTodo, removeAllTodos, removeTodo, selectTodolist, setTodos } from "../slice/slice";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../APIs/todoAPIs";
import TodolistItem from "./TodolistItem";
import "./todolist.css";

const Todolist = () => {
  const todolist = useAppSelector(selectTodolist);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      const data = await getTodos();
      dispatch(setTodos(data.reverse()));
    }
    fetchData();
  }, []);

  const [input, setInput] = useState<string>("");
  const [editId, setEditId] = useState<string>("");
  const [editInput, setEditInput] = useState<string>("");

  const handleSubmit = async () => {
    if (!input) return;

    const newItem = {
      content: input,
    };
    try {
      const todoWithId = await createTodo(newItem);
      dispatch(addTodo(todoWithId));
      setInput("");
    } catch (err) {
      alert("failed to create todo!");
    }
  };

  const handleDelete = async (indexToDelete: number) => {
    try {
      const id = todolist[indexToDelete].id;
      await deleteTodo(id || "");

      // Redux Slice to delete Todo
      dispatch(removeTodo(indexToDelete));
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  const handleDeleteAll = async () => {
    try {
      for (let i = 0; i < todolist.length; i++) {
        const id = todolist[i].id;
        await deleteTodo(id || "");
      }
    //   setTodolist([]);
      dispatch(removeAllTodos());
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  const handleEdit = async (id: string) => {
    if (editId === null || editId !== id) {
      setEditId(id);
    //   const currContent = (todolist) ? todolist.find((item) => item.id === id).content : "";
    const currContent = todolist.find((item) => item.id === id)?.content;
      setEditInput(currContent || "");
    } else {
      if (!editInput) return;
      try {
        await updateTodo(id, { content: editInput });
        dispatch(editTodo({id: id, content: editInput}));

        setEditId("");
        setEditInput("");
      } catch (err) {
        alert("failed to update todo!");
      }
    }
  };

  return (
    <div className="todo-container">
      <div className="form-container">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>submit</button>

        <button onClick={handleDeleteAll}>
          Delete all
        </button>
      </div>

      <div className="list-container">
        <ul>
          {/* todo.map here */}
          {todolist.map((item, index) => {
            const isEdit = item.id === editId;
            return (
              <TodolistItem
                key = {item.id}
                item={item}
                isEdit={isEdit}
                editInput={editInput}
                setEditInput={setEditInput}
                editId={editId}
                index={index}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Todolist;
