import { Component } from '@angular/core';
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

interface ListItems {
  tag: Tag;
  checked: boolean;
}

@Component({
  selector: 'app-design-quiz',
  templateUrl: './quiz-maker.component.html'
})
export class QuizMakerComponent {
  quizId: number = 0;
  quiz?: Quiz;
  username: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private configurationService: ConfigurationService, private restService: RestService, private loginService: LoginService) {

  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
        await this.getQuiz()
      }
    })
    this.quiz = this.configurationService.getQuiz();
    this.username = this.loginService.getUserName()
  }

  async getQuiz() {
    this.restService.getQuizById(this.quizId).subscribe((data) => {
      this.quiz = data;
    })
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
