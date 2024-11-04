import { Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-optional-image',
  templateUrl: './optional-image.component.html',
})
export class OptionalImageComponent {
  @Input() imageUrl?: string;
}
