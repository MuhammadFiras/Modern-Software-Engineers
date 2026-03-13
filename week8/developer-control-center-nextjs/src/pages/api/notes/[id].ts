import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const noteId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      const note = await prisma.note.findUnique({ where: { id: noteId } });
      if (!note) return res.status(404).json({ error: 'Note not found' });
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, content } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const note = await prisma.note.update({
        where: { id: noteId },
        data: { title: title.trim(), content: content.trim() },
      });
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update note' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.note.delete({ where: { id: noteId } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
