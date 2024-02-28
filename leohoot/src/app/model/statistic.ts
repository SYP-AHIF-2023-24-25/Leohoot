import { Player } from './player';
import { Question } from './question';

export interface Statistic {
    quizName: string;
    topThreePlayers: Player[];
    questionAnswers: { [key: number]: boolean[] };
    questionTexts: Question[];
    playerCount: number;
}