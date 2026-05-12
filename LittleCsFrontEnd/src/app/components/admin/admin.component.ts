import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  isLoggedIn = false;
  password = '';
  allEvents: any[] = [];
  allReviews: any[] = [];

  // New Event Model
  newEvent = {
    day: new Date().getDate(),
    month: "May",
    year: 2026,
    title: '',
    startTime: '',
    location: '',
    address: ''
  };

  constructor(
    private eventService: EventService,
    private reviewService: ReviewService
  ) {}

  ngOnit() {
    this.loadEvents(); // Load table when component starts
    this.loadReviews();
  }

  login() {
    //Simple password check for now
    if (this.password === 'LittleC2026') {
      this.isLoggedIn = true;
      this.loadEvents();
      this.loadReviews();
    } else {
      alert('Incorrect Password');
    }
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(data => {
      this.allEvents = data;
    });
  }

  addEvent() {
    this.eventService.postEvents(this.newEvent).subscribe({
      next: () => {
        alert('Success! The map and schedule are updated');
        this.loadEvents(); //Refresh table
        // Reset the form
        this.newEvent = {
          day: new Date().getDate(),
          month: 'May',
          year: 2026,
          title: '',
          startTime: '',
          location: '',
          address: ''
        };
      },
      error: (err:any) => alert('Error saving event: ' + err.message)
    });
  }

  onDelete(title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.eventService.deleteEvent(title).subscribe({
        next: () => {
          alert('Event Deleted successfully');
          this.loadEvents(); // Refresh table automatically
        },
        error: (err: any) => alert('Delete failed: ' + err.message)
      });
    }
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe(data => {
      this.allReviews = data;
    });
  }

  onDeleteReview(customer: string) {
    if (confirm(`Delete review from ${customer}?`)) {
      this.reviewService.deleteReview(customer).subscribe(() => {
        alert('Review removed');
        this.loadReviews(); // Refresh list
      });
    }
  }
}
