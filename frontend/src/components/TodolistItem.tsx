import React from "react";

const TodolistItem = (props: any) => {
  const { item, isEdit, editInput, setEditInput, editId, index, handleEdit, handleDelete } = props;
  return (
    <li>
      {isEdit ? (
        <input
          value={editInput}
          onChange={(e) => setEditInput(e.target.value)}
        />
      ) : (
        <span>{item.content}</span>
      )}
      <span style={{fontSize: "small"}}>by user {item.userId}</span>
      <div className="todo-action">
        <button onClick={() => handleEdit(item.id)}>
          {editId === item.id ? "save" : "edit"}
          {/* save */}
        </button>
        <button
          onClick={() => {
            handleDelete(index);
          }}
        >
          delete
        </button>
      </div>
    </li>
  );
};

export default TodolistItem;
