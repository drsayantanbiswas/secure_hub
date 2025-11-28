"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Flame,
  Gamepad2,
  GraduationCap,
  Trophy,
  CheckCircle,
  XCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { lessons, quizQuestions, badges } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const ModeCard = ({ icon: Icon, title, description, cta, onSelect }) => (
  <Card className="flex flex-col hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center gap-4">
      <Icon className="h-10 w-10 text-primary" />
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      {/* Additional content could go here */}
    </CardContent>
    <div className="p-6 pt-0">
      <Button className="w-full" onClick={onSelect}>
        {cta}
      </Button>
    </div>
  </Card>
);

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState("quiz");
  const videoPlaceholder = PlaceHolderImages.find(p => p.id === 'video-placeholder');

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSubmit = () => {
      if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
          setScore(s => s + 1);
      }
      setShowResult(true);
  };
  
  const handleNextQuestion = () => {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(i => i + 1);
      } else {
          // End of quiz
          alert(`Quiz finished! Your score: ${score}/${quizQuestions.length}`);
          setCurrentQuestionIndex(0);
          setScore(0);
      }
  };

  // Learn state
  const [activeLesson, setActiveLesson] = useState(lessons[1]);
  const [completedLessons, setCompletedLessons] = useState([2]);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="h-10 w-10 text-accent" />
          SecurityQuiz
        </h1>
        <Card className="max-w-4xl mx-auto bg-card/80">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-2xl font-bold">1,250 XP</p>
            </div>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Level 5</p>
                 <Progress value={75} className="h-3 my-1" />
                <p className="text-xs text-muted-foreground">75% to Level 6</p>
            </div>
            <div className="text-center md:text-right">
                <p className="text-sm text-muted-foreground">Badges</p>
                <p className="text-2xl font-bold">🏆 8</p>
            </div>
          </CardContent>
        </Card>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 md:grid-cols-4 h-auto md:h-10">
          <TabsTrigger value="learn">📚 Learn</TabsTrigger>
          <TabsTrigger value="quiz">🎯 Quiz</TabsTrigger>
          <TabsTrigger value="badges">🏆 Badges</TabsTrigger>
          <TabsTrigger value="challenge">🔥 Challenge</TabsTrigger>
        </TabsList>
        
        <div className="mt-8 max-w-5xl mx-auto">
            <TabsContent value="learn">
                <Card>
                    <CardHeader>
                        <CardTitle>Learn Security Concepts</CardTitle>
                        <CardDescription>Select a topic to start learning and earn XP.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 space-y-2">
                           {lessons.map(lesson => (
                               <Button key={lesson.id} variant={activeLesson.id === lesson.id ? 'secondary' : 'ghost'} className="w-full justify-start gap-2" onClick={() => setActiveLesson(lesson)}>
                                   {completedLessons.includes(lesson.id) ? <CheckCircle className="h-4 w-4 text-green-500" /> : <BookOpen className="h-4 w-4 text-muted-foreground"/>}
                                   {lesson.title}
                               </Button>
                           ))}
                        </div>
                        <div className="md:col-span-2">
                            <Card className="p-6">
                               <h3 className="text-2xl font-bold mb-4">{activeLesson.content.title}</h3>
                               {activeLesson.content.sections.map(section => (
                                   <div key={section.heading} className="mb-6">
                                       <h4 className="text-lg font-semibold mb-2">{section.heading}</h4>
                                       {section.text && <p className="text-muted-foreground mb-3">{section.text}</p>}
                                       {section.points && <ul className="space-y-2 list-disc pl-5 text-muted-foreground">{section.points.map(p => <li key={p}>{p}</li>)}</ul>}
                                       {section.list && <ul className="space-y-2">{section.list.map(p => <li key={p} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary mt-1 shrink-0"/>{p}</li>)}</ul>}
                                   </div>
                               ))}
                               <div className="mt-4">
                                {videoPlaceholder && <Image src={videoPlaceholder.imageUrl} alt="Video placeholder" width={560} height={315} data-ai-hint={videoPlaceholder.imageHint} className="rounded-lg w-full"/>}
                               </div>
                               <div className="flex justify-between mt-6">
                                <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" /> Prev</Button>
                                <Button>Next <ChevronRight className="ml-2 h-4 w-4" /></Button>
                               </div>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="quiz">
                <Card>
                    <CardHeader>
                        <CardTitle>Quiz Mode</CardTitle>
                        <CardDescription>Question {currentQuestionIndex + 1} of {quizQuestions.length}</CardDescription>
                        <Progress value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} />
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-xl font-semibold mb-6 text-center">{quizQuestions[currentQuestionIndex].question}</h3>
                        <RadioGroup value={selectedAnswer ?? ""} onValueChange={setSelectedAnswer} className="space-y-4" disabled={showResult}>
                            {quizQuestions[currentQuestionIndex].options.map(option => {
                                const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;
                                const isSelected = selectedAnswer === option;
                                const resultClass = showResult ? (isCorrect ? 'bg-green-100 dark:bg-green-900 border-green-500' : (isSelected ? 'bg-red-100 dark:bg-red-900 border-red-500' : '')) : '';

                                return (
                                    <Label key={option} htmlFor={option} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${resultClass}`}>
                                        <RadioGroupItem value={option} id={option} />
                                        <span>{option}</span>
                                        {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />}
                                        {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500 ml-auto" />}
                                    </Label>
                                )
                            })}
                        </RadioGroup>
                    </CardContent>
                    <div className="p-6 pt-0 flex justify-end">
                        {showResult ? (
                            <Button onClick={handleNextQuestion} className="w-full md:w-auto">
                                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            </Button>
                        ) : (
                            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer} className="w-full md:w-auto">Submit Answer</Button>
                        )}
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="badges">
                <Card>
                    <CardHeader>
                        <CardTitle>Badges & Achievements</CardTitle>
                        <CardDescription>You have unlocked {badges.filter(b => b.unlocked).length} out of {badges.length} badges.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {badges.map(badge => (
                            <Card key={badge.id} className={`p-4 text-center ${badge.unlocked ? '' : 'opacity-50 bg-secondary'}`}>
                                <Trophy className={`h-12 w-12 mx-auto ${badge.unlocked ? 'text-yellow-500' : 'text-muted-foreground'}`}/>
                                <p className="font-bold mt-2">{badge.name}</p>
                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                                {!badge.unlocked && badge.progress && <Badge variant="outline" className="mt-2">{badge.progress}</Badge>}
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="challenge">
                 <Card className="bg-gradient-to-br from-accent/20 to-background">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Flame /> Today's Challenge</CardTitle>
                        <CardDescription>Expires in 18h 32m</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-xl font-semibold">Create a password with a strength score &gt; 85.</p>
                        <div>Reward: <Badge>+50 XP</Badge> + <Badge variant="destructive">"Speed Secure" Badge</Badge></div>
                        <div>
                            <p className="text-sm font-medium">Status: IN PROGRESS</p>
                            <p className="text-xs text-muted-foreground">Your best so far: 82/100</p>
                        </div>
                         <Button asChild>
                            <a href="/passlock">Go to PassLock <ChevronRight className="h-4 w-4 ml-2"/></a>
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
