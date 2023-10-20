import { Answer } from './answer';

export class Question {
  private _question: string;
  private _answerTimeInSeconds: number; //in seconds
  private _answers: Answer[];
  private _imageName?: string;

  constructor(
    question: string,
    answerTimeInSeconds: number,
    answers: Answer[],
    imageName?: string,
  ) {
    this._question = question;
    this._answerTimeInSeconds = answerTimeInSeconds;
    this._answers = answers;
    if (imageName) {
      this._imageName = imageName;
    }
  }

  get question(): string {
    return this._question;
  }

  get answerTimeInSeconds(): number {
    return this._answerTimeInSeconds;
  }

  get answers(): Answer[] {
    return this._answers;
  }

  get imageName(): string | undefined {
    return this._imageName;
  }
}
