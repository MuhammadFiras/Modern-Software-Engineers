import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(notes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, content } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const note = await prisma.note.create({
        data: { title: title.trim(), content: content.trim() },
      });
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
