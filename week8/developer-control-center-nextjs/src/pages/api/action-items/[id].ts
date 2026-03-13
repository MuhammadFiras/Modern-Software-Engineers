import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const itemId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      const item = await prisma.actionItem.findUnique({ where: { id: itemId } });
      if (!item) return res.status(404).json({ error: 'Action item not found' });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action item' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { description, completed } = req.body;

      if (!description || !description.trim()) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const item = await prisma.actionItem.update({
        where: { id: itemId },
        data: {
          description: description.trim(),
          ...(typeof completed === 'boolean' && { completed }),
        },
      });
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update action item' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.actionItem.delete({ where: { id: itemId } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete action item' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
