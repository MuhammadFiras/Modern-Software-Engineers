'use client';

import { useState } from 'react';
import Button from './Button';

interface ActionItem {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ActionItemCardProps {
  item: ActionItem;
  onUpdate: (item: ActionItem) => void;
  onDelete: (id: number) => void;
}

export default function ActionItemCard({ item, onUpdate, onDelete }: ActionItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(item.description);
  const [completed, setCompleted] = useState(item.completed);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/action-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, completed }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update action item');
        return;
      }

      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update action item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      const response = await fetch(`/api/action-items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: item.description, completed: !completed }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdate(updated);
        setCompleted(!completed);
      }
    } catch (err) {
      console.error('Failed to toggle completion:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this action item?')) {
      try {
        await fetch(`/api/action-items/${item.id}`, { method: 'DELETE' });
        onDelete(item.id);
      } catch (err) {
        console.error('Failed to delete action item:', err);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
          placeholder="Description"
        />
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 border ${completed ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700'}`}>
      <div className="flex items-start gap-3 mb-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className="w-5 h-5 mt-1 rounded cursor-pointer accent-blue-500"
        />
        <div className="flex-1">
          <p className={`${completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>
            {item.description}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Created: {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setIsEditing(true)} variant="secondary">
          Edit
        </Button>
        <Button onClick={handleDelete} variant="danger">
          Delete
        </Button>
      </div>
    </div>
  );
}
