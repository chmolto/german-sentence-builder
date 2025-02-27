"use client"

import { useDrag } from "react-dnd"
import type { ItemType } from "./sentence-builder"

interface DraggableItemProps {
  id: string
  text: string
  type: ItemType
}

export default function DraggableItem({ id, text, type }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { id, text, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // Determine shape and color based on type
  const getShapeStyles = () => {
    switch (type) {
      case "nominativ":
        return {
          className: "clip-path-hexagon bg-yellow-300 border-yellow-500 hover:bg-yellow-200 shape-shadow shape-hover",
          style: {},
        }
      case "verb":
        return {
          className: "clip-path-cross bg-black text-white border-gray-700 hover:bg-gray-800 shape-shadow shape-hover",
          style: {},
        }
      case "akkusativ":
        return {
          className: "clip-path-square bg-blue-300 border-blue-500 hover:bg-blue-200 shape-shadow shape-hover",
          style: {},
        }
      default:
        return {
          className: "bg-gray-300 border-gray-500 shape-shadow",
          style: {},
        }
    }
  }

  const { className, style } = getShapeStyles()

  return (
    <div
      ref={drag}
      className={`
        ${className}
        w-full h-32 flex items-center justify-center
        text-center font-medium border-2 cursor-move
        transition-all duration-200 select-none
        ${isDragging ? "opacity-50 scale-105" : "opacity-100"}
      `}
      style={{
        ...style,
      }}
    >
      <span className="px-2 py-1 text-sm sm:text-base">{text}</span>
    </div>
  )
}
