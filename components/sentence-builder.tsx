"use client"

import { useState } from "react"
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  DragOverlay
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DraggableItem from "./draggable-item"
import DropTarget from "./drop-target"

// Define the types of grammatical elements
export type ItemType = "nominativ" | "verb" | "akkusativ" | "dativ"

// Define the shape of each grammatical element
export const itemShapes: Record<ItemType, string> = {
  nominativ: "hexagon",
  verb: "cross",
  akkusativ: "square",
  dativ: "triangle",
}

// Define the color of each grammatical element
export const itemColors: Record<ItemType, string> = {
  nominativ: "yellow",
  verb: "black",
  akkusativ: "blue",
  dativ: "green",
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
    { id: "nom-12", text: "mein Bruder", type: "nominativ" as ItemType },
    { id: "nom-13", text: "deine Schwester", type: "nominativ" as ItemType },
    { id: "nom-14", text: "das Kind", type: "nominativ" as ItemType },
    { id: "nom-15", text: "die Lehrerin", type: "nominativ" as ItemType },
    { id: "nom-16", text: "der Student", type: "nominativ" as ItemType },
    { id: "nom-17", text: "die Katze", type: "nominativ" as ItemType },
    { id: "nom-18", text: "der Hund", type: "nominativ" as ItemType },
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
    { id: "akk-12", text: "meinen Bruder", type: "akkusativ" as ItemType },
    { id: "akk-13", text: "deine Schwester", type: "akkusativ" as ItemType },
    { id: "akk-14", text: "das Kind", type: "akkusativ" as ItemType },
    { id: "akk-15", text: "die Lehrerin", type: "akkusativ" as ItemType },
    { id: "akk-16", text: "den Studenten", type: "akkusativ" as ItemType },
    { id: "akk-17", text: "die Katze", type: "akkusativ" as ItemType },
    { id: "akk-18", text: "den Hund", type: "akkusativ" as ItemType },
  ],
  verb: [
    { id: "verb-1", text: "sehen", type: "verb" as ItemType },
    { id: "verb-2", text: "sprechen", type: "verb" as ItemType },
    { id: "verb-3", text: "sein", type: "verb" as ItemType },
    { id: "verb-4", text: "nennen", type: "verb" as ItemType },
    { id: "verb-5", text: "gefallen", type: "verb" as ItemType },
    { id: "verb-6", text: "gratulieren", type: "verb" as ItemType },
    { id: "verb-7", text: "lieben", type: "verb" as ItemType },
    { id: "verb-8", text: "hassen", type: "verb" as ItemType },
    { id: "verb-9", text: "kaufen", type: "verb" as ItemType },
    { id: "verb-10", text: "verkaufen", type: "verb" as ItemType },
    { id: "verb-11", text: "finden", type: "verb" as ItemType },
    { id: "verb-12", text: "suchen", type: "verb" as ItemType },
    { id: "verb-13", text: "brauchen", type: "verb" as ItemType },
    { id: "verb-14", text: "kennen", type: "verb" as ItemType },
    { id: "verb-15", text: "geben", type: "verb" as ItemType },
    { id: "verb-16", text: "nehmen", type: "verb" as ItemType },
    { id: "verb-17", text: "lernen", type: "verb" as ItemType },
    { id: "verb-18", text: "verstehen", type: "verb" as ItemType },
  ],
  dativ: [
    { id: "dat-1", text: "eurem Computer", type: "dativ" as ItemType },
    { id: "dat-2", text: "ihm", type: "dativ" as ItemType },
    { id: "dat-3", text: "diesem Tisch", type: "dativ" as ItemType },
    { id: "dat-4", text: "dem Kuli", type: "dativ" as ItemType },
    { id: "dat-5", text: "der Frau", type: "dativ" as ItemType },
    { id: "dat-6", text: "dem Kind", type: "dativ" as ItemType },
    { id: "dat-7", text: "mir", type: "dativ" as ItemType },
    { id: "dat-8", text: "dir", type: "dativ" as ItemType },
    { id: "dat-9", text: "uns", type: "dativ" as ItemType },
    { id: "dat-10", text: "euch", type: "dativ" as ItemType },
    { id: "dat-11", text: "ihnen", type: "dativ" as ItemType },
    { id: "dat-12", text: "meinem Bruder", type: "dativ" as ItemType },
    { id: "dat-13", text: "deiner Schwester", type: "dativ" as ItemType },
    { id: "dat-14", text: "dem Lehrer", type: "dativ" as ItemType },
    { id: "dat-15", text: "der Katze", type: "dativ" as ItemType },
    { id: "dat-16", text: "dem Hund", type: "dativ" as ItemType },
  ],
}

