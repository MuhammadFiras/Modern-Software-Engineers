import { useState, useEffect } from 'react';
import { getActionItems, createActionItem, updateActionItem, deleteActionItem } from '../api';

export default function TasksPanel() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try { setItems(await getActionItems()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function resetForm() {
    setDescription(''); setError('');
    setShowForm(false); setEditId(null);
  }

  function startEdit(item) {
    setEditId(item.id); setDescription(item.description);
    setShowForm(true); setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) { setError('Description is required'); return; }
    setSaving(true);
    try {
      if (editId) {
        const current = items.find(i => i.id === editId);
        const updated = await updateActionItem(editId, { description, completed: current.completed });
        setItems(items.map(i => i.id === editId ? updated : i));
      } else {
        const created = await createActionItem({ description });
        setItems([created, ...items]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally { setSaving(false); }
  }

  async function toggleComplete(item) {
    try {
      const updated = await updateActionItem(item.id, {
        description: item.description,
        completed: !item.completed,
      });
      setItems(items.map(i => i.id === item.id ? updated : i));
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this action item?')) return;
    try {
      await deleteActionItem(id);
      setItems(items.filter(i => i.id !== id));
      if (editId === id) resetForm();
    } catch { /* ignore */ }
  }

  const completed = items.filter(i => i.completed).length;

  return (
    <div>
      <div className="section-bar">
        <span className="counter">{completed} of {items.length} completed</span>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <textarea
            className="form-textarea"
            placeholder="Describe the action item..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editId ? 'Update Task' : 'Create Task'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : items.length === 0 ? (
        <p className="empty-state">No action items yet. Create one to get started!</p>
      ) : (
        <div className="item-list">
          {items.map(item => (
            <div key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleComplete(item)}
                />
              </div>
              <div className="item-body">
                <p className={item.completed ? 'strike' : ''}>{item.description}</p>
                <span className="item-meta">Created {new Date(item.created_at).toLocaleString()}</span>
              </div>
              <div className="item-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
