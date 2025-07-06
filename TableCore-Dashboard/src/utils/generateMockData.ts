import { faker } from "@faker-js/faker";
import type { Column, Row, TableData } from "../types";

export function generateMockData(rowCount = 100): TableData {
  // Generates mock data for a table with specified number of rows
  const columns: Column[] = [
    { id: "name", ordinalNo: 1, title: "Name", type: "string", visible: true },
    { id: "age", ordinalNo: 2, title: "Age", type: "number", visible: true },
    {
      id: "isActive",
      ordinalNo: 3,
      title: "Active",
      type: "boolean",
      visible: true,
    },
    {
      id: "role",
      ordinalNo: 4,
      title: "Role",
      type: "select",
      options: ["User", "Admin", "Guest"],
      visible: true,
    },
  ];

  const data: Row[] = Array.from({ length: rowCount }, () => ({
    id: faker.string.uuid(),
    name: faker.person
      .fullName()
      .replace(/[^a-zA-Z\s]/g, "")
      .slice(0, 25), // Ensure only letters and max 25 chars
    age: faker.number.int({ min: 18, max: 65 }),
    isActive: faker.datatype.boolean(),
    role: faker.helpers.arrayElement(["User", "Admin", "Guest"]),
  }));

  return { columns, data };
}