// Define sentence patterns
const sentencePatterns = [
  {
    id: 1,
    slots: [
      { id: "slot-1", type: "nominativ", position: "subject" },
      { id: "slot-2", type: "verb", position: "verb" },
    ],
    description: "Subjekt + Verb",
  },
  {
    id: 2,
    slots: [
      { id: "slot-1", type: "nominativ", position: "object" },
      { id: "slot-2", type: "verb", position: "verb" },
      { id: "slot-3", type: "nominativ", position: "subject" },
    ],
    description: "Subjekt + Verb + Subjekt",
  },
  {
    id: 3,
    slots: [
      { id: "slot-1", type: "nominativ", position: "subject" },
      { id: "slot-2", type: "akkusativ", position: "object" },
      { id: "slot-3", type: "verb", position: "verb" },
    ],
    description: "Subjekt + Akkusativ + Verb",
  },
  {
    id: 4,
    slots: [
      { id: "slot-1", type: "nominativ", position: "subject" },
      { id: "slot-2", type: "verb", position: "verb" },
      { id: "slot-3", type: "dativ", position: "dativ" },
    ],
    description: "Subjekt + Verb + Dativ",
  },
]

// Tabla de conjugación de verbos alemanes comunes
const verbConjugations: Record<string, Record<string, string>> = {
  "sehen": {
    "ich": "sehe", 
    "du": "siehst", 
    "er": "sieht", 
    "sie": "sieht", 
    "es": "sieht", 
    "wir": "sehen", 
    "ihr": "seht", 
    "Sie": "sehen",
    "default": "sehen"
  },
  "sprechen": {
    "ich": "spreche", 
    "du": "sprichst", 
    "er": "spricht", 
    "sie": "spricht", 
    "es": "spricht", 
    "wir": "sprechen", 
    "ihr": "sprecht", 
    "Sie": "sprechen",
    "default": "sprechen"
  },
  "sein": {
    "ich": "bin", 
    "du": "bist", 
    "er": "ist", 
    "sie": "ist", 
    "es": "ist", 
    "wir": "sind", 
    "ihr": "seid", 
    "Sie": "sind",
    "default": "sein"
  },
  "nennen": {
    "ich": "nenne", 
    "du": "nennt", 
    "er": "nennt", 
    "sie": "nennt", 
    "es": "nennt", 
    "wir": "nennen", 
    "ihr": "nennt", 
    "Sie": "nennen",
    "default": "nennen"
  },
  "gefallen": {
    "ich": "gefalle", 
    "du": "gefällst", 
    "er": "gefällt", 
    "sie": "gefällt", 
    "es": "gefällt", 
    "wir": "gefallen", 
    "ihr": "gefallt", 
    "Sie": "gefallen",
    "default": "gefallen"
  },
  "gratulieren": {
    "ich": "gratuliere", 
    "du": "gratulierst", 
    "er": "gratuliert", 
    "sie": "gratuliert", 
    "es": "gratuliert", 
    "wir": "gratulieren", 
    "ihr": "gratuliert", 
    "Sie": "gratulieren",
    "default": "gratulieren"
  },
  "lieben": {
    "ich": "liebe", 
    "du": "liebst", 
    "er": "liebt", 
    "sie": "liebt", 
    "es": "liebt", 
    "wir": "lieben", 
    "ihr": "liebt", 
    "Sie": "lieben",
    "default": "lieben"
  },
  "hassen": {
    "ich": "hasse", 
    "du": "hasst", 
    "er": "hasst", 
    "sie": "hasst", 
    "es": "hasst", 
    "wir": "hassen", 
    "ihr": "hasst", 
    "Sie": "hassen",
    "default": "hassen"
  },
  "kaufen": {
    "ich": "kaufe", 
    "du": "kaufst", 
    "er": "kauft", 
    "sie": "kauft", 
    "es": "kauft", 
    "wir": "kaufen", 
    "ihr": "kauft", 
    "Sie": "kaufen",
    "default": "kaufen"
  },
  "verkaufen": {
    "ich": "verkaufe", 
    "du": "verkaufst", 
    "er": "verkauft", 
    "sie": "verkauft", 
    "es": "verkauft", 
    "wir": "verkaufen", 
    "ihr": "verkauft", 
    "Sie": "verkaufen",
    "default": "verkaufen"
  },
  "finden": {
    "ich": "finde", 
    "du": "findest", 
    "er": "findet", 
    "sie": "findet", 
    "es": "findet", 
    "wir": "finden", 
    "ihr": "findet", 
    "Sie": "finden",
    "default": "finden"
  },
  "suchen": {
    "ich": "suche", 
    "du": "suchst", 
    "er": "sucht", 
    "sie": "sucht", 
    "es": "sucht", 
    "wir": "suchen", 
    "ihr": "sucht", 
    "Sie": "suchen",
    "default": "suchen"
  },
  "brauchen": {
    "ich": "brauche", 
    "du": "brauchst", 
    "er": "braucht", 
    "sie": "braucht", 
    "es": "braucht", 
    "wir": "brauchen", 
    "ihr": "braucht", 
    "Sie": "brauchen",
    "default": "brauchen"
  },
  "kennen": {
    "ich": "kenne", 
    "du": "kennst", 
    "er": "kennt", 
    "sie": "kennt", 
    "es": "kennt", 
    "wir": "kennen", 
    "ihr": "kennt", 
    "Sie": "kennen",
    "default": "kennen"
  },
  "geben": {
    "ich": "gebe", 
    "du": "gibst", 
    "er": "gibt", 
    "sie": "gibt", 
    "es": "gibt", 
    "wir": "geben", 
    "ihr": "gibt", 
    "Sie": "geben",
    "default": "geben"
  },
  "nehmen": {
    "ich": "nehme", 
    "du": "nimmst", 
    "er": "nimmt", 
    "sie": "nimmt", 
    "es": "nimmt", 
    "wir": "nehmen", 
    "ihr": "nimmt", 
    "Sie": "nehmen",
    "default": "nehmen"
  },
  "lernen": {
    "ich": "lerne", 
    "du": "lernst", 
    "er": "lernt", 
    "sie": "lernt", 
    "es": "lernt", 
    "wir": "lernen", 
    "ihr": "lernt", 
    "Sie": "lernen",
    "default": "lernen"
  },
  "verstehen": {
    "ich": "verstehe", 
    "du": "verstehst", 
    "er": "versteht", 
    "sie": "versteht", 
    "es": "versteht", 
    "wir": "verstehen", 
    "ihr": "versteht", 
    "Sie": "verstehen",
    "default": "verstehen"
  }
};

