"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lessonService } from "@/services/lesson.service";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Lesson, LessonType } from "@/types";

export default function LessonManagement({ params }: { params: { id: string } }) {
  const courseId = params.id;
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", description: "", type: "video" as LessonType });

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const data = await lessonService.getLessonsByCourse(parseInt(courseId));
        setLessons(data);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleAddLesson = async () => {
    setLoading(true);
    try {
      const addedLesson = await lessonService.createLesson(parseInt(courseId), newLesson);
      setLessons((prev) => [...prev, addedLesson]);
      setNewLesson({ title: "", description: "", type: "video" });
    } catch (error) {
      console.error("Failed to add lesson", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Manage Lessons</h1>

      <div>
        <h2>Add New Lesson</h2>
        <Input
          placeholder="Lesson Title"
          value={newLesson.title}
          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
        />
        <Input
          placeholder="Lesson Description"
          value={newLesson.description}
          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
        />
        <select
          value={newLesson.type}
          onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value as LessonType })}
          style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
        >
          <option value="video">Video</option>
          <option value="reading">Reading</option>
          <option value="quiz">Quiz</option>
          <option value="assignment">Assignment</option>
          <option value="interactive">Interactive</option>
          <option value="mixed">Mixed</option>
          <option value="resource">Resource</option>
        </select>
        <Button onClick={handleAddLesson} isLoading={loading}>
          Add Lesson
        </Button>
      </div>

      <div>
        <h2>Lessons</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id}>{lesson.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}