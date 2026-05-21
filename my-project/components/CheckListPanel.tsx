"use client";

import React, { useState } from 'react'
import { Card } from './ui/card'
import ChecklistItem from './CheckListItem'

const CheckListPanel = () => {

    const [tasks, setTasks] = useState([
    { id: "task-cavo", text: "Prendi il cavo blu", completed: false },
    { id: "task-batteria", text: "Carica la cassa spia", completed: false },
    { id: "task-violino", text: "Verifica accordatura violino", completed: false },
  ])

  return (
    <Card className="w-full h-auto p-4 border-2 border-zinc-800 bg-zinc-950 text-zinc-400">
        {tasks.map((task) => (
        <ChecklistItem key={task.id} id={task.id} label={task.text} />
        ))}
    </Card>
  )
}

export default CheckListPanel