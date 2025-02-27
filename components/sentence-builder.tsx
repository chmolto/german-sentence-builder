"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DraggableItem from "./draggable-item"
import DropTarget from "./drop-target"
import { isTouchDevice } from "@/lib/utils"

// Define the types of grammatical elements
export type ItemType = "nominativ" | "verb" | "akkusativ"

// Define the shape of each grammatical element
export const itemShapes: Record<ItemType, string> = {
  nominativ: "hexagon",
  verb: "cross",
  akkusativ: "square",
}

// Define the color of each grammatical element
export const itemColors: Record<ItemType, string> = {
  nominativ: "yellow",
  verb: "black",
  akkusativ: "blue",
}

// Define the items for each grammatical element
const items = {
  nominativ: [
    { id: "nom-1", text: "ich", type: "nominativ" as ItemType },
    { id: "nom-2", text: "du", type: "nominativ" as ItemType },
    { id: "nom-3", text: "er", type: "nominativ" as ItemType },
    { id: "nom-4", text: "sie", type: "nominativ" as ItemType },
    { id: "nom-5", text: "es", type: "nominativ" as ItemType },
    { id: "nom-6", text: "wir", type: "nominativ" as ItemType },
    { id: "nom-7", text: "ihr", type: "nominativ" as ItemType },
    { id: "nom-8", text: "Sie", type: "nominativ" as ItemType },
    { id: "nom-9", text: "dieser Tisch", type: "nominativ" as ItemType },
    { id: "nom-10", text: "der Kuli", type: "nominativ" as ItemType },
    { id: "nom-11", text: "euer Computer", type: "nominativ" as ItemType },
  ],
  akkusativ: [
    { id: "akk-1", text: "mich", type: "akkusativ" as ItemType },
    { id: "akk-2", text: "dich", type: "akkusativ" as ItemType },
    { id: "akk-3", text: "ihn", type: "akkusativ" as ItemType },
    { id: "akk-4", text: "sie", type: "akkusativ" as ItemType },
    { id: "akk-5", text: "es", type: "akkusativ" as ItemType },
    { id: "akk-6", text: "uns", type: "akkusativ" as ItemType },
    { id: "akk-7", text: "euch", type: "akkusativ" as ItemType },
    { id: "akk-8", text: "Sie", type: "akkusativ" as ItemType },
    { id: "akk-9", text: "diesen Tisch", type: "akkusativ" as ItemType },
    { id: "akk-10", text: "den Kuli", type: "akkusativ" as ItemType },
    { id: "akk-11", text: "euren Computer", type: "akkusativ" as ItemType },
  ],
  verb: [
    { id: "verb-1", text: "sehe", type: "verb" as ItemType },
    { id: "verb-2", text: "siehst", type: "verb" as ItemType },
    { id: "verb-3", text: "sieht", type: "verb" as ItemType },
    { id: "verb-4", text: "sehen", type: "verb" as ItemType },
    { id: "verb-5", text: "seht", type: "verb" as ItemType },
    { id: "verb-6", text: "spricht", type: "verb" as ItemType },
    { id: "verb-7", text: "ist", type: "verb" as ItemType },
    { id: "verb-8", text: "nennt", type: "verb" as ItemType },
    { id: "verb-9", text: "gefällt", type: "verb" as ItemType },
    { id: "verb-10", text: "gratuliert", type: "verb" as ItemType },
  ],
}

// Define the sentence patterns
const sentencePatterns = [
  {
    id: 1,
    slots: [
      { id: "slot-1", type: "nominativ", position: "left" },
      { id: "slot-2", type: "verb", position: "middle" },
      { id: "slot-3", type: "akkusativ", position: "right" },
    ],
    description: "Subjekt + Verb + Objekt",
  },
  {
    id: 2,
    slots: [
      { id: "slot-1", type: "akkusativ", position: "left" },
      { id: "slot-2", type: "verb", position: "middle" },
      { id: "slot-3", type: "nominativ", position: "right" },
    ],
    description: "Objekt + Verb + Subjekt",
  },
]

export default function SentenceBuilder() {
  const [activeTab, setActiveTab] = useState<ItemType>("nominativ")
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [droppedItems, setDroppedItems] = useState<Record<string, any>>({})

  const currentPattern = sentencePatterns[currentPatternIndex]

  const handleDrop = (slotId: string, item: any) => {
    // First, check if this item is already in another slot and remove it
    const existingSlot = Object.entries(droppedItems).find(
      ([_, value]) => value && value.id === item.id
    );
    
    if (existingSlot) {
      const [existingSlotId] = existingSlot;
      setDroppedItems((prev) => {
        const newItems = { ...prev };
        delete newItems[existingSlotId];
        return {
          ...newItems,
          [slotId]: item,
        };
      });
    } else {
      setDroppedItems((prev) => ({
        ...prev,
        [slotId]: item,
      }));
    }
  }

  const handleRemove = (slotId: string) => {
    setDroppedItems((prev) => {
      const newItems = { ...prev }
      delete newItems[slotId]
      return newItems
    })
  }

  const nextPattern = () => {
    setCurrentPatternIndex((prev) => (prev + 1) % sentencePatterns.length)
    setDroppedItems({})
  }

  const prevPattern = () => {
    setCurrentPatternIndex((prev) => (prev - 1 + sentencePatterns.length) % sentencePatterns.length)
    setDroppedItems({})
  }

  // Determine if we're on a touch device for the appropriate backend
  const backendForDND = typeof window !== "undefined" && isTouchDevice() ? TouchBackend : HTML5Backend

  return (
    <DndProvider backend={backendForDND}>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ItemType)}>
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 p-0">
            <TabsTrigger
              value="nominativ"
              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800 py-3"
            >
              Nominativ
            </TabsTrigger>
            <TabsTrigger
              value="akkusativ"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 py-3"
            >
              Akkusativ
            </TabsTrigger>
            <TabsTrigger value="verb" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white py-3">
              Verben
            </TabsTrigger>
          </TabsList>

          {Object.entries(items).map(([type, typeItems]) => (
            <TabsContent
              key={type}
              value={type}
              className={`p-4 ${
                type === "nominativ" ? "bg-yellow-50" : type === "akkusativ" ? "bg-blue-50" : "bg-gray-100"
              }`}
            >
              <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory">
                {typeItems.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-[160px] snap-center">
                    <DraggableItem id={item.id} text={item.text} type={item.type} />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="p-4 md:p-8 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="flex flex-col md:flex-row items-center w-full max-w-3xl justify-between">
            <Button variant="outline" size="icon" onClick={prevPattern} className="rounded-full shadow-sm mb-4 md:mb-0">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous pattern</span>
            </Button>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 md:p-8 rounded-lg bg-white shadow-md min-h-[280px] w-full mx-2 md:mx-4">
              {currentPattern.slots.map((slot) => (
                <DropTarget
                  key={slot.id}
                  id={slot.id}
                  type={slot.type}
                  position={slot.position}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  item={droppedItems[slot.id]}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextPattern} className="rounded-full shadow-sm mt-4 md:mt-0">
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next pattern</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-gray-600">{currentPattern.description}</p>
            {Object.keys(droppedItems).length === currentPattern.slots.length && (
              <p className="mt-4 text-green-600 font-bold">Sehr gut! Du hast einen korrekten Satz gebildet.</p>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  )
}
