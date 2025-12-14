import { useEffect, useRef, useState } from "react";
import { useChatlog } from "./useChatlog";
import {
  startLessonAI,
  EndLessonAI,
  fetchAIStream,
} from "../services/api/AI.services";
import { speak } from "../services/api/speak.services";

export function useAILesson({
  userId,
  lesson,
  type
}: {
  userId?: string;
  lesson?: any;
  type: string;
}) {
  const { data: messages = [], appendMessage, patchLastAIMessage } =
    useChatlog(userId, lesson?._id);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [lessonEnded, setLessonEnded] = useState(false);
  const [content, setContent] = useState("");
  const [stepId, setStepId] = useState(0);

  const startedRef = useRef(false);
  const sendingRef = useRef(false);
  const mountedRef = useRef(true);

  /* cleanup */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ---------- START ---------- */
  const startLesson = async (retry = 2) => {
    if (!userId || !lesson?._id || startedRef.current) return;

    startedRef.current = true;
    setLoading(true);

    try {
      const d: any = await startLessonAI(userId, lesson._id, type);
      if (!mountedRef.current) return;
      setContent(lesson.readingpassage);
      setStepId(Number(d.stepId));
      appendMessage({ from: "system", text: d.firstQuestion });
      speak(d.firstQuestion);

    } catch (err) {
      startedRef.current = false;

      if (retry > 0) return startLesson(retry - 1);

      appendMessage({
        from: "system",
        text: "⚠️ Không thể khởi động bài học."
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SEND ---------- */
  const sendMessage = async (text: string) => {
    if (!userId || !lesson?._id) return;
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    const nextStepId = Number(stepId) + 1;
    setStepId(nextStepId);
    appendMessage({ from: "user", text });
    appendMessage({ from: "system", text: "", loading: true });
    let fullText = "";
    fetchAIStream(
      { userId, lessonId: lesson._id, userSpeechText: text, stepId: nextStepId },
      parsed => {
        if (!mountedRef.current) return;
        if (parsed.delta) {
          fullText += parsed.delta;
          patchLastAIMessage(parsed.delta);
        }
      },
      () => {
        if (fullText) speak(fullText);
        sendingRef.current = false;
        setSending(false);
      },
      () => {
        setLessonEnded(true);
        sendingRef.current = false;
        setSending(false);
      }
    );
  };

  /* ---------- END ---------- */
  const finishLesson = async () => {
    if (!userId || !lesson?._id) return;
    await EndLessonAI(userId, lesson._id);
  };

  return {
    messages,
    loading,
    sending,
    lessonEnded,
    content,
    startLesson,
    sendMessage,
    finishLesson
  };
}
