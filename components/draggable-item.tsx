"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { memo } from "react"
import type { ItemType } from "./sentence-builder"

interface DraggableItemProps {
  id: string
  text: string
  type: ItemType
}

function DraggableItem({ id, text, type }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { id, text, type }
  })

  // Determine shape and color based on type
  const getShapeStyles = () => {
    switch (type) {
      case "nominativ":
        return {
          className: "clip-path-hexagon bg-yellow-300 hover:bg-yellow-200 shape-shadow shape-hover relative",
          style: {},
        }
      case "verb":
        return {
          className: "clip-path-cross bg-black text-white hover:bg-gray-800 shape-shadow shape-hover relative",
          style: {},
        }
      case "akkusativ":
        return {
          className: "clip-path-square bg-blue-300 hover:bg-blue-200 shape-shadow shape-hover relative",
          style: {},
        }
      case "dativ":
        return {
          className: "clip-path-triangle bg-green-300 hover:bg-green-200 shape-shadow shape-hover relative",
          style: {},
        }
      default:
        return {
          className: "bg-gray-300 shape-shadow relative",
          style: {},
        }
    }
  }

  const { className, style } = getShapeStyles()
  
  const dragStyle = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging ? 999 : 1,
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        ${className}
        w-full h-32 flex items-center justify-center
        text-center font-medium
        cursor-move
        select-none
        ${isDragging ? "opacity-50" : "opacity-100"}
      `}
      style={dragStyle}
    >
      <span className="px-2 py-1 text-sm sm:text-base z-above-clip-path">{text}</span>
    </div>
  )
}

export default memo(DraggableItem)
