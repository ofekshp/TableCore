import { faker } from '@faker-js/faker';
import type { Column, Row, TableData } from '../types/index.ts';

export function generateMockTableData(rowCount = 100): TableData {
  const columns: Column[] = [
    { id: 'name', ordinalNo: 1, title: 'Name', type: 'string' },
    { id: 'age', ordinalNo: 2, title: 'Age', type: 'number' },
    { id: 'isActive', ordinalNo: 3, title: 'Active', type: 'boolean' },
    {
      id: 'role',
      ordinalNo: 4,
      title: 'Role',
      type: 'select',
      options: ['User', 'Admin', 'Guest'],
    },
  ];

  const data: Row[] = Array.from({ length: rowCount }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 65 }),
    isActive: faker.datatype.boolean(),
    role: faker.helpers.arrayElement(['User', 'Admin', 'Guest']),
  }));

  return { columns, data };
}
