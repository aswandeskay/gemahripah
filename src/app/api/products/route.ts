import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const products = JSON.parse(fileContents);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: "Error reading products data" }, { status: 500 });
  }
}
