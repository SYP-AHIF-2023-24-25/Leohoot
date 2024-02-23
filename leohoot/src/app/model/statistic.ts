import { Player } from './player';
import { Question } from './question';

export interface Statistic {
    quizName: string;
    topThreePlayers: Player[];
    questionAnswers: Map<number, boolean[]>;
    questions: Question[];
}