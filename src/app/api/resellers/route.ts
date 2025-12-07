import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Reseller } from '@/types';

const filePath = path.join(process.cwd(), 'data/resellers.json');

// GET: Ambil semua reseller
export async function GET() {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const resellers = JSON.parse(fileContents);
    return NextResponse.json(resellers);
  } catch (error) {
    return NextResponse.json({ message: "Error reading resellers data" }, { status: 500 });
  }
}

// POST: Tambah reseller baru
export async function POST(request: Request) {
  try {
    const resellers: Reseller[] = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const newReseller: Reseller = await request.json();

    // Validasi sederhana
    if (!newReseller.name || !newReseller.scheme) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    // Generate ID sederhana dari nama
    newReseller.id = newReseller.name.toLowerCase().replace(/\s+/g, '');

    resellers.push(newReseller);
    await fs.writeFile(filePath, JSON.stringify(resellers, null, 2));

    return NextResponse.json(newReseller, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error saving reseller" }, { status: 500 });
  }
}
