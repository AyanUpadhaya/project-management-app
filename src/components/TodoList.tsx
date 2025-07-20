// TodoList.tsx
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Todo } from "@/types";

function TodoItem({
  todo,
  onUpdate,
  onDelete,
}: {
  todo: Todo;
  onUpdate: (id: string, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.title);

  const handleUpdate = () => {
    onUpdate(todo.id!, { title: text });
    setIsEditing(false);
  };

  return (
    <div className="ml-4 space-y-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={(checked) =>
            onUpdate(todo.id!, { completed: !!checked })
          }
        />
        {isEditing ? (
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleUpdate}
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{todo.title}</span>
        )}
        <Select
          value={todo.priority}
          onValueChange={(priority) =>
            onUpdate(todo.id!, { priority: priority as Todo["priority"] })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(todo.id!)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function TodoList({
  todos,
  onAdd,
  onUpdate,
  onDelete,
}: {
  todos: Todo[];
  onAdd: (todo: Todo) => void;
  onUpdate: (id: string, updatedTodo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}) {
  const [newTodoText, setNewTodoText] = useState("");

  const handleAdd = () => {
    if (!newTodoText.trim()) return;
    onAdd({ title: newTodoText, priority: "low", completed: false } as Todo);
    setNewTodoText("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo"
        />
        <Button onClick={handleAdd}> + Add Todo</Button>
      </div>
      <div>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
