import { Question } from "./question";

export class DemoQuiz {
  private _title: string;
  private _description: string;
  private _questions: Question[];
  private _creator: string;

  //TODO: tags

  constructor(title: string, description: string, questions: Question[], creator: string) {
    this._title = title;
    this._description = description;
    this._questions = questions;
    this._creator = creator;
  }

  //TODO: get set
  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get creator(): string {
    return this._creator;
  }

  get questions(): Question[] {
    return this._questions;
  }
}
