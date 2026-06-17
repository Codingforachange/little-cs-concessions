import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ReviewService } from '../../services/review.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isLoggedIn = false;
  password = '';

  allEvents: any[] = [];
  allReviews: any[] = [];
  allMenuItems: any[] = [];

  // Models for new entries
  newEvent = { day: 15, month: 'May', year: 2026, title: '', startTime: '', location: '', address: '' };
  newMenuItem = { name: '', category: 'Food', price: 0 };

  constructor(
    private eventService: EventService,
    private reviewService: ReviewService,
    private menuService: MenuService
  ) {}

  ngOnInit() {}

  login() {
    if (this.password === 'LittleC2026') {
      this.isLoggedIn = true;
      this.loadAllData();
    } else {
      alert('Incorrect Password');
    }
  }

  loadAllData() {
    this.eventService.getEvents().subscribe(data => this.allEvents = data);
    this.reviewService.getReviews().subscribe(data => this.allReviews = data);
    this.menuService.getMenuItems().subscribe(data => this.allMenuItems = data);
  }

  // --- ACTIONS ---
  addEvent() {
    this.eventService.postEvents(this.newEvent).subscribe(() => {
      alert('Event Saved!');
      this.loadAllData();
    });
  }

  onDeleteEvent(id: number) {
    if(confirm('Delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => this.loadAllData());
    }
  }

  onDeleteReview(id: number) {
    if(confirm('Delete this review?')) {
      this.reviewService.deleteReview(id.toString()).subscribe(() => this.loadAllData());
    }
  }

  addMenuItem() {
    this.menuService.postMenuItem(this.newMenuItem).subscribe(() => {
      alert('Item Added!');
      this.loadAllData();
      this.newMenuItem = { name: '', category: 'Food', price: 0 };
    });
  }

  onDeleteItem(id: number) {
    if(confirm('Delete this food item?')) {
      this.menuService.deleteMenuItem(id).subscribe(() => this.loadAllData());
    }
  }
}