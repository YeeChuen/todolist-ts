import { Todo } from "../type/Todo";

const baseURL = "http://localhost:5000/todos";

export const getTodos = () => {
  return fetch(baseURL).then((res) => res.json());
};
export const createTodo = (newTodo: Todo, token: string) => {
  return fetch(baseURL, {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(newTodo),
  })
    .then((res) => res.json())
    .catch((err) => err);
};

export const updateTodo = (id: string, partialTodo: Todo, token: string) => {
  return fetch(baseURL + `/${id}`, {
    credentials: "same-origin",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify(partialTodo),
  })
    .then((res) => res.json())
    .catch((err) => err);
};

export const deleteTodo = (id: string, token: string) => {
  return fetch(`${baseURL}/${id}`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: {
      authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .catch((err) => err);
};
