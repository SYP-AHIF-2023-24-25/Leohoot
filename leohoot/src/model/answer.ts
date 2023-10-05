export class Answer {
  private _answer: string;
  private _isCorrect: boolean;

  constructor(answer: string, isCorrect: boolean) {
    this._answer = answer;
    this._isCorrect = isCorrect;
  }

  get answer(): string {
    return this._answer;
  }

  set answer(answer: string) {
    this._answer = answer;
  }

  get isCorrect(): boolean {
    return this._isCorrect;
  }

  set isCorrect(isCorrect: boolean) {
    this._isCorrect = isCorrect;
  }
}
