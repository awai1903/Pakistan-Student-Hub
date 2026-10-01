import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Brain,
  SlidersHorizontal
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdSlot } from '../components/ads/AdSlot';
import { sampleQuizQuestions, QuizQuestion } from '../data/quizData';

interface QuizViewProps {
  onNavigateTab: (tab: string, slug?: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigateTab }) => {
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  
  // Quiz progress states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Filtered pool of questions
  const questions = useMemo(() => {
    return sampleQuizQuestions.filter((q) => {
      if (selectedTest !== 'all' && q.test !== selectedTest) return false;
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      return true;
    });
  }, [selectedTest, selectedSubject]);

  const currentQ: QuizQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined && mode === 'practice') return;
    
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));

    if (mode === 'practice') {
      setRevealedExplanations((prev) => ({
        ...prev,
        [currentIndex]: true
      }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setRevealedExplanations({});
    setCurrentIndex(0);
    setQuizFinished(false);
  };

  // Score statistics
  const scoreStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans !== undefined) {
        attempted += 1;
        if (ans === q.correctIndex) {
          correct += 1;
        } else {
          wrong += 1;
        }
      }
    });

    const total = questions.length;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    // ECAT negative marking: +4 for correct, -1 for wrong
    const ecatScore = correct * 4 - wrong * 1;
    // MDCAT: +1 for correct, 0 for wrong
    const mdcatScore = correct;

    return {
      correct,
      wrong,
      unattempted: total - attempted,
      total,
      accuracy,
      ecatScore,
      mdcatScore
    };
  }, [questions, selectedAnswers]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', onClick: () => onNavigateTab('home') },
            { label: 'Entry Test Past Papers & MCQs Quiz' }
          ]}
        />
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <Brain className="h-3.5 w-3.5" />
              MDCAT & ECAT Interactive Practice
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Entry Test Past Papers & Interactive MCQs Quiz
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Solve verified past paper questions from <strong>PMC/UHS MDCAT</strong>, <strong>UET ECAT</strong>, and <strong>NUST NET</strong> with authentic step-by-step conceptual explanations and negative marking analysis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restart Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Test and Mode Selectors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Test Selector */}
          <div className="md:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Examination Target:
            </label>
            <div className="flex rounded-lg border border-slate-300 bg-slate-50 p-1">
              {['all', 'MDCAT', 'ECAT', 'NET (NUST)'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTest(t);
                    handleResetQuiz();
                  }}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                    selectedTest === t
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'all' ? 'All Tests' : t}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Selector */}
          <div className="md:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Filter by Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                handleResetQuiz();
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
            >
              <option value="all">All Subjects</option>
              <option value="Biology">Biology (MDCAT)</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics (ECAT/NET)</option>
              <option value="English & Intelligence">English & Intelligence</option>
            </select>
          </div>

          {/* Practice vs Timed Exam Mode */}
          <div className="md:col-span-4">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quiz Mode:
            </label>
            <div className="flex rounded-lg border border-slate-300 bg-slate-50 p-1">
              <button
                onClick={() => setMode('practice')}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                  mode === 'practice'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                💡 Practice (Instant Answer)
              </button>
              <button
                onClick={() => setMode('exam')}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                  mode === 'exam'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏱️ Exam Simulation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      {questions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No questions found for the selected combination</h3>
          <p className="text-xs text-slate-500">Try choosing &quot;All Tests&quot; or &quot;All Subjects&quot; to practice our complete question bank.</p>
        </div>
      ) : quizFinished ? (
        /* Result Summary Card */
        <div className="rounded-2xl border-2 border-emerald-600 bg-white p-8 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto">
            <Award className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h2>
            <p className="text-xs text-slate-500">Here is your performance summary based on Pakistani admission test standards:</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
              <div className="text-xs text-emerald-800 font-semibold">Correct</div>
              <div className="text-2xl font-black text-emerald-950 tabular-nums">{scoreStats.correct}</div>
            </div>
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5">
              <div className="text-xs text-rose-800 font-semibold">Wrong</div>
              <div className="text-2xl font-black text-rose-950 tabular-nums">{scoreStats.wrong}</div>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
              <div className="text-xs text-slate-600 font-semibold">Accuracy</div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{scoreStats.accuracy.toFixed(1)}%</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>National Test Scoring Equivalent:</span>
              <span className="text-emerald-800 font-extrabold">{scoreStats.correct} / {scoreStats.total} Questions</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              In UET ECAT marking (+4 / -1 negative mark), your simulated score would be <strong>{scoreStats.ecatScore}</strong>. In PMDC MDCAT (+1 / 0), your score is <strong>{scoreStats.mdcatScore}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetQuiz}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              Practice Again
            </button>
            <button
              onClick={() => onNavigateTab('calculator')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Calculate Merit Aggregate →
            </button>
          </div>
        </div>
      ) : (
        /* Active Question Card */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                {currentQ.test} • {currentQ.subject}
              </span>
              {currentQ.year && (
                <span className="text-slate-500 font-medium">({currentQ.year})</span>
              )}
            </div>
            <div className="font-semibold text-slate-700 tabular-nums">
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Topic: {currentQ.topic}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const userSelected = selectedAnswers[currentIndex] === oIdx;
              const isCorrectOption = oIdx === currentQ.correctIndex;
              const hasAnswered = selectedAnswers[currentIndex] !== undefined;

              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

              if (hasAnswered && (mode === 'practice' || revealedExplanations[currentIndex])) {
                if (isCorrectOption) {
                  optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600';
                } else if (userSelected && !isCorrectOption) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500';
                }
              } else if (userSelected) {
                optionStyle = 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-medium';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasAnswered && (mode === 'practice' || revealedExplanations[currentIndex]) && (
                    <div>
                      {isCorrectOption ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : userSelected ? (
                        <XCircle className="h-5 w-5 text-rose-600" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible in Practice mode after answer, or on demand) */}
          {(mode === 'practice' || revealedExplanations[currentIndex]) && selectedAnswers[currentIndex] !== undefined && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-1.5 text-xs text-emerald-950 animate-in fade-in">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                <span>Concept & Solution Explanation:</span>
              </div>
              <p className="leading-relaxed text-emerald-900/90">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-800 text-xs font-bold text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish & View Score' : 'Next Question'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Entry Test Prep Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('entry-tests')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-left transition-colors group shadow-xs"
        >
          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
            Verified Test Schedules
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Registration deadlines and official test dates for MDCAT, ECAT, NET, and GAT.
          </p>
        </button>
        <button
          onClick={() => onNavigateTab('calculator')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-left transition-colors group shadow-xs"
        >
          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
            Merit Aggregate Calculator
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Calculate your combined aggregate with Matric, FSc, and your test score.
          </p>
        </button>
        <button
          onClick={() => onNavigateTab('resources')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 text-left transition-colors group shadow-xs"
        >
          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
            Download Past Papers PDF
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Official past papers and syllabus PDFs with solved answer keys.
          </p>
        </button>
      </div>

      <div className="pt-2">
        <AdSlot placement="footer" />
      </div>
    </div>
  );
};
