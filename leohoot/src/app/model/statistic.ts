import { Player } from './player';
import { QuestionTeacher } from './question-teacher';

export interface Statistic {
    quizName: string;
    topThreePlayers: Player[];
    questionAnswers: { [key: number]: boolean[] };
    questionTexts: string[];
    playerCount: number;
}
