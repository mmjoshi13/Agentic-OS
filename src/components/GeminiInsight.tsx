import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateInsight } from '../services/geminiService';

interface GeminiInsightProps {
  prompt: string;
  title?: string;
  className?: string;
  model?: string;
  systemInstruction?: string;
  compact?: boolean;
  onComplete?: () => void;
}

export const GeminiInsight: React.FC<GeminiInsightProps> = ({ 
  prompt, 
  title = "Gemini Intelligence", 
  className = "",
  model = "gemini-3-flash-preview",
  systemInstruction,
  compact = false,
  onComplete
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    // If compact, we append a request for brevity to the prompt
    const finalPrompt = compact 
      ? `${prompt}\n\nIMPORTANT: Provide a very concise, actionable response. Use bullet points. Keep it under 100 words. Focus on the most critical action.`
      : prompt;
    
    const result = await generateInsight(finalPrompt, model, systemInstruction);
    setInsight(result || "Unable to generate insight.");
    setLoading(false);
    if (onComplete) onComplete();
  };

  useEffect(() => {
    fetchInsight();
  }, [prompt]);

  return (
    <div className={`p-6 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-2xl border border-indigo-500/10 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white shadow-sm shadow-indigo-200">
            <Sparkles size={14} />
          </div>
          <h5 className="text-[11px] font-bold text-indigo-900 uppercase tracking-[0.15em]">{title}</h5>
        </div>
        <button 
          onClick={fetchInsight} 
          disabled={loading}
          className="p-1.5 text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center gap-3 text-indigo-600/60">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-xs font-semibold italic">Analyzing data...</span>
        </div>
      ) : (
        <div className="markdown-body text-sm text-indigo-950 leading-relaxed font-medium">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="space-y-2 mb-3">{children}</ul>,
              li: ({ children }) => (
                <li className="flex gap-2 items-start">
                  <ChevronRight size={14} className="mt-1 shrink-0 text-indigo-500" />
                  <span>{children}</span>
                </li>
              ),
              strong: ({ children }) => <strong className="font-bold text-indigo-700">{children}</strong>,
            }}
          >
            {insight || ""}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};
