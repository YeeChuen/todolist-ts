import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addTodo,
  editTodo,
  removeAllTodos,
  removeTodo,
  selectTodolist,
  setTodos,
} from "../slice/slice";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../APIs/todoAPIs";
import TodolistItem from "./TodolistItem";
import "./todolist.css";
import Modal from "./Modal";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { signInUser, signUpUser } from "../APIs/userAPIs";
import { User } from "../type/User";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtToken } from "../type/JwtToken";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<string>();
  const [token, setToken] = useState<string>("");

  const cookies = new Cookies(); // <-- initialize cookie.

  const handleSubmit = async () => {
    if (!input) return;

    const newItem = {
      content: input,
    };
    try {
      const todoWithId = await createTodo(newItem, token);
      dispatch(addTodo(todoWithId));
      setInput("");
    } catch (err) {
      alert("failed to create todo!");
    }
  };

  const handleDelete = async (indexToDelete: number) => {
    try {
      const id = todolist[indexToDelete].id;
      const data = await deleteTodo(id || "", token);
      if (data.hasOwnProperty("message") && data.message != "Success") {
        alert(data.message);
        return;
      }
      // Redux Slice to delete Todo
      dispatch(removeTodo(indexToDelete));
    } catch (err) {
      alert("failed to delete todo!");
    }
  };

  // const handleDeleteAll = async () => {
  //   try {
  //     for (let i = 0; i < todolist.length; i++) {
  //       const id = todolist[i].id;
  //       const data = await deleteTodo(id || "", token);
  //       if (data.hasOwnProperty("message") && data.message != "Success") {
  //         continue;
  //       }
  //     }
  //     //   setTodolist([]);
  //     dispatch(removeAllTodos());
  //   } catch (err) {
  //     alert("failed to delete todo!");
  //   }
  // };

  const handleEdit = async (id: string) => {
    if (editId === null || editId !== id) {
      setEditId(id);
      //   const currContent = (todolist) ? todolist.find((item) => item.id === id).content : "";
      const currContent = todolist.find((item) => item.id === id)?.content;
      setEditInput(currContent || "");
    } else {
      if (!editInput) return;
      try {
        const data = await updateTodo(id, { content: editInput }, token);

        if (data.hasOwnProperty("message") && data.message != "Success") {
          alert(data.message);
          return;
        }

        dispatch(editTodo({ id: id, content: editInput }));

        setEditId("");
        setEditInput("");
      } catch (err) {
        alert("failed to update todo!");
      }
    }
  };

  // handler for login & register & logout
  // TODO change any to a form event
  const handleSignIn = async (e: any) => {
    e.preventDefault();
    const newUser: User = {
      username: e.target[0].value,
      password: e.target[1].value,
    };

    const loginUser = await signInUser(newUser);

    if (!loginUser.hasOwnProperty("accessToken")) {
      alert(
        "Error loging in user. Make sure you use the correct username and password."
      );
      return;
    }
    setIsModalOpen(false);
    const jwtObject = jwtDecode(loginUser.accessToken) as JwtToken;
    setUser(jwtObject.username);
    setToken(loginUser.accessToken);
    // below add jwt_token to cookie, but unable to attach it to request
    cookies.set("jwt_authorization", loginUser.accessToken, {
      expires: new Date(jwtObject.exp * 1000),
    });
  };
  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const newUser: User = {
      username: e.target[0].value,
      password: e.target[1].value,
    };

    await signUpUser(newUser);
  };

  return (
    <div className="todo-container">
      {user && <div>Welcome {user}!</div>}
      <div className="form-container">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>submit</button>

        {/* <button onClick={handleDeleteAll}>Delete all</button> */}

        {!user ? (
          <button onClick={() => setIsModalOpen(true)}>Sign in</button>
        ) : (
          <button
            onClick={() => {
              setUser(undefined);
              setToken("");
              cookies.remove("jwt_authorization");
            }}
          >
            Sign out
          </button>
        )}
      </div>
      <div className="list-container">
        <ul>
          {/* todo.map here */}
          {user ? (
            <>
              {todolist.map((item, index) => {
                const isEdit = item.id === editId;
                return (
                  <TodolistItem
                    key={item.id}
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
            </>
          ) : (
            <>
              Please Sign in to see all Todos.
              <Modal
                title={"User sign in"}
                onClose={() => setIsModalOpen(false)}
              >
                <LoginForm
                  onSubmit={(e) => handleSignIn(e)}
                  onSignUp={(e) => handleSignUp(e)}
                />
              </Modal>
            </>
          )}
        </ul>
      </div>
      {isModalOpen && (
        <>
          <Modal title={"User sign in"} onClose={() => setIsModalOpen(false)}>
            <LoginForm
              onSubmit={(e) => handleSignIn(e)}
              onSignUp={(e) => handleSignUp(e)}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default Todolist;
