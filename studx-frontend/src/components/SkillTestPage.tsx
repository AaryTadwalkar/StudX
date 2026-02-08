import React, { useState, useEffect } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';
import { X, Clock, CheckCircle, AlertCircle, Trophy, ChevronRight, ChevronLeft } from 'lucide-react';
import { reactBeginnerTest, reactIntermediateTest, reactAdvancedTest, type SkillTest } from '../utils/testBanks';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

interface SkillTestPageProps {
  skillName: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  skillId?: string;
  onComplete: (result: { score: number; total: number; passed: boolean; badge: string }) => void;
  onCancel: () => void;
  onNavigate: (s: AppState) => void;
}

const SkillTestPage: React.FC<SkillTestPageProps> = ({ 
  skillName, 
  level, 
  skillId,
  onComplete, 
  onCancel,
  onNavigate 
}) => {
  const { user } = useAuth();
  
  // Get the appropriate test based on skill and level
  const getTest = (): SkillTest => {
    if (skillName.toLowerCase() === 'react') {
      if (level === 'beginner') return reactBeginnerTest;
      if (level === 'intermediate') return reactIntermediateTest;
      return reactAdvancedTest;
    }
    
    // Default fallback (you can add more skills here)
    return reactIntermediateTest;
  };

  const test = getTest();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1));
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60); // Convert to seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    test.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    const percentage = (finalScore / test.questions.length) * 100;
    const passed = percentage >= test.passingScore;

    // Determine badge based on score
    let badge = 'Self-Declared';
    if (percentage >= 95) badge = 'Master';
    else if (percentage >= 85) badge = 'Expert';
    else if (percentage >= test.passingScore) badge = 'Verified';

    setScore(finalScore);
    setShowResults(true);

    // Submit to backend if skillId exists
    if (skillId && user) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`${API_BASE}/skills/test-result`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            skillId,
            score: percentage,
            answers: selectedAnswers
          })
        });

        if (response.ok) {
          console.log('Test result submitted successfully');
        }
      } catch (error) {
        console.error('Failed to submit test result:', error);
      } finally {
        setIsSubmitting(false);
      }
    }

    // Call completion callback
    setTimeout(() => {
      onComplete({
        score: finalScore,
        total: test.questions.length,
        passed,
        badge
      });
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    const percentage = (score / test.questions.length) * 100;
    const passed = percentage >= test.passingScore;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 text-center animate-scale-up shadow-2xl">
          <div className={`w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center ${passed ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
            {passed ? <Trophy size={64} /> : <AlertCircle size={64} />}
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-4">
            {passed ? 'Congratulations! 🎉' : 'Keep Practicing!'}
          </h1>

          <p className="text-slate-600 text-lg mb-8">
            {passed 
              ? `You've passed the ${skillName} ${level} test!` 
              : `You scored ${percentage.toFixed(0)}%. You need ${test.passingScore}% to pass.`}
          </p>

          <div className="bg-slate-50 rounded-3xl p-8 mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Score</span>
              <span className="text-2xl font-black text-slate-900">{score} / {test.questions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Percentage</span>
              <span className={`text-2xl font-black ${passed ? 'text-emerald-600' : 'text-orange-600'}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Status</span>
              <span className={`px-4 py-2 rounded-full font-black text-sm ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                {passed ? 'PASSED ✓' : 'FAILED ✗'}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-8">
            {passed 
              ? 'Your skill has been verified and badge updated!'
              : 'Review the questions and try again when ready.'}
          </p>

          <button
            onClick={() => onNavigate('my-skills')}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl"
          >
            View My Skills
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 flex items-center justify-between border border-white/20">
          <div className="flex items-center gap-6">
            <div className="bg-blue-500/20 text-blue-300 px-5 py-2 rounded-xl text-sm font-black uppercase tracking-widest border border-blue-400/30">
              {skillName} - {level}
            </div>
            <div className="text-white/70 text-sm font-bold">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black ${timeRemaining < 60 ? 'bg-red-500/20 text-red-300 border border-red-400/30' : 'bg-white/10 text-white/70 border border-white/20'}`}>
              <Clock size={18} />
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={onCancel}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl animate-fade-in">
          <div className="mb-8">
            <div className="inline-block bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              {currentQuestion.difficulty}
            </div>
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4 mb-12">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-6 rounded-2xl text-left font-bold transition-all border-2 flex items-center gap-4 group ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1 text-slate-800">{option}</span>
                {selectedAnswers[currentQuestionIndex] === index && (
                  <CheckCircle className="text-blue-600" size={24} />
                )}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            <div className="flex gap-2">
              {test.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white shadow-lg'
                      : selectedAnswers[index] !== -1
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === test.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswers.some(a => a === -1) || isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'} <Trophy size={20} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>

          {/* Helper Text */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              <strong>Answered:</strong> {selectedAnswers.filter(a => a !== -1).length} / {test.questions.length} questions
              {selectedAnswers.some(a => a === -1) && (
                <span className="text-orange-600 ml-4">
                  • Please answer all questions before submitting
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-up { animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default SkillTestPage;
