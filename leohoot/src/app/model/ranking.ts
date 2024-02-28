import { Player } from './player';

export interface Ranking{
    players: Player[];
    questionNumber: number;
    quizLength: number;
}