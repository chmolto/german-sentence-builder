"use client"

import { useDrop } from "react-dnd"
import type { ItemType } from "./sentence-builder"
import { X } from "lucide-react"

interface DropTargetProps {
  id: string
  type: ItemType
  position: string
  onDrop: (id: string, item: any) => void
  onRemove: (id: string) => void
  item: any
}

export default function DropTarget({ id, type, position, onDrop, onRemove, item }: DropTargetProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: type,
    drop: (droppedItem) => {
      onDrop(id, droppedItem)
      return { id }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  // Determine shape based on type
  const getShapeClasses = () => {
    switch (type) {
      case "nominativ":
        return "clip-path-hexagon"
      case "verb":
        return "clip-path-cross"
      case "akkusativ":
        return "clip-path-square"
      default:
        return ""
    }
  }

  // Determine border color based on type
  const getBorderColor = () => {
    switch (type) {
      case "nominativ":
        return "border-yellow-500"
      case "verb":
        return "border-gray-700"
      case "akkusativ":
        return "border-blue-500"
      default:
        return "border-gray-400"
    }
  }

  // Determine position styles (not used in mobile vertical layout)
  const getPositionStyles = () => {
    switch (position) {
      case "left":
        return "md:left-8 md:left-16"
      case "middle":
        return "md:left-1/2 md:-translate-x-1/2"
      case "right":
        return "md:right-8 md:right-16"
      default:
        return ""
    }
  }

  // Handle remove click
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onRemove(id);
  };

  return (
    <div
      ref={drop}
      className={`
        md:absolute ${getPositionStyles()}
        w-32 h-32 flex items-center justify-center
        ${!item ? getShapeClasses() : ""}
        ${!item ? `bg-white bg-opacity-80 border-2 border-dashed ${getBorderColor()}` : ""}
        ${isOver && canDrop ? "ring-4 ring-green-500 ring-opacity-50" : ""}
        ${isOver && !canDrop ? "ring-4 ring-red-500 ring-opacity-50" : ""}
        transition-all duration-200
        m-2 relative
      `}
    >
      {item ? (
        <div className="absolute inset-0 w-full h-full">
          <div
            className={`
              w-full h-full flex items-center justify-center
              ${item.type === "nominativ" ? "clip-path-hexagon bg-yellow-300 border-yellow-500" : ""}
              ${item.type === "verb" ? "clip-path-cross bg-black text-white border-gray-700" : ""}
              ${item.type === "akkusativ" ? "clip-path-square bg-blue-300 border-blue-500" : ""}
              border-2 text-center font-medium shape-shadow
            `}
          >
            <span className="px-2 py-1 text-sm sm:text-base">{item.text}</span>
          </div>
          <button
            onClick={handleRemoveClick}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-above-clip-path"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="text-gray-400 text-xs">{type}</div>
      )}
    </div>
  )
}
