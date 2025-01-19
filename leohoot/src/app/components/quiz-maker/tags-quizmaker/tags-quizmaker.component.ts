import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Quiz } from 'src/app/model/quiz';
import { Tag } from 'src/app/model/tag';
import { RestService } from 'src/app/services/rest.service';

interface ListItems {
  tag: Tag;
  checked: boolean;
}

@Component({
  selector: 'app-tags-quizmaker',
  templateUrl: './tags-quizmaker.component.html'
})
export class TagsQuizmakerComponent {
  ngOnInit() {
    this.refreshTags();
  }

  @Input() quiz: Quiz | undefined;
  @Output() saveQuiz = new EventEmitter<void>();

  newTag: string = '';
  tags: ListItems[] = [];
  searchQuery: string = '';

  constructor(private restService: RestService) {
  }

  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  addTag() {
    if (this.newTag !== '' && !this.tags.some(item => item.tag.name === this.newTag)) {
      const tag: Tag = {name: this.newTag};

      this.restService.addTag(tag).subscribe(data => {
        this.updateTags();
        this.refreshTags();
      });
      this.newTag = '';
    }
  }

  refreshTags() {
    this.tags = [];
    this.restService.getAllTags().subscribe(data => {
      data.forEach((i) => {
        if (this.quiz?.tags.find(item => item.name === i.name)) {
          this.tags.push({ tag: i, checked: true });
        } else {
          this.tags.push({ tag: i, checked: false });
        }
      });
      this.tags.sort((a, b) => a.tag.name.localeCompare(b.tag.name));
    });
  }

  filteredItems() {
    return this.tags.filter(item => item.tag.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  updateTags() {
    if (this.quiz) {
      this.quiz.tags = this.tags.filter(item => item.checked).map(item => item.tag);
      if (this.quiz.id) {
        this.saveQuiz.emit();
      }
    }
  }
}
