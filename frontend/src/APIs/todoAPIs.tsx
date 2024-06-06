import { Todo } from "../type/Todo";

const baseURL = "http://localhost:5000/todos";

export const getTodos = () => {
    return fetch(baseURL).then((res) => res.json());
};
export const createTodo = (newTodo: Todo) => {
    return fetch(baseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
    }).then((res) => res.json());
};

export const updateTodo = (id: string, partialTodo: Todo) => {
    return fetch(baseURL + `/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(partialTodo),
    }).then((res) => res.json());
};

export const deleteTodo = (id: string) => {
    return fetch(`${baseURL}/${id}`, { method: "DELETE" }).then((res) =>
        res.json()
    );
};