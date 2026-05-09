import { useRef } from "react";
import { useQuestionBank } from "../../context/QuestionBankContext";
import Button from "../shared/Button";

export default function QuestionBankUploader() {
  const {
    hasQuestionBank,
    questionBankFileName,
    questionBankLoading,
    questionBankError,
    uploadQuestionBank,
    clearQuestionBank,
  } = useQuestionBank();

  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadQuestionBank(file);
    e.target.value = "";
  };

  return (
    <div className="mb-5">
      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
        Question Bank (optional)
      </label>

      {!hasQuestionBank && !questionBankLoading && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <p className="text-2xl mb-1">📂</p>
          <p className="text-sm font-medium text-gray-700">Upload a question paper bank</p>
          <p className="text-xs text-gray-400 mt-1">PDF or .txt file · Used as reference for generating questions</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}

      {questionBankLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-center gap-2">
          <span className="animate-spin">⏳</span> Reading file...
        </div>
      )}

      {questionBankError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          ⚠️ {questionBankError}
        </div>
      )}

      {hasQuestionBank && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-green-800">✅ Question bank loaded</p>
            <p className="text-xs text-green-600 truncate max-w-xs">{questionBankFileName}</p>
            <p className="text-xs text-green-500 mt-0.5">AI will use this as a reference for question style and difficulty</p>
          </div>
          <button
            onClick={clearQuestionBank}
            className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
