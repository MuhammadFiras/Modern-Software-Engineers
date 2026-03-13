import { useState } from 'react';
import NotesPanel from './components/NotesPanel';
import TasksPanel from './components/TasksPanel';

export default function App() {
  const [tab, setTab] = useState('notes');

  return (
    <>
      <header className="app-header">
        <h1>Developer Control Center</h1>
        <p>Manage your notes and action items in one place</p>
      </header>

      <div className="app-body">
        <div className="tabs">
          <button
            className={`tab-btn ${tab === 'notes' ? 'active' : ''}`}
            onClick={() => setTab('notes')}
          >
            Notes
          </button>
          <button
            className={`tab-btn ${tab === 'tasks' ? 'active' : ''}`}
            onClick={() => setTab('tasks')}
          >
            Action Items
          </button>
        </div>

        {tab === 'notes' ? <NotesPanel /> : <TasksPanel />}
      </div>
    </>
  );
}
