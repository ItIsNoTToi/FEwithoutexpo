import { Progress } from "../models/progress";

export const getProgressStatus = (
  progress: Progress | null,
  lessonId?: string
) => {
  if (!progress || !progress.Listlesson || !lessonId) return null;

  const pg = progress.Listlesson.find(
    p =>
      String(p.lesson?._id || p.lesson) === String(lessonId)
  );

  return pg?.status || null;
};
