/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  Mic, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  History,
  LayoutDashboard,
  Send
} from 'lucide-react';
import { PROMPTS } from './constants';
import { Section, Prompt, Feedback } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('writing1');
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrompts = useMemo(() => 
    PROMPTS.filter(p => p.type === activeSection),
    [activeSection]
  );

  const currentPrompt = currentPrompts[activePromptIndex];

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setActivePromptIndex(0);
    setFeedback(null);
  };

  const handleNextPrompt = () => {
    if (activePromptIndex < currentPrompts.length - 1) {
      setActivePromptIndex(prev => prev + 1);
      setFeedback(null);
    }
  };

  const calculateWritingScore = (text: string, limit: number) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    let score = 5.0;
    const suggestions: string[] = [];

    if (wordCount === 0) return { score: 0, suggestions: ['Please enter some text.'] };

    // Word Count
    if (wordCount < limit) {
      const penalty = Math.min(2, (limit - wordCount) / 50);
      score -= penalty;
      suggestions.push(`Your word count (${wordCount}) is below the required ${limit} words. Aim for more detail.`);
    } else {
      score += 1.0;
      suggestions.push(`Good job meeting the word count requirement (${wordCount} words).`);
    }

    // Cohesion & Coherence
    const transitions = ['however', 'therefore', 'furthermore', 'consequently', 'overall', 'in addition', 'moreover', 'in conclusion', 'firstly', 'secondly'];
    const foundTransitions = transitions.filter(t => text.toLowerCase().includes(t));
    if (foundTransitions.length > 3) {
      score += 1.0;
      suggestions.push('Excellent use of cohesive devices to link your ideas.');
    } else {
      suggestions.push('Try to use more linking words (e.g., "Furthermore", "However") to improve flow.');
    }

    // Paragraphing
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length >= 3) {
      score += 0.5;
    } else {
      suggestions.push('Organize your response into clear paragraphs (Introduction, Body, Conclusion).');
    }

    return { 
      score: Math.min(9, Math.max(1, score)), 
      suggestions,
      wordCount 
    };
  };

  const calculateReadingScore = () => {
    if (!currentPrompt.questions) return { score: 0, suggestions: [] };
    
    let correct = 0;
    const suggestions: string[] = [];

    currentPrompt.questions.forEach(q => {
      const userAnswer = (readingAnswers[q.id] || '').toLowerCase().trim();
      const correctAnswer = q.answer.toLowerCase().trim();
      if (userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
        if (userAnswer.length > 0) correct++;
      } else {
        suggestions.push(`Question "${q.text}": Incorrect. The text mentions "${q.answer}".`);
      }
    });

    const score = (correct / currentPrompt.questions.length) * 9;
    suggestions.unshift(`You got ${correct} out of ${currentPrompt.questions.length} correct.`);
    
    return { score: Math.min(9, score), suggestions };
  };

  const calculateSpeakingScore = (text: string) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    let score = 5.5;
    const suggestions: string[] = [];

    if (wordCount < 50) {
      suggestions.push('Your response is too brief. Try to expand your answers with examples.');
      score -= 1.0;
    } else if (wordCount > 150) {
      score += 1.5;
      suggestions.push('Good length and detail in your response.');
    }

    const complexityWords = ['significant', 'consequently', 'illustrate', 'perspective', 'furthermore', 'nevertheless'];
    const foundComplexity = complexityWords.filter(w => text.toLowerCase().includes(w));
    if (foundComplexity.length > 1) {
      score += 1.0;
      suggestions.push('Nice use of advanced vocabulary.');
    } else {
      suggestions.push('Try to incorporate more academic vocabulary to boost your Lexical Resource score.');
    }

    return { score: Math.min(9, score), suggestions, wordCount };
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let result: Feedback;
      if (activeSection === 'reading') {
        result = calculateReadingScore();
      } else if (activeSection === 'speaking') {
        result = calculateSpeakingScore(answers[currentPrompt.id] || '');
      } else {
        result = calculateWritingScore(answers[currentPrompt.id] || '', currentPrompt.wordLimit || 150);
      }
      setFeedback(result);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3 text-[#003366]">
            <BarChart3 className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">IELTS Portal</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={<PenTool className="w-5 h-5" />} 
            label="Writing Task 1" 
            active={activeSection === 'writing1'} 
            onClick={() => handleSectionChange('writing1')}
          />
          <NavItem 
            icon={<PenTool className="w-5 h-5" />} 
            label="Writing Task 2" 
            active={activeSection === 'writing2'} 
            onClick={() => handleSectionChange('writing2')}
          />
          <NavItem 
            icon={<BookOpen className="w-5 h-5" />} 
            label="Reading Test" 
            active={activeSection === 'reading'} 
            onClick={() => handleSectionChange('reading')}
          />
          <NavItem 
            icon={<Mic className="w-5 h-5" />} 
            label="Speaking Prep" 
            active={activeSection === 'speaking'} 
            onClick={() => handleSectionChange('speaking')}
          />
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Progress</p>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Overall Completion</span>
              <span>25%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#003366] h-full w-1/4" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto p-12">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Practice Mode</span>
              <ChevronRight className="w-4 h-4" />
              <span className="capitalize">{activeSection.replace('writing', 'Writing Task ')}</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">{currentPrompt.title}</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setAnswers({});
                setReadingAnswers({});
                setFeedback(null);
              }}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Reset
            </button>
            {activePromptIndex < currentPrompts.length - 1 && (
              <button 
                onClick={handleNextPrompt}
                className="px-4 py-2 text-sm font-semibold text-[#003366] bg-[#003366]/5 hover:bg-[#003366]/10 rounded-lg transition-colors"
              >
                Next Prompt
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Prompt Section */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Test Prompt</span>
              {currentPrompt.wordLimit && (
                <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                  Target: {currentPrompt.wordLimit} words
                </span>
              )}
            </div>
            <div className="p-8">
              <p className="text-lg leading-relaxed text-slate-700 italic">
                {currentPrompt.description}
              </p>
              {currentPrompt.passage && (
                <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed max-h-64 overflow-y-auto font-serif">
                  {currentPrompt.passage}
                </div>
              )}
            </div>
          </section>

          {/* Answer Section */}
          <section className="space-y-6">
            {activeSection === 'reading' ? (
              <div className="grid gap-4">
                {currentPrompt.questions?.map((q, idx) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-3">
                      <p className="font-medium text-slate-800">{q.text}</p>
                      <input 
                        type="text"
                        value={readingAnswers[q.id] || ''}
                        onChange={(e) => setReadingAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative">
                <textarea 
                  value={answers[currentPrompt.id] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentPrompt.id]: e.target.value }))}
                  placeholder={activeSection === 'speaking' ? "Simulate your spoken response here..." : "Type your essay response here..."}
                  className="w-full h-80 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all resize-none text-lg leading-relaxed"
                />
                <div className="absolute bottom-6 right-8 text-sm font-medium text-slate-400">
                  {(answers[currentPrompt.id] || '').trim().split(/\s+/).filter(w => w.length > 0).length} words
                </div>
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-[#003366] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#003366]/20 hover:bg-[#002244] transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit for Evaluation
                </>
              )}
            </button>
          </section>

          {/* Feedback Section */}
          <AnimatePresence>
            {feedback && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-12"
              >
                <div className="bg-[#003366] px-8 py-6 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">Evaluation Results</h3>
                    <p className="text-white/70 text-sm">Based on IELTS Academic criteria</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black">{feedback.score.toFixed(1)}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Band Score</div>
                  </div>
                </div>
                
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Key Suggestions
                    </h4>
                    <ul className="space-y-3">
                      {feedback.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                          <span className="text-emerald-500 font-bold">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-[#003366]" />
                      Improvement Tips
                    </h4>
                    <div className="space-y-4 text-sm text-slate-600">
                      <p>
                        <strong>Lexical Resource:</strong> Try to use more synonyms to avoid repetition. Instead of "good", use "beneficial", "advantageous", or "favorable".
                      </p>
                      <p>
                        <strong>Grammatical Range:</strong> Incorporate complex sentence structures like relative clauses and conditional sentences (e.g., "If governments invested more...").
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-[#003366] text-white shadow-md shadow-[#003366]/20' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-[#003366]'} transition-colors`}>
        {icon}
      </span>
      <span className="font-semibold text-sm">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-pill"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
        />
      )}
    </button>
  );
}
