import { Card } from './ui/card'
import ChecklistItem from './CheckListItem'
import { getTodos } from '@/lib/utils/actions';

const CheckListPanel = async () => {

  const todos = await getTodos(3)
  // console.log("todos", todos)
  

  return (
    <Card className="w-full h-auto p-4 border-2 border-zinc-800 bg-zinc-950 text-zinc-400">
        {todos.map((todo) => (
        <ChecklistItem key={todo.id} id={todo.id} label={todo.text} value={todo.is_done} />
        ))}
    </Card>
  )
}

export default CheckListPanel