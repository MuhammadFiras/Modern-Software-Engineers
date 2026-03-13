'use client';

import { useState, useEffect } from 'react';
import ActionItemCard from './ActionItemCard';
import Button from './Button';

interface ActionItem {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ActionItemsSection() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/action-items');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch action items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create action item');
        return;
      }

      const newItem = await response.json();
      setItems([newItem, ...items]);
      setDescription('');
      setShowForm(false);
    } catch (err) {
      setError('Failed to create action item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = items.filter((item) => item.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Action Items</h2>
          <p className="text-sm text-gray-400 mt-1">
            {completedCount} of {items.length} completed
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : '+ New Task'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <textarea
            placeholder="Describe the action item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          />
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Action Item'}
          </Button>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-400">Loading action items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No action items yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <ActionItemCard
              key={item.id}
              item={item}
              onUpdate={(updated) => setItems(items.map((i) => (i.id === updated.id ? updated : i)))}
              onDelete={(id) => setItems(items.filter((i) => i.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
