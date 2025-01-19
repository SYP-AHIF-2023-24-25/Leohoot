import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { get } from 'jquery';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Mode } from 'src/app/model/mode';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Quiz } from 'src/app/model/quiz';
import { LoginService } from 'src/app/services/auth.service';
import { Tag } from 'src/app/model/tag';
import { NgxCaptureService } from 'ngx-capture';
import { QuizMakerSidebarComponent } from 'src/app/components/quiz-maker/quiz-maker-sidebar/quiz-maker-sidebar.component';
import { QuestionQuizmakerComponent } from 'src/app/components/quiz-maker/question-quizmaker/question-quizmaker.component';

interface ListItems {
  tag: Tag;
  checked: boolean;
}

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  quizId: number = -1;
  quiz: Quiz = {
    title: "",
    description: "",
    creator: this.loginService.getUserName(),
    questions: [],
    imageName: "",
    tags: []
  };

  username: string = "";
  editQuizDetails: boolean = true;
  loading: boolean = false;

  question: QuestionTeacher = {
    questionText: '',
    answerTimeInSeconds: 15,
    previewTime: 5,
    answers: [],
    questionNumber: 0,
    imageName: undefined,
    snapshot: undefined,
    showMultipleChoice: false
  };

  navQuestion: QuestionTeacher | undefined;
  @ViewChild(QuestionQuizmakerComponent) questionQuizmakerComponent: QuestionQuizmakerComponent | undefined;
  @ViewChild(QuizMakerSidebarComponent) sidebarComponent!: QuizMakerSidebarComponent;

  constructor(private router: Router, private route: ActivatedRoute, private configurationService: ConfigurationService, private restService: RestService, private loginService: LoginService,  private captureService: NgxCaptureService, private cdr: ChangeDetectorRef) {

  }


  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        await this.getQuiz()
      }
    })

    this.username = this.loginService.getUserName()
  }

  async getQuiz() {
    this.restService.getQuizById(this.quizId).subscribe(quiz => {
      console.log(quiz)
      quiz.questions.forEach(question => {
        const missingAnswersCount = 4 - question.answers.length;
        if (missingAnswersCount > 0) {
          for (let i = 0; i < missingAnswersCount; i++) {
            question.answers.push({ answerText: '', isCorrect: false });
          }
        }
      });
      this.quiz = quiz;
  });
}

  async close(){
    if (confirm("Are you sure you want to leave?")) {
      if (this.quizId === -1){
        confirm('Quiz not saved. All changes will be lost.');
        await this.router.navigate(['/dashboard']);
      }
      if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() 
      || this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() && this.question.questionText === '' //keine neue frage angelegt / halbfertige
        || this.editQuizDetails === true && this.quiz.title !== '' && this.quiz.description !== ''){
        this.saveQuiz();
        await this.router.navigate(['/dashboard']);
      }
    }
  }

  updateQuestion(updatedQuestion: QuestionTeacher) {
    this.question = updatedQuestion;
    console.log('Current question updated:', this.question);
  }


  saveQuiz() {
    this.quiz!.questions =  this.quiz!.questions.map(question => ({
      ...question,
      answers: question.answers.filter(answer => answer.answerText !== '')
    }));
    
    if (this.quizId === -1){
      this.restService.addQuiz(this.quiz!).subscribe(data => {
        this.quizId = data;
        this.route.params.subscribe(params => {
          this.router.navigate(['/quizMaker'], {queryParams: {quizId: this.quizId}});
        });
      });
    } else {
      this.restService.updateQuiz(this.quizId, this.quiz!).subscribe(data => {
       
      });
    }
  }

  changeEditMode(){
    if (this.editQuizDetails === false && this.validateQuestion() && this.question.questionNumber !== 0 ||this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() && this.question.questionText === ''){
      this.editQuizDetails = true;
      this.createQuestionSnapshot();
      this.restService.updateQuestion(this.quizId, this.question).subscribe(data => {
      });
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields.');
      return;
    } else if (this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() === false){
      alert('Please fill in all necessary fields and add the question first.');
      return;
    }
  }

  validateQuestion(): boolean {
    if (
      (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) &&
      this.question.answers.every(answer => answer.answerText === undefined || answer.answerText === '' || this.isWhitespaceString(answer.answerText))
    ) {
      return true;
    }

    if (this.question.questionText === undefined || this.question.questionText === '' || this.isWhitespaceString(this.question.questionText)) {
      return false;
    }

    for (let i = 0; i < 2; i++) {
      const answer = this.question.answers[i];
      if (answer.answerText === undefined || answer.answerText === '' || this.isWhitespaceString(answer.answerText)) {
        return false;
      }
    }
    
    return true;
  }

  initNewQuestion() {
    if (this.editQuizDetails){
      this.saveQuiz();
      this.editQuizDetails = !this.editQuizDetails;
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion()){
       this.quiz.questions.find(question => question.questionNumber === this.question.questionNumber) ? this.updateQuestion(this.question) : this.quiz.questions.push(this.question);
    } else if (this.editQuizDetails === false && this.question.questionNumber !== 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields.');
      return;
    } else if (this.editQuizDetails === false && this.question.questionNumber === 0 && this.validateQuestion() === false){
      alert('Please fill in all necessary fields and add the question first.');
      return;
    }

    this.question = {
      questionText: '',
      answerTimeInSeconds: 15,
      previewTime: 5,
      answers: [],
      questionNumber: 0,
      imageName: undefined,
      snapshot: undefined,
      showMultipleChoice: false
    };
    
    for (let i = 0; i < 4; i++) {
      this.question.answers.push({answerText: '', isCorrect: false});
    }
  }

  deleteQuestion(id: number){
    if (this.question.questionNumber === 0 && this.validateQuestion() == false){
      alert('Please fill in all necessary fields and add the question first before deleting another question.');
      return;
    }
      if (this.quiz.questions.length === 1 && this.quiz.questions[0].questionNumber === id) {
        this.quiz.questions = [];
        this.initNewQuestion();
      }

      this.quiz.questions = this.quiz.questions.filter(question => question.questionNumber !== id);
      this.quiz.questions.forEach((question, index) => {
        question.questionNumber = index + 1;
      });
      this.saveQuiz();

      if (this.quiz?.questions.length == 0){
        this.initNewQuestion();
      } else {
        let index = id > 2 ? id - 2 : 0;
        this.displayQuestion(index + 1);
      }
    }
  

  async displayQuestion(data: number | QuestionTeacher){
    if (typeof data === 'number') {
      const searchResult = this.quiz?.questions.find(question => question.questionNumber === data);
      if (!searchResult) {
        alert('Question not found');
        return
      }

      if (this.editQuizDetails || (this.question.questionNumber !== 0 && this.validateQuestion()) || (this.question.questionNumber === 0 && this.validateQuestion())){
        this.loading = true;
        await this.createQuestionSnapshot();
        this.question = searchResult;
        
        const missingAnswersCount = 4 - this.question.answers.length;
        if (missingAnswersCount > 0) {
          for (let i = 0; i < missingAnswersCount; i++) {
            this.question.answers.push({ answerText: '', isCorrect: false });
          }
        }

        if(this.editQuizDetails){
          this.editQuizDetails = false;
        }

        if (!this.questionQuizmakerComponent) {
          this.cdr.detectChanges();
          this.questionQuizmakerComponent = this.questionQuizmakerComponent || this.questionQuizmakerComponent;
        } 
        this.loading = false;
        this.questionQuizmakerComponent?.displayQuestion(data);
        
      } else if (this.question.questionNumber !== 0 && this.validateQuestion() == false){
        alert('Please fill in all necessary fields');
      } else if (this.question.questionNumber === 0 && this.validateQuestion() == false){
        alert('Please fill in all necessary fields and add the question first.');
      }
    } 
  }
  async createQuestionSnapshot() { 
    await this.questionQuizmakerComponent?.createQuestionSnapshot();
  }

  isWhitespaceString(str: string): boolean {
    return !str.trim();
  }

  // quizId: number | undefined;
  // existingQuestions: QuestionTeacher[] = [];
  // title: string = "";
  // description: string | undefined;
  // imageUrl: string | undefined;
  // selectedTags: Tag[] = [];
  // newTag: string = '';
  // tags: ListItems[] = [];
  // searchQuery = '';

  // constructor(
  //     private restService: RestService,
  //     private router: Router,
  //     private route: ActivatedRoute,
  //     private signalRService: SignalRService,
  //     private configurationService: ConfigurationService,
  //     private loginService: LoginService
  //   ) {
  //   this.getParams();
  //   this.refetchQuestions();

  //   this.description = this.configurationService.getQuiz().description;
  //   this.title = this.configurationService.getQuiz().title;
  //   this.imageUrl = this.configurationService.getQuiz().imageName;
  //   this.selectedTags = this.configurationService.getQuiz().tags;

  //   this.refreshTags();
  // }

  // getParams() {
  //   this.route.queryParams.subscribe(params => {
  //     if (typeof params['quizName'] !== 'undefined') {
  //       this.title = params['quizName'];
  //     }

  //     if (typeof params['quizId'] !== 'undefined') {
  //       this.quizId = Number.parseInt(params['quizId'])

  //       if (typeof params['edit'] !== undefined || typeof params['mode'] !== 'undefined') {
  //         if (params['edit'] === 'true' || params['mode'] === '0') {
  //           this.restService.getQuizById(this.quizId).subscribe(quiz => {
  //             console.log(quiz)
  //             quiz.questions.forEach(question => {
  //               const missingAnswersCount = 4 - question.answers.length;
  //               if (missingAnswersCount > 0) {
  //                 for (let i = 0; i < missingAnswersCount; i++) {
  //                   question.answers.push({ answerText: '', isCorrect: false });
  //                 }
  //               }
  //             });

  //            this.configurationService.setQuiz(quiz);

  //             this.title = this.configurationService.getQuiz().title;
  //             this.description = this.configurationService.getQuiz().description;
  //             this.existingQuestions = this.configurationService.getQuestions();

  //             this.imageUrl = this.configurationService.getQuiz().imageName;
  //             this.selectedTags = this.configurationService.getQuiz().tags;
  //           });
  //         }

  //       }
  //     }
  //   });
  // }

  // getImageFromServer(imageUrl: string) {
  //   this.imageUrl = this.restService.getImage(imageUrl);
  // }

  // onQuestionCreate() {
  //   const queryParams = {
  //     quizName: this.title,
  //     quizId: this.quizId
  //   };

  //   this.updateSelectedTags();

  //   this.configurationService.setQuizTitleDescriptionAndTags(this.title, this.description ? this.description : '', this.selectedTags);
  //   if (this.imageUrl){
  //     this.configurationService.addImage(this.imageUrl);
  //   }

  //   this.router.navigate(['/quizMakerQuestions'], { queryParams });
  // }

  // refetchQuestions() {
  //   this.existingQuestions = this.configurationService.getQuestions();
  //   console.log(this.existingQuestions)
  // }

  // saveQuiz() {
  //   this.updateSelectedTags();

  //   this.configurationService.setQuizTitleDescriptionAndTags(this.title, this.description ? this.description : '', this.selectedTags);
  //   const quiz = this.configurationService.getQuiz();

  //   quiz.questions =  quiz.questions.map(question => ({
  //     ...question,
  //     answers: question.answers.filter(answer => answer.answerText !== '')
  //   }));

  //   if (this.quizId === undefined){
  //     this.restService.addQuiz(quiz).subscribe(data => {
  //       this.quizId = data;
  //       alert('Quiz saved successfully.');
  //     });
  //   } else {
  //     this.restService.updateQuiz(this.quizId, quiz).subscribe(data => {
  //       console.log(data);
  //     });
  //     alert('Quiz updated successfully.');
  //   }
  // }

  // handleFileInput(event: any) {
  //   const files = event?.target?.files;
  //   if (files && files.length > 0) {
  //     const file = files.item(0);
  //     if (file && file.type.startsWith('image/')) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const imageString = e.target?.result as string;

  //         const extension = file.name.split('.').pop();
  //         const fileName = `quizImage.${extension}`;

  //         this.uploadImage(imageString, fileName).subscribe(data => {
  //           this.getImageFromServer(data);
  //         });
  //       };
  //       reader.readAsDataURL(file);
  //     } else {
  //       alert('Please select an image file.')
  //     }
  //   } else {
  //     alert('Please select an image file.')
  //   }
  // }

  // uploadImage(imageString: string, fileName: string) {
  //   const imageBlob = this.dataURItoBlob(imageString);

  //   const formData = new FormData();

  //   formData.append('image', imageBlob, fileName);

  //   return this.restService.addImage(formData);
  // }

  // dataURItoBlob(dataURI: string) {
  //   const byteString = window.atob(dataURI.split(',')[1]);
  //   const arrayBuffer = new ArrayBuffer(byteString.length);
  //   const int8Array = new Uint8Array(arrayBuffer);
  //   for (let i = 0; i < byteString.length; i++) {
  //     int8Array[i] = byteString.charCodeAt(i);
  //   }
  //   const blob = new Blob([int8Array], { type: 'image/jpeg' });
  //   return blob;
  // }

  // async onClose(){
  //   if (confirm("Are you sure you want to leave? All unsaved changes will be lost.")) {
  //     this.configurationService.clearQuiz();
  //     if (this.quizId) {
  //       await this.router.navigate(['/quizDetails'], {queryParams: {quizId: this.quizId}});
  //     } else {
  //       await this.router.navigate(['/quizOverview'])
  //     }
  //   }
  // }

  // onImageDelete(){
  //   this.imageUrl = undefined;
  // }

  // drop(event: CdkDragDrop<QuestionTeacher[]>) {
  //   moveItemInArray(this.existingQuestions, event.previousIndex, event.currentIndex);
  //   this.configurationService.changeOrderOfQuestions(this.existingQuestions);
  //   this.refetchQuestions();
  // }

  // truncateText(text: string, maxLength: number): string {
  //   return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  // }

  // onQuestionDelete(id: number) {
  //   this.configurationService.deleteQuestion(id);
  //   this.refetchQuestions();
  // }

  // onQuestionEdit(questionNumber: number | QuestionTeacher) {
  //   const queryParams = {
  //     quizName: this.title,
  //     questionNumber: questionNumber,
  //     quizId: this.quizId
  //   };

  //   this.updateSelectedTags();
  //   this.configurationService.setQuizTitleDescriptionAndTags(this.title, this.description ? this.description : '', this.selectedTags);

  //   this.router.navigate(['/quizMakerQuestions'], { queryParams });
  // }

  // playDemoView()
  // {
  //   this.restService.getNewGameId(this.quizId!).subscribe(data => {
  //     this.router.navigate(['/question'], { queryParams: { gameId: data , mode: Mode.TEACHER_DEMO_MODE, quizId: this.quizId } });
  //   });
  // }

  // isMobileMenuOpen = false;

  // toggleMobileMenu() {
  //   this.isMobileMenuOpen = !this.isMobileMenuOpen;
  // }

  // isDropdownVisible = false;

  // toggleDropdown() {
  //   this.isDropdownVisible = !this.isDropdownVisible;
  // }

  // addTag() {
  //   if (this.newTag !== '' && !this.tags.some(item => item.tag.name === this.newTag)) {
  //     const tag: Tag = {name: this.newTag};

  //     this.restService.addTag(tag).subscribe(data => {
  //       this.updateSelectedTags();
  //       this.refreshTags();
  //     });
  //     this.newTag = '';
  //   }
  // }

  // refreshTags() {
  //   this.tags = [];
  //   this.restService.getAllTags().subscribe(data => {
  //     data.forEach((i) => {
  //       if (this.selectedTags.find(item => item.name === i.name)) {
  //         this.tags.push({ tag: i, checked: true });
  //       } else {
  //         this.tags.push({ tag: i, checked: false });
  //       }
  //     });
  //   });
  // }

  // filteredItems() {
  //   return this.tags.filter(item => item.tag.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  // }

  // updateSelectedTags() {
  //   this.selectedTags = this.tags.filter(item => item.checked).map(item => item.tag);
  // }
}
