import { useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useKnowledgeBase, type UploadedFile } from '../context/KnowledgeBaseContext';

export function KnowledgeBase() {
  const { files, setFiles } = useKnowledgeBase();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'Processing'
    };
    
    setFiles(prev => [...prev, newFile]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const res = await response.json();
      
      setFiles(prev => prev.map(f => {
        if (f.id === newFile.id) {
          return {
            ...f,
            status: res.status || 'Error',
            chunksProcessed: res.chunks_processed
          };
        }
        return f;
      }));

    } catch (error) {
      console.error("Upload failed", error);
      setFiles(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'Error' } : f));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col bg-bg-app h-full overflow-hidden transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Knowledge Base</h1>
            <p className="text-text-secondary">Upload documents to expand the Friction RAG Engine's context.</p>
          </div>

          {/* Upload Zone */}
          <div 
            className="border-2 border-dashed border-border-color rounded-3xl p-12 flex flex-col items-center justify-center bg-bg-panel/50 hover:bg-bg-panel transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept=".pdf,.txt"
            />
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
                  {files.map((file) => (
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            {file.status === 'Embedded' ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : file.status === 'Error' ? (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                            )}
                            <span className={`text-xs font-medium ${
                              file.status === 'Embedded' ? 'text-emerald-500' : 
                              file.status === 'Error' ? 'text-red-500' : 'text-accent'
                            }`}>
                              {file.status} {file.chunksProcessed ? `(${file.chunksProcessed} chunks)` : ''}
                            </span>
                          </div>
                          <button className="text-red-500 hover:text-red-400 cursor-pointer ml-4">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {files.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-text-muted">
                        No files uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
