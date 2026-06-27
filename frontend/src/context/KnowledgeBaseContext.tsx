import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: string;
  chunksProcessed?: number;
}

interface KnowledgeBaseContextType {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

const KnowledgeBaseContext = createContext<KnowledgeBaseContextType | undefined>(undefined);

export function KnowledgeBaseProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <KnowledgeBaseContext.Provider value={{ files, setFiles }}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

export function useKnowledgeBase() {
  const context = useContext(KnowledgeBaseContext);
  if (context === undefined) {
    throw new Error('useKnowledgeBase must be used within a KnowledgeBaseProvider');
  }
  return context;
}
