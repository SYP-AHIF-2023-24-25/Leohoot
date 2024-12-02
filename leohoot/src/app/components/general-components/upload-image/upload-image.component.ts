import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html'
})
export class UploadImageComponent {
  imageUrl: string | undefined;

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(private restService: RestService) {}

  ngOnInit() {
    
  }

  getImageFromServer(imageUrl: string) {
    this.imageUrl = this.restService.getImage(imageUrl);
  }

  handleFileInput(event: any) {
    const files = event?.target?.files;
    if (files && files.length > 0) {
      const file = files.item(0);
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageString = e.target?.result as string;

          const extension = file.name.split('.').pop();
          const fileName = `quizImage.${extension}`;

          this.uploadImage(imageString, fileName).subscribe(data => {
            this.getImageFromServer(data);
            this.imageUploaded.emit(data);
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.')
      }
    } else {
      alert('Please select an image file.')
    }
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

