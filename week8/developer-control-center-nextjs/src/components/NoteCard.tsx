'use client';

import { useState } from 'react';
import Button from './Button';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (id: number) => void;
}

export default function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      return;
    }
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update note');
        return;
      }

      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
        onDelete(note.id);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
          placeholder="Content"
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
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-2">{note.title}</h3>
      <p className="text-gray-300 mb-4 whitespace-pre-wrap">{note.content}</p>
      <p className="text-xs text-gray-500 mb-4">
        Updated: {new Date(note.updatedAt).toLocaleString()}
      </p>
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
