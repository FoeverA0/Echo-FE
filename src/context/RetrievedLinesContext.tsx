import { createContext, useContext, useState, ReactNode } from "react";

type RetrievedLine = {
  text: string;
  distance: number;
  collection: string;
  contributor_address: string;
  source_id: string;
};

type RetrievedLinesContextType = {
  retrievedLines: RetrievedLine[];
  setRetrievedLines: (lines: RetrievedLine[]) => void;
};

const RetrievedLinesContext = createContext<RetrievedLinesContextType | undefined>(undefined);

export const RetrievedLinesProvider = ({ children }: { children: ReactNode }) => {
  const [retrievedLines, setRetrievedLines] = useState<RetrievedLine[]>([]);

  return (
    <RetrievedLinesContext.Provider value={{ retrievedLines, setRetrievedLines }}>
      {children}
    </RetrievedLinesContext.Provider>
  );
};

export const useRetrievedLines = () => {
  const context = useContext(RetrievedLinesContext);
  if (!context) {
    throw new Error("useRetrievedLines must be used within a RetrievedLinesProvider");
  }
  return context;
};