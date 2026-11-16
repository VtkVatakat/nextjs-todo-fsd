import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/shared/lib/db';
import { createTodoSchema } from '@/entities/todo/model/schema';
import type { DbSchema, Todo } from '@/entities/todo/model/schema';

export async function GET() {
  try {
    const db = await readDb<DbSchema>();
    return NextResponse.json(db.todos);
  } catch {
    return NextResponse.json({ message: 'Ошибка чтения базы данных' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createTodoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Ошибка валидации', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await readDb<DbSchema>();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: parsed.data.title,
      completed: false,
    };

    db.todos.push(newTodo);
    await writeDb(db);

    return NextResponse.json(newTodo, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Ошибка при создании задачи' }, { status: 500 });
  }
}
