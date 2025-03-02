"use client"

import { useDroppable } from "@dnd-kit/core"
import { memo } from "react"
import type { ItemType } from "./sentence-builder"
import { X } from "lucide-react"

interface DropTargetProps {
  id: string
  type: ItemType
  position: "subject" | "verb" | "object" | "dativ" | string
  onDrop: (id: string, item: any) => void
  onRemove: (id: string) => void
  item: any
}

function DropTarget({ id, type, position, onDrop, onRemove, item }: DropTargetProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { type, position }
  })

  // Determine shape class based on type
  const getShapeClasses = () => {
    switch (type) {
      case "nominativ":
        return "clip-path-hexagon"
      case "verb":
        return "clip-path-cross"
      case "akkusativ":
        return "clip-path-square"
      case "dativ":
        return "clip-path-triangle"
      default:
        return ""
    }
  }

  // Determine background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case "nominativ":
        return "bg-yellow-100"
      case "verb":
        return "bg-gray-200"
      case "akkusativ":
        return "bg-blue-100"
      case "dativ":
        return "bg-green-100"
      default:
        return "bg-white"
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
      case "dativ":
        return "border-green-500"
      default:
        return "border-gray-400"
    }
  }

  // Determine position styles
  const getPositionStyles = () => {
    switch (position) {
      case "subject":
        return "left-0 md:left-16 top-0 md:top-1/4"
      case "verb":
        return "-translate-x-1/2 top-0 md:top-1/4"
      case "object":
        return "right-0 md:right-16 top-0 md:top-1/4"
      case "dativ":
        return "right-0 md:right-16 top-0 md:top-1/4"
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
      ref={setNodeRef}
      className={`
        md:absolute ${getPositionStyles()}
        w-32 h-32 flex items-center justify-center
        relative hardware-accelerated
        ${isOver ? "ring-4 ring-green-500 ring-opacity-50" : ""}
        transition-all duration-200
        m-2
      `}
    >
      {item ? (
        <div className="absolute inset-0 w-full h-full">
          <div
            className={`
              w-full h-full flex items-center justify-center
              ${item.type === "nominativ" ? "clip-path-hexagon bg-yellow-300" : ""}
              ${item.type === "verb" ? "clip-path-cross bg-black text-white" : ""}
              ${item.type === "akkusativ" ? "clip-path-square bg-blue-300" : ""}
              ${item.type === "dativ" ? "clip-path-triangle bg-green-300" : ""}
              relative
              text-center font-medium shape-shadow
            `}
          >
            <span className="px-2 py-1 text-sm sm:text-base z-above-clip-path">{item.text}</span>
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
        <div 
          className={`
            w-full h-full flex items-center justify-center
            ${getShapeClasses()}
            ${getBackgroundColor()}
            relative
            bg-opacity-80
          `}
        >
          <div className="text-gray-500 text-xs z-above-clip-path">{position}</div>
        </div>
      )}
    </div>
  )
}

export default memo(DropTarget)
