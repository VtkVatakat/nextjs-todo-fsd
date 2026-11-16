import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/shared/lib/db';
import { updateTodoSchema } from '@/entities/todo/model/schema';
import type { DbSchema } from '@/entities/todo/model/schema';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateTodoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Некорректные данные', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await readDb<DbSchema>();
    const todoIndex = db.todos.findIndex((item) => item.id === id);

    if (todoIndex === -1) {
      return NextResponse.json({ message: 'Задача не найдена' }, { status: 404 });
    }

    db.todos[todoIndex] = {
      ...db.todos[todoIndex],
      ...parsed.data,
    };

    await writeDb(db);
    return NextResponse.json(db.todos[todoIndex]);
  } catch {
    return NextResponse.json({ message: 'Ошибка при обновлении задачи' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await readDb<DbSchema>();
    const initialLength = db.todos.length;

    db.todos = db.todos.filter((item) => item.id !== id);

    if (db.todos.length === initialLength) {
      return NextResponse.json({ message: 'Задача не найдена' }, { status: 404 });
    }

    await writeDb(db);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Ошибка при удалении задачи' }, { status: 500 });
  }
}
