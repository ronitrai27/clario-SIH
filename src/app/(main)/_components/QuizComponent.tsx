"use client";

import { useState } from "react";
import { quizData, QuizSection } from "./QuizData";
import { useUserData } from "@/context/UserDataProvider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function Quiz() {
  const { user } = useUserData();
  const current_status = user?.current_status;
  const mainFocus = user?.mainFocus;
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<
    Record<string, Record<number, string>>
  >({});

  if (!current_status || !mainFocus) {
    return <p>Loading user data...</p>;
  }

  const gradeKey = current_status.startsWith("10") ? "10" : "12";

  function getQuizSet(
    gradeKey: "10" | "12",
    current_status: string,
    mainFocus: string
  ): QuizSection | undefined {
    const block = quizData[gradeKey]?.[current_status] as Record<
      string,
      QuizSection
    >;
    return block?.[mainFocus];
  }

  const quizSet = getQuizSet(gradeKey, current_status, mainFocus);

  if (!quizSet) {
    return <p>No quiz available for this selection.</p>;
  }

  // flatten
  const sections = Object.entries(quizSet);
  const allQuestions = sections.flatMap(([sectionName, questions]) =>
    questions.map((q, idx) => ({
      section: sectionName,
      question: q,
      index: idx,
    }))
  );

  const currentQ = allQuestions[step];

  const saveAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.section]: {
        ...prev[currentQ.section],
        [currentQ.index]: value,
      },
    }));
  };

  const progressPercent = Math.round(((step + 1) / allQuestions.length) * 100);

  const progress = ((step + 1) / allQuestions.length) * 100;

  const handleSubmit = () => {
    // merge questions + answers
    const result = allQuestions.map((q) => ({
      section: q.section,
      question: q.question.question,
      answer: answers[q.section]?.[q.index] || "",
    }));

    console.log("Final Quiz Data:", JSON.stringify(result, null, 2));
  };

  //  Welcome screen before quiz starts
  if (!started) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Your Quiz</h2>
        <p className="text-gray-700">
          <span className="font-semibold">Current Status:</span>{" "}
          {current_status}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Main Focus:</span> {mainFocus}
        </p>
        <Button onClick={() => setStarted(true)} className="mt-4">
          Start Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-lg font-bold">
        Question {step + 1} of {allQuestions.length}
      </h2>

      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-500 text-right mt-1">{progressPercent}% completed</p>

      <p className="mt-4">{currentQ.question.question}</p>

      <p className="text-sm text-gray-500 italic">
        Section: {currentQ.section.replace("_", " ")}
      </p>

      {currentQ.question.options ? (
        <div className="flex flex-col gap-2">
          {currentQ.question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => saveAnswer(opt)}
              className={`px-4 py-2 rounded-lg ${
                answers[currentQ.section]?.[currentQ.index] === opt
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 hover:bg-blue-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="border p-2 rounded-lg w-full"
          placeholder="Type your answer..."
          value={answers[currentQ.section]?.[currentQ.index] || ""}
          onChange={(e) => saveAnswer(e.target.value)}
        />
      )}

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
        >
          Back
        </Button>

        {step < allQuestions.length - 1 ? (
          <Button
            onClick={() =>
              setStep((s) => Math.min(s + 1, allQuestions.length - 1))
            }
            disabled={!answers[currentQ.section]?.[currentQ.index]} // block next until answered
          >
            Next
          </Button>
        ) : (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setStarted(false);
              }}
            >
              Restart
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        )}
      </div>
    </div>
  );
}
