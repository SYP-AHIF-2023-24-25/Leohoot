export interface StatisticDetails {
  quizName: string,
  users: StatisticUser[]
}

export interface StatisticUser {
  username: string,
  isOpen: boolean,
  questions: StatisticQuestion[],
  correctAnswers: number,
  quizLength: number
}

export interface StatisticQuestion {
  questionText: string,
  answers: StatisticAnswer[]
}

export interface StatisticAnswer {
  answerText: string,
  isTicked: boolean,
  isCorrect: boolean
}
