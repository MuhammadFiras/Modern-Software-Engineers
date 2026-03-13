import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api';

export default function NotesPanel() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try { setNotes(await getNotes()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function resetForm() {
    setTitle(''); setContent(''); setError('');
    setShowForm(false); setEditId(null);
  }

  function startEdit(n) {
    setEditId(n.id); setTitle(n.title); setContent(n.content);
    setShowForm(true); setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }
    setSaving(true);
    try {
      if (editId) {
        const updated = await updateNote(editId, { title, content });
        setNotes(notes.map(n => n.id === editId ? updated : n));
      } else {
        const created = await createNote({ title, content });
        setNotes([created, ...notes]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      if (editId === id) resetForm();
    } catch { /* ignore */ }
  }

  return (
    <div>
      <div className="section-bar">
        <span className="counter">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ New Note'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <input
            className="form-input"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="form-textarea"
            placeholder="Write your note..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editId ? 'Update Note' : 'Create Note'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="empty-state">No notes yet. Create one to get started!</p>
      ) : (
        <div className="item-list">
          {notes.map(n => (
            <div key={n.id} className="item-card">
              <div className="item-body">
                <h3>{n.title}</h3>
                <p>{n.content}</p>
                <span className="item-meta">Updated {new Date(n.updated_at).toLocaleString()}</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(n)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
