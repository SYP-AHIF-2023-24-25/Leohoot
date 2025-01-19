import { Component, Input } from '@angular/core';
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

  ngOnChanges() {
    this.updateSelectedTags();
  }

  selectedTags: Tag[] = [];

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
        this.updateSelectedTags();
        this.refreshTags();
      });
      this.newTag = '';
    }
  }

  refreshTags() {
    this.tags = [];
    this.restService.getAllTags().subscribe(data => {
      data.forEach((i) => {
        if (this.selectedTags.find(item => item.name === i.name)) {
          this.tags.push({ tag: i, checked: true });
        } else {
          this.tags.push({ tag: i, checked: false });
        }
      });
    });
  }

  filteredItems() {
    return this.tags.filter(item => item.tag.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  updateSelectedTags() {
    this.selectedTags = this.tags.filter(item => item.checked).map(item => item.tag);
  }
}
