export const nextId = (rows: Array<{ id: number }>): number => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
