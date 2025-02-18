import { Component, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html'
})
export class UploadImageComponent {
  imageUrl: string | undefined;

  @Output() imageUploaded = new EventEmitter<string>();
  @Input() question: any;

  constructor(private restService: RestService) {}

  ngOnInit() {
    
  }

  getImageFromServer(imageUrl: string) {
    if(this.question){
      this.question.imageUrl = this.restService.getImage(imageUrl);
    }
   
  }

  handleFileInput(event: any): void {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageString = e.target?.result as string;
          const extension = file.name.split('.').pop();

          // Dynamically determine the file name based on input requirements
          const fileName = this.generateFileName(extension);

          // Upload the image
          this.uploadImage(imageString, fileName).subscribe((data: string) => {
            this.getImageFromServer(data);
            this.imageUploaded.emit(data); // Emit the uploaded image name
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    } else {
      alert('Please select an image file.');
    }
  }

  private generateFileName(extension: string): string {
    // Example logic for generating the filename
    const questionNumber = this.getQuestionNumber();
    return questionNumber
      ? `questionImage_${questionNumber.toString().padStart(2, '0')}.${extension}`
      : `quizImage.${extension}`;
  }

  private getQuestionNumber(): number | null {
    // Mock logic to determine question number (replace with your actual logic)
    if (this.question && this.question.questionNumber > 0) {
      return this.question.questionNumber;
    }
    return null;
  }
  
  uploadImage(imageString: string, fileName: string) {
    const imageBlob = this.dataURItoBlob(imageString);

    const formData = new FormData();

    formData.append('image', imageBlob, fileName);

    return this.restService.addImage(formData);
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}

