import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.actionItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch action items' });
    }
  } else if (req.method === 'POST') {
    try {
      const { description } = req.body;

      if (!description || !description.trim()) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const item = await prisma.actionItem.create({
        data: { description: description.trim() },
      });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create action item' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
