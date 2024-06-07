import { User } from "../type/User";

const baseURL = "http://localhost:5000/users";

export const getUsers = () => {
  return fetch(baseURL).then((res) => res.json());
};

export const signUpUser = (newUser: User) => {
  return fetch(baseURL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  }).then((res) => res.json());
};

export const signInUser = (newUser: User) => {
  return fetch(baseURL + "/login", {
    credentials: "same-origin",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((res) => res.json())
    .catch((err) => err);
};
