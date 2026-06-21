import { Upload, FileText, CheckCircle } from 'lucide-react';

const MOCK_FILES = [
  { id: 1, name: 'physics_notes.pdf', size: '2.4 MB', status: 'Embedded' },
  { id: 2, name: 'project_requirements.txt', size: '15 KB', status: 'Embedded' },
  { id: 3, name: 'api_documentation.pdf', size: '1.1 MB', status: 'Processing' },
];

export function KnowledgeBase() {
  return (
    <div className="flex-1 flex flex-col bg-bg-app h-full overflow-hidden transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Knowledge Base</h1>
            <p className="text-text-secondary">Upload documents to expand the Friction RAG Engine's context.</p>
          </div>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-border-color rounded-3xl p-12 flex flex-col items-center justify-center bg-bg-panel/50 hover:bg-bg-panel transition-colors cursor-pointer group">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-1">Click or drag documents to upload</h3>
            <p className="text-sm text-text-muted">Supports PDF, TXT (Max 50MB)</p>
          </div>

          {/* Indexed Files */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Indexed Files</h2>
            <div className="bg-bg-panel border border-border-color rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-color bg-header/50">
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Size</th>
                    <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                  {MOCK_FILES.map((file) => (
                    <tr key={file.id} className="hover:bg-bg-sidebar/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <span className="text-sm font-medium text-text-primary">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {file.size}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5">
                          {file.status === 'Embedded' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                          )}
                          <span className={`text-xs font-medium ${file.status === 'Embedded' ? 'text-emerald-500' : 'text-accent'}`}>
                            {file.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
