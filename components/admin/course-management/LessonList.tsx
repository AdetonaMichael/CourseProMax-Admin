import React, { useState } from 'react';
import { VideoEditor } from './VideoEditor';
import { QuizEditor } from './QuizEditor';
import { Video, HelpCircle, Trash2 } from 'lucide-react';
import { useConfirmation } from '@/components/shared/ConfirmationDialog';

interface Lesson {
  id: number;
  title: string;
  description: string;
  order: number;
  estimated_duration_minutes: number;
  difficulty: string;
  is_active: boolean;
  is_preview: boolean;
}

export const LessonList = ({ 
  lessons = [], 
  courseId,
  hideAddButton 
}: { 
  lessons?: Lesson[];
  courseId?: number;
  hideAddButton?: boolean;
}) => {
  const { confirm } = useConfirmation()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);

  const handleAddVideo = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowVideoEditor(true);
  };

  const handleAddQuiz = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowQuizEditor(true);
  };

  const handleDeleteLesson = async (lessonId: number) => {
    const confirmed = await confirm({
      title: 'Delete Lesson',
      description: 'Are you sure you want to delete this lesson? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDangerous: true,
    })

    if (confirmed) {
      console.log('Delete lesson:', lessonId);
    }
  };

  if (!lessons || lessons.length === 0) {
    return (
      <div className="lesson-list bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-600 text-center">No lessons available.</p>
      </div>
    );
  }

  return (
    <div className="lesson-list">
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition"
          >
            {/* Lesson Order Badge */}
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-lg font-bold text-gray-700 flex-shrink-0">
              {lesson.order}
            </div>

            {/* Lesson Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-black text-sm mb-1">{lesson.title}</h4>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700 font-semibold">
                  {lesson.estimated_duration_minutes}m
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold border ${
                    lesson.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : lesson.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}
                >
                  {lesson.difficulty}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    lesson.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {lesson.is_active ? 'Active' : 'Inactive'}
                </span>
                {lesson.is_preview && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                    Preview
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleAddVideo(lesson)}
                className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-xs font-semibold"
                title="Add Video"
              >
                <Video size={14} />
                <span className="hidden sm:inline">Video</span>
              </button>
              <button
                onClick={() => handleAddQuiz(lesson)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition text-xs font-semibold"
                title="Add Quiz"
              >
                <HelpCircle size={14} />
                <span className="hidden sm:inline">Quiz</span>
              </button>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-400 text-black rounded hover:bg-gray-500 transition text-xs font-semibold"
                title="Delete Lesson"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Editor Modal */}
      {showVideoEditor && selectedLesson && courseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8 p-0 shadow-2xl">
            <VideoEditor
              courseId={courseId}
              lessonId={selectedLesson.id}
              onClose={() => {
                setShowVideoEditor(false);
                setSelectedLesson(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Quiz Editor Modal */}
      {showQuizEditor && selectedLesson && courseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl">
            <QuizEditor
              courseId={courseId}
              lessonId={selectedLesson.id}
              lesson={selectedLesson}
              onClose={() => {
                setShowQuizEditor(false);
                setSelectedLesson(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