// Función para obtener el sujeto simple de un texto (para pronombres o sustantivos simples)
const getSimpleSubject = (subjectText: string): string => {
  // Extraer pronombres comunes
  if (["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"].includes(subjectText)) {
    return subjectText;
  }
  
  // Para frases nominales, devolver "er/sie/es" según el artículo
  if (subjectText.startsWith("der ") || subjectText.startsWith("dieser ") || 
      subjectText.startsWith("mein ") || subjectText.includes("Bruder") || 
      subjectText.includes("Student") || subjectText.includes("Hund")) {
    return "er";
  } else if (subjectText.startsWith("die ") || subjectText.startsWith("diese ") || 
             subjectText.startsWith("meine ") || subjectText.startsWith("deine ") || 
             subjectText.includes("Schwester") || subjectText.includes("Lehrerin") || 
             subjectText.includes("Katze")) {
    return "sie";
  } else if (subjectText.startsWith("das ") || subjectText.startsWith("dieses ") || 
             subjectText.includes("Kind")) {
    return "es";
  }
  
  // Por defecto
  return "es";
};

// Función para conjugar correctamente un verbo según el sujeto de forma segura
const conjugateVerb = (verb: string, subject: string): string => {
  // Si no tenemos el verbo o sujeto, devolver el verbo original
  if (!verb || !subject) return verb;
  
  // Obtener el sujeto básico (pronombre)
  const simpleSubject = getSimpleSubject(subject);
  
  // Verificar si tenemos conjugaciones para este verbo
  if (verbConjugations[verb]) {
    // Devolver la conjugación correspondiente o la forma por defecto
    return verbConjugations[verb][simpleSubject] || verbConjugations[verb].default || verb;
  }
  
  // Si no está en la tabla, devolver el verbo original
  return verb;
};

