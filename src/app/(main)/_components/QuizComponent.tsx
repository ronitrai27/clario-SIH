"use client";

import { useState } from "react";
import { quizData, QuizSection } from "./QuizData";
import { useUserData } from "@/context/UserDataProvider";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { LuArrowBigRight, LuArrowLeft, LuArrowRight } from "react-icons/lu";

export default function Quiz() {
  const { user } = useUserData();
  const current_status = user?.current_status;
  const mainFocus = user?.mainFocus;
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
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
    const block = (
      quizData[gradeKey] as Record<string, Record<string, QuizSection>>
    )[current_status];
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

  if (finished) {
    return (
      <div className="w-[600px] mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md text-center space-y-4">
        <div className="flex justify-center items-center bg-blue-100 w-12 h-12 rounded-full mx-auto">
          <Activity className="text-2xl text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold font-sora text-blue-500">
           Quiz Completed!
        </h2>
        <p className="text-gray-700 font-inter text-lg">
          Great job {user?.userName}! You’ve reached the end of the quiz.
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({});
              setStep(0);
              setStarted(false);
              setFinished(false);
            }}
          >
            Retake Quiz
          </Button>
          <Button className="bg-blue-500 text-white" onClick={handleSubmit}>
            Submit Quiz
          </Button>
        </div>
      </div>
    );
  }

  //  Welcome screen before quiz starts
  if (!started) {
    return (
      <div className="w-[600px] mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <Activity className="text-2xl text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold font-sora">Welcome to Your Quiz</h2>
        <p className="text-gray-700 font-inter text-xl text-center">
          Personalized assessment for your academic journey
        </p>
        <div className="my-6 bg-blue-50 border border-blue-500 rounded-lg shadow p-3">
          <p className="text-black font-inter text-lg">{user?.userName}</p>
          <p className="text-gray-700 mt-3 capitalize font-raleway">
            <span className="font-medium font-inter text-lg ">
              Current Status:
            </span>{" "}
            {current_status}
          </p>
          <p className="text-gray-700 mt-3 capitalize font-raleway">
            <span className="font-medium font-inter text-lg ">Main Focus:</span>{" "}
            {mainFocus}
          </p>
        </div>
        <Button
          onClick={() => setStarted(true)}
          className="mt-4 bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-lg font-medium"
        >
          Start Quiz <LuArrowBigRight className="inline ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[600px] mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-inter font-semibold">
          Question {step + 1} of {allQuestions.length}
        </h2>
        <p className="text-sm text-muted-foreground font-inter">
          {progressPercent}% completed
        </p>
      </div>

      <Progress value={progress} className="h-2 bg-blue-100" />

      <p className="mt-4 font-sora text-xl">{currentQ.question.question}</p>

      <p className="text-base font-inter  text-gray-500 italic">
        Section: {currentQ.section.replace("_", " ")}
      </p>

      {currentQ.question.options ? (
        <div className="flex flex-col gap-2">
          {currentQ.question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => saveAnswer(opt)}
              className={`px-4 py-2 rounded ${
                answers[currentQ.section]?.[currentQ.index] === opt
                  ? "bg-blue-500 border border-white text-white"
                  : "bg-gray-50 border border-gray-300 hover:bg-blue-100 hover:border-blue-500"
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
          <LuArrowLeft className="inline mr-2" /> Back
        </Button>

        {step < allQuestions.length - 1 ? (
          <Button
            onClick={() =>
              setStep((s) => Math.min(s + 1, allQuestions.length - 1))
            }
            disabled={!answers[currentQ.section]?.[currentQ.index]}
          >
            Next <LuArrowRight className="inline ml-2" />
          </Button>
        ) : (
          <Button
            className="bg-blue-500 cursor-pointer text-white"
            onClick={() => setFinished(true)} 
          >
            Finish <LuArrowRight className="inline ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
