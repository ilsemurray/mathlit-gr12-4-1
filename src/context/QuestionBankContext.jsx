/**
 * QuestionBankContext
 * Stores the uploaded question bank text globally so any page can access it.
 * Teachers upload a PDF or text file; we extract the text and store it here.
 * The text is passed to Gemini as a reference when generating assessments.
 */
import { createContext, useContext, useState } from "react";

const QuestionBankContext = createContext(null);

export function QuestionBankProvider({ children }) {
  const [questionBankText, setQuestionBankText] = useState("");
  const [questionBankFileName, setQuestionBankFileName] = useState("");
  const [questionBankLoading, setQuestionBankLoading] = useState(false);
  const [questionBankError, setQuestionBankError] = useState("");

  const uploadQuestionBank = async (file) => {
    setQuestionBankLoading(true);
    setQuestionBankError("");
    setQuestionBankText("");
    setQuestionBankFileName("");

    try {
      let text = "";

      if (file.type === "application/pdf") {
        // Use FileReader to read PDF as text (basic extraction)
        text = await extractTextFromFile(file);
      } else if (
        file.type === "text/plain" ||
        file.name.endsWith(".txt")
      ) {
        text = await file.text();
      } else {
        throw new Error("Please upload a PDF or .txt file.");
      }

      if (!text || text.trim().length < 50) {
        throw new Error("Could not extract enough text from the file. Try a .txt version.");
      }

      setQuestionBankText(text);
      setQuestionBankFileName(file.name);
    } catch (e) {
      setQuestionBankError(e.message || "Failed to read file.");
    } finally {
      setQuestionBankLoading(false);
    }
  };

  const clearQuestionBank = () => {
    setQuestionBankText("");
    setQuestionBankFileName("");
    setQuestionBankError("");
  };

  return (
    <QuestionBankContext.Provider
      value={{
        questionBankText,
        questionBankFileName,
        questionBankLoading,
        questionBankError,
        uploadQuestionBank,
        clearQuestionBank,
        hasQuestionBank: !!questionBankText,
      }}
    >
      {children}
    </QuestionBankContext.Provider>
  );
}

export function useQuestionBank() {
  const context = useContext(QuestionBankContext);
  if (!context) throw new Error("useQuestionBank must be used within QuestionBankProvider");
  return context;
}

// Helper: extract text from a file using FileReader
function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // For PDFs we get binary — try to extract readable text
      const raw = e.target.result;
      // Extract readable ASCII text from the binary
      const text = raw
        .split("")
        .filter((c) => c.charCodeAt(0) > 31 && c.charCodeAt(0) < 127)
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      resolve(text);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsBinaryString(file);
  });
}
