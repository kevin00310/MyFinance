import { useState } from "react";

export const DNDwidget = (initialItems) => {
  const [items, setItems] = useState(initialItems);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);
    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, draggedItem);
    setItems(updatedItems);
  };

  return {
    items,
    setItems,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