export default function SentenceBuilder() {
  const [activeTab, setActiveTab] = useState<ItemType>("nominativ")
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [droppedItems, setDroppedItems] = useState<Record<string, any>>({})
  const [activeItem, setActiveItem] = useState<any>(null)

  const currentPattern = sentencePatterns[currentPatternIndex]

  // Set up sensors for different input types
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance in pixels to start a drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Small delay for touch devices to distinguish from scroll
        tolerance: 8, // Small movement tolerance for better touch handling
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeData = active.data.current
    setActiveItem(activeData)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add logic for drag over effects
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    
    if (!over) return
    
    const activeId = active.id as string
    const overId = over.id as string
    
    // Get the active item's data
    const activeData = active.data.current
    
    // Get the target slot from the current pattern
    const targetSlot = currentPattern.slots.find(slot => slot.id === overId)
    
    // Check if the item type matches the target slot type
    if (targetSlot && activeData.type === targetSlot.type) {
      // First, check if this item is already in another slot and remove it
      const existingSlot = Object.entries(droppedItems).find(
        ([_, value]) => value && value.id === activeId
      )
      
      if (existingSlot) {
        const [existingSlotId] = existingSlot
        setDroppedItems((prev) => {
          const newItems = { ...prev }
          delete newItems[existingSlotId]
          return {
            ...newItems,
            [overId]: activeData,
          }
        })
      } else {
        setDroppedItems((prev) => ({
          ...prev,
          [overId]: activeData,
        }))
      }
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

  // Find the item for drag overlay
  const findItemById = (id: string) => {
    for (const type in items) {
      const found = items[type as keyof typeof items].find(item => item.id === id)
      if (found) return found
    }
    return null
  }

  // Función auxiliar para formatear la frase construida correctamente en alemán
  const formatSentence = () => {
    if (Object.keys(droppedItems).length !== currentPattern.slots.length) {
      return null;
    }
    
    // Obtener los elementos por su posición gramatical
    const slotsByPosition: Record<string, any> = {};
    currentPattern.slots.forEach(slot => {
      if (droppedItems[slot.id]) {
        slotsByPosition[slot.position] = droppedItems[slot.id];
      }
    });
    
    // Verificar conjugación basada en el sujeto y el verbo
    const subject = slotsByPosition.subject;
    const verb = slotsByPosition.verb;
    const object = slotsByPosition.object;
    const dativObj = slotsByPosition.dativ;
    
    // No intentar formatear si falta alguna parte requerida
    if ((currentPattern.slots.some(s => s.position === 'subject') && !subject) || 
        (currentPattern.slots.some(s => s.position === 'verb') && !verb)) {
      return null;
    }
    
    let sentence = '';
    
    // Aplicar conjugación correcta del verbo según el sujeto
    const conjugatedVerb = subject ? conjugateVerb(verb.text, subject.text) : verb.text;
    
    // Construir la frase según el patrón
    if (currentPattern.id === 1) { // Subjekt + Verb
      sentence = `${subject.text} ${conjugatedVerb}`;
    } 
    else if (currentPattern.id === 2) { // Subjekt + Verb + Subjekt
      sentence = `${subject.text} ${conjugatedVerb} ${object.text}`;
    } 
    else if (currentPattern.id === 3) { // Subjekt + Akkusativ + Verb
      sentence = `${subject.text} ${object.text} ${verb.text}`;
    } 
    else if (currentPattern.id === 4) { // Subjekt + Verb + Dativ
      sentence = `${subject.text} ${conjugatedVerb} ${dativObj.text}`;
    }
    
    // Capitalizar la primera letra y añadir punto final
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors}
      autoScroll={{
        enabled: true,
        acceleration: 10,
        threshold: { x: 0.1, y: 0.1 },
      }}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ItemType)}>
          <TabsList className="w-full grid grid-cols-4 bg-gray-100 p-0">
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
            <TabsTrigger value="dativ" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 py-3">
              Dativ
            </TabsTrigger>
          </TabsList>

          {Object.entries(items).map(([type, typeItems]) => (
            <TabsContent
              key={type}
              value={type}
              className={`p-4 ${
                type === "nominativ" ? "bg-yellow-50" : 
                type === "akkusativ" ? "bg-blue-50" : 
                type === "dativ" ? "bg-green-50" : 
                "bg-gray-100"
              }`}
            >
              <div className="flex overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
                <div className="flex gap-4 px-1">
                  {typeItems.map((item) => (
                    <div key={item.id} className="flex-shrink-0 snap-center w-32">
                      <DraggableItem id={item.id} text={item.text} type={item.type} />
                    </div>
                  ))}
                </div>
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

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 md:p-8 rounded-lg bg-white shadow-md min-h-[280px] w-full mx-2 md:mx-4 sentence-container hardware-accelerated">
              {currentPattern.slots.map((slot) => (
                <DropTarget
                  key={slot.id}
                  id={slot.id}
                  type={slot.type}
                  position={slot.position}
                  onDrop={(id, item) => {
                    // Handle drop will be managed by DndContext
                  }}
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
              <>
                <p className="mt-4 text-green-600 font-bold">Sehr gut! Du hast einen korrekten Satz gebildet.</p>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                  <p className="text-lg font-medium text-gray-800">{formatSentence()}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drag Overlay - shows a preview of the dragged item */}
      <DragOverlay>
        {activeItem ? (
          <div className={`
            w-32 h-32 flex items-center justify-center
            text-center font-medium shape-shadow
            relative
            ${activeItem.type === "nominativ" ? "clip-path-hexagon bg-yellow-300" : ""}
            ${activeItem.type === "verb" ? "clip-path-cross bg-black text-white" : ""}
            ${activeItem.type === "akkusativ" ? "clip-path-square bg-blue-300" : ""}
            ${activeItem.type === "dativ" ? "clip-path-triangle bg-green-300" : ""}
            before:absolute before:inset-0 before:content-[''] 
            ${activeItem.type === "nominativ" ? "before:clip-path-hexagon before:border-2 before:border-yellow-500" : ""}
            ${activeItem.type === "verb" ? "before:clip-path-cross before:border-2 before:border-gray-700" : ""}
            ${activeItem.type === "akkusativ" ? "before:clip-path-square before:border-2 before:border-blue-500" : ""}
            ${activeItem.type === "dativ" ? "before:clip-path-triangle before:border-2 before:border-green-500" : ""}
          `}>
            <span className="px-2 py-1 text-sm sm:text-base z-above-clip-path">{activeItem.text}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
