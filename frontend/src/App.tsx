import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden font-sans text-slate-200">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default App;