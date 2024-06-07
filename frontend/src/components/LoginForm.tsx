import React, { useState } from "react";
import Modal from "./Modal";

type LoginProps = {
  onSubmit: (e: any) => void;
  onSignUp: (e: any) => void;
  title?: string;
  children?: React.ReactNode;
};

const LoginForm = ({ onSubmit, onSignUp }: LoginProps) => {
  const [register, setRegister] = useState<boolean>(false);

  return (
    <>
      <form
        onSubmit={(e: any) => {
          if (!e.target[0].value || !e.target[1].value) {
            e.preventDefault();
            alert("Missing username or password.");
            return;
          }
          onSubmit(e);
        }}
      >
        <label>
          Username:
          <br />
          <input type="text" name="username" />
        </label>
        <br />

        <label>
          Password:
          <br />
          <input type="password" name="password" />
        </label>
        <br />
        <br />
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <input style={{ cursor: "pointer" }} type="submit" value="Sign in" />
          <button
            style={{
              border: "0px",
              backgroundColor: "transparent",
              color: "blue",
              cursor: "pointer",
            }}
            type="button"
            onClick={() => {
              setRegister(true);
            }}
          >
            Sign Up
          </button>
        </div>
      </form>

      {register && (
        <>
          <Modal onClose={() => setRegister(false)} title="New user sign up">
            <form
              onSubmit={(e: any) => {
                if (!e.target[0].value || !e.target[1].value) {
                  e.preventDefault();
                  alert("Missing username or password.");
                  return;
                }
                onSignUp(e);
                setRegister(false);
              }}
            >
              <label>
                Username:
                <br />
                <input type="text" name="username" />
              </label>
              <br />

              <label>
                Password:
                <br />
                <input type="password" name="password" />
              </label>
              <br />
              <br />
              <div
                style={{ display: "flex", flexDirection: "row", gap: "10px" }}
              >
                <input
                  style={{ cursor: "pointer" }}
                  type="submit"
                  value="Sign up"
                />
              </div>
            </form>
          </Modal>
        </>
      )}
    </>
  );
};

export default LoginForm;
