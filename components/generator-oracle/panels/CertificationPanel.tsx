'use client';

/**
 * Technician Certification Panel
 * Multi-level certification system for generator technicians
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getCertificationService,
  CERTIFICATION_LEVELS,
  CERTIFICATION_EXAMS,
  CertificationLevel,
  CertificationExam,
  CertificationQuestion,
  TechnicianProfile,
  TechnicianCertification,
  getTimeRemaining,
  formatCertificationDate,
} from '@/lib/generator-oracle/certificationSystem';

type ViewMode = 'overview' | 'exam' | 'results' | 'profile';

export default function CertificationPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedLevel, setSelectedLevel] = useState<CertificationLevel | null>(null);
  const [currentExam, setCurrentExam] = useState<CertificationExam | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examStartTime, setExamStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0 });
  const [examResult, setExamResult] = useState<{
    passed: boolean;
    score: number;
    results: Array<{ questionId: string; correct: boolean; points: number }>;
  } | null>(null);

  const certService = getCertificationService();

  // Timer effect
  useEffect(() => {
    if (!currentExam || !examStartTime) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(currentExam.timeLimit, examStartTime);
      setTimeRemaining(remaining);

      if (remaining.minutes === 0 && remaining.seconds === 0) {
        handleSubmitExam();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentExam, examStartTime]);

  const handleStartExam = (level: CertificationLevel) => {
    const exam = certService.startExam(level);
    if (exam) {
      setCurrentExam(exam);
      setSelectedLevel(level);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setExamStartTime(new Date());
      setViewMode('exam');
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmitExam = () => {
    if (!currentExam) return;
    const result = certService.submitExam(currentExam, answers);
    setExamResult(result);
    setViewMode('results');
  };

  const handleRetakeExam = () => {
    if (selectedLevel) {
      handleStartExam(selectedLevel);
    }
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setCurrentExam(null);
    setExamResult(null);
    setSelectedLevel(null);
  };

  // Overview - Show certification levels
  if (viewMode === 'overview') {
    return (
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Technician Certification</h2>
            <p className="text-slate-400 mt-1">Validate your skills and unlock advanced features</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
        </div>

        {/* Certification Path */}
        <div className="grid gap-4">
          {(Object.entries(CERTIFICATION_LEVELS) as [CertificationLevel, typeof CERTIFICATION_LEVELS[CertificationLevel]][]).map(
            ([level, info], index) => {
              const exam = CERTIFICATION_EXAMS.find(e => e.level === level);
              const isLocked = index > 0; // In production, check actual certifications

              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    isLocked
                      ? 'bg-slate-800/30 border-slate-700 opacity-60'
                      : 'bg-slate-800/50 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${info.color}20` }}
                      >
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{info.name}</h3>
                        <p className="text-sm text-slate-400">
                          Pass score: {info.minimumScore}%
                          {exam && ` | ${exam.timeLimit} minutes | ${exam.questions.length} questions`}
                        </p>
                      </div>
                    </div>

                    {isLocked ? (
                      <div className="flex items-center gap-2 text-slate-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm">Locked</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartExam(level)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                      >
                        Start Exam
                      </button>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase mb-1">Requirements</p>
                      <ul className="space-y-1">
                        {info.requirements.slice(0, 2).map((req, i) => (
                          <li key={i} className="text-xs text-slate-400 flex items-start gap-1">
                            <span className="text-slate-600">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase mb-1">Benefits</p>
                      <ul className="space-y-1">
                        {info.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="text-xs text-green-400 flex items-start gap-1">
                            <span>✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="text-white font-semibold">Why Get Certified?</h4>
              <p className="text-sm text-slate-400 mt-1">
                Certified technicians get priority customer referrals, access to advanced tools,
                and recognition in our technician directory. Start with Bronze and work your way up!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Exam Mode
  if (viewMode === 'exam' && currentExam) {
    const currentQuestion = currentExam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentExam.questions.length) * 100;

    return (
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{currentExam.title}</h2>
            <p className="text-slate-400 text-sm">
              Question {currentQuestionIndex + 1} of {currentExam.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`px-4 py-2 rounded-lg ${
              timeRemaining.minutes < 5 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-white'
            }`}>
              <span className="font-mono text-lg">
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
            </div>
            <button
              onClick={handleBackToOverview}
              className="text-slate-400 hover:text-white text-sm"
            >
              Exit Exam
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-400">
              {currentQuestion.points} pts
            </span>
          </div>

          <h3 className="text-lg text-white font-medium mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                className={`w-full p-4 rounded-lg border text-left transition-all ${
                  answers[currentQuestion.id] === index
                    ? 'bg-cyan-500/20 border-cyan-500 text-white'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-slate-700 text-center mr-3 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {currentExam.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  idx === currentQuestionIndex
                    ? 'bg-cyan-500 text-white'
                    : answers[currentExam.questions[idx].id] !== undefined
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === currentExam.questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.min(currentExam.questions.length - 1, currentQuestionIndex + 1))
              }
              className="px-4 py-2 rounded-lg bg-cyan-500 text-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results
  if (viewMode === 'results' && examResult && currentExam) {
    const levelInfo = CERTIFICATION_LEVELS[currentExam.level];

    return (
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-6">
        <div className="text-center mb-8">
          {examResult.passed ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl"
                style={{ backgroundColor: `${levelInfo.color}30` }}
              >
                {levelInfo.icon}
              </motion.div>
              <h2 className="text-2xl font-bold text-green-400">Congratulations!</h2>
              <p className="text-slate-400 mt-2">
                You passed the {levelInfo.name} exam with {examResult.score}%
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center text-5xl"
              >
                📚
              </motion.div>
              <h2 className="text-2xl font-bold text-red-400">Not Quite</h2>
              <p className="text-slate-400 mt-2">
                You scored {examResult.score}%. You need {currentExam.passingScore}% to pass.
              </p>
            </>
          )}
        </div>

        {/* Score Breakdown */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Score Breakdown</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{examResult.score}%</p>
              <p className="text-sm text-slate-400">Your Score</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {examResult.results.filter(r => r.correct).length}
              </p>
              <p className="text-sm text-slate-400">Correct</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {examResult.results.filter(r => !r.correct).length}
              </p>
              <p className="text-sm text-slate-400">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Review Answers</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentExam.questions.map((q, idx) => {
              const result = examResult.results.find(r => r.questionId === q.id);
              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border ${
                    result?.correct
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-white">
                      {idx + 1}. {q.question.substring(0, 60)}...
                    </p>
                    <span className={result?.correct ? 'text-green-400' : 'text-red-400'}>
                      {result?.correct ? '✓' : '✗'}
                    </span>
                  </div>
                  {!result?.correct && (
                    <p className="text-xs text-slate-400 mt-1">
                      Correct: {q.options[q.correctAnswer]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleBackToOverview}
            className="flex-1 py-3 rounded-lg bg-slate-800 text-slate-300 font-medium"
          >
            Back to Certifications
          </button>
          {!examResult.passed && (
            <button
              onClick={handleRetakeExam}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
