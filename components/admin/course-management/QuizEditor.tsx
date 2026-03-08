import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { getStoredToken } from '@/utils/storage.utils';
import { useAlert } from '@/hooks/useAlert';

interface Question {
  id: number;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: string | boolean;
  explanation: string;
  points: number;
}

interface LessonData {
  id: number;
  title: string;
  description: string;
  order: number;
  estimated_duration_minutes: number;
  difficulty: string;
  is_active: boolean;
}

export const QuizEditor = ({ courseId, lessonId, lesson, onClose }: { courseId: number; lessonId: number; lesson?: LessonData; onClose: () => void }) => {
  const alert = useAlert();
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(30);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      points: 10,
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id), 0) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        points: 10,
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.type === 'multiple_choice') {
          const newOptions = [...(q.options as string[])];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (questions.some((q) => !q.question.trim())) {
      setError('All questions must have text');
      return;
    }

    if (questions.some((q) => q.type === 'multiple_choice' && q.options.some((o) => !o.trim()))) {
      setError('All options must have text');
      return;
    }

    // Validate correct answer - must handle both string (multiple choice) and boolean (true/false)
    if (questions.some((q) => {
      if (q.type === 'true_false') {
        // For true/false, correct_answer must be a boolean (true or false)
        return typeof q.correct_answer !== 'boolean';
      }
      // For multiple choice, correct_answer must be a non-empty string
      return !q.correct_answer || q.correct_answer === '';
    })) {
      setError('All questions must have a correct answer selected');
      return;
    }

    try {
      setSaving(true);
      const token = getStoredToken();
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const response = await fetch(
        API_ENDPOINTS.ADMIN.LESSON_DETAIL(courseId, lessonId),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'quiz',
            title: lesson?.title || 'Quiz',
            description: lesson?.description || '',
            order: lesson?.order || 1,
            is_active: lesson?.is_active ?? true,
            estimated_duration_minutes: lesson?.estimated_duration_minutes || timeLimitMinutes,
            difficulty: lesson?.difficulty || 'intermediate',
            completion_score_required: passingScore,
            quiz_data: {
              total_questions: questions.length,
              passing_score: passingScore,
              time_limit_minutes: timeLimitMinutes,
              shuffle_questions: shuffleQuestions,
              show_feedback: showCorrectAnswers,
            },
            metadata: {
              questions: questions.map((q) => {
                // For multiple choice, convert correct_answer text to index
                let correctAnswer: string | boolean | number = q.correct_answer;
                if (q.type === 'multiple_choice') {
                  // Find the index of the correct answer in options
                  const index = q.options.indexOf(q.correct_answer as string);
                  correctAnswer = index >= 0 ? index : 0;
                }
                
                return {
                  id: q.id,
                  question: q.question,
                  type: q.type === 'multiple_choice' ? 'multiple-choice' : 'true-false',
                  ...(q.type === 'multiple_choice' && { options: q.options }),
                  correct_answer: correctAnswer,
                  explanation: q.explanation,
                  difficulty: lesson?.difficulty || 'intermediate',
                };
              }),
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save quiz');
      }

      alert.success('Quiz added successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error saving quiz:', error);
      setError(error.message || 'Error saving quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="quiz-editor">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">Add Quiz to Lesson</h2>
          <p className="text-xs text-gray-600 mt-1">Create questions and set quiz parameters</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={24} className="text-gray-600" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(90vh-120px)]" style={{ overscrollBehavior: 'contain' }}>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 px-6 pt-6">
        {/* Quiz Settings */}
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-black mb-4">Quiz Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Passing Score (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                min="1"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-900">Shuffle questions</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showCorrectAnswers}
                onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-900">Show correct answers after submission</span>
            </label>
          </div>
        </div>

        {/* Questions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">Questions</h3>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
            >
              <Plus size={18} />
              Add Question
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, questionIndex) => (
              <div key={question.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold text-black">Question {questionIndex + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {/* Question Text */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Question</label>
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    rows={2}
                    placeholder="Enter your question"
                  />
                </div>

                {/* Question Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Question Type</label>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>

                {/* Options / Answer */}
                {question.type === 'multiple_choice' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Options</label>
                    <div className="space-y-2">
                      {question.options.map((option, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, idx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                            placeholder={`Option ${idx + 1}`}
                          />
                          <label className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correct_answer === option}
                              onChange={() => updateQuestion(question.id, 'correct_answer', option)}
                            />
                            <span className="text-sm font-medium text-gray-900">Correct</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Correct Answer</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correct_answer === true}
                          onChange={() => updateQuestion(question.id, 'correct_answer', true)}
                        />
                        <span className="font-medium text-gray-900">True</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correct_answer === false}
                          onChange={() => updateQuestion(question.id, 'correct_answer', false)}
                        />
                        <span className="font-medium text-gray-900">False</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">Explanation</label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    rows={2}
                    placeholder="Provide an explanation for the correct answer"
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Points</label>
                  <input
                    type="number"
                    min="1"
                    value={question.points}
                    onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 pb-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};
