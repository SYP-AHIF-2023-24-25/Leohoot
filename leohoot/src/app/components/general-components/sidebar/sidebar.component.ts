import { Component, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { DashboardSectionType } from "../../../model/dashboard-section-type";
import { Router } from "@angular/router";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  selectedItem: string = '';
  @Input() toggleSidebar?: () => void;

  constructor(private router: Router) {
  }

  async toggleHome(): Promise<void> {
    await this.router.navigate(['/dashboard'], { queryParams: {section: DashboardSectionType.HOME}});
    this.selectItem("home")
  }

  async toggleFavoriteQuizzes(): Promise<void> {
    await this.router.navigate(['/dashboard'], { queryParams: {section: DashboardSectionType.FAVOURITES}});
    this.selectItem("favorites")
  }

  async toggleOwnQuizzes(): Promise<void> {
    await this.router.navigate(['/dashboard'], { queryParams: {section: DashboardSectionType.OWN}});
    this.selectItem("own")
  }

  async toggleStatistics(): Promise<void> {
    await this.router.navigate(['/statisticOverview'])
    this.selectItem("statistics")
  }

  selectItem(item: string): void {
    this.selectedItem = item;
  }
}
