import NotesSection from '@/components/NotesSection';
import ActionItemsSection from '@/components/ActionItemsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Developer Control Center</h1>
          <p className="text-gray-400">Manage your notes and action items in one place</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <NotesSection />
          <ActionItemsSection />
        </div>
      </div>
    </main>
  );
}
