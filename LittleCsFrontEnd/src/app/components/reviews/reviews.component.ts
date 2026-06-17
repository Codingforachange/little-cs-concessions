import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
   reviews: any[] = [];

   // Binding variables for the form
   newReview = {
    customer_name: '',
    rating: 5,
    comment: '',
    location: 'New Kensington, PA'
   };

   constructor(private reviewService: ReviewService) {}

   ngOnInit() {
    this.loadReviews();
   }

   loadReviews() {
    this.reviewService.getReviews().subscribe(data => {
      this.reviews = data;
    });
   }

   onSubmit() {
    this.reviewService.postReview(this.newReview).subscribe(() => {
      this.loadReviews(); // Refresh the list
      // Reset the form
      this.newReview = { customer_name: '', rating: 5, comment: '', location: 'New Kensington, PA'};
    });
   }

  // Helper to create an array for stars
  getStars(rating: number) {
    return Array(rating).fill(0);
  }

  // Submit Review Function
  submitReview(event: any) {
    event.preventDefault();

    //Grab the value from the form
    const nameInput = document.getElementById('custName') as HTMLInputElement;
    const ratingInput = document.getElementById('custRating') as HTMLSelectElement;
    const commentInput = document.getElementById('custComment') as HTMLTextAreaElement;

    //Creae a new review object
    const newReview = {
      customer_name: nameInput.value,
      rating: parseInt(ratingInput.value),
      comment: commentInput.value,
      location: 'Verified Customer'
    };

    // Add it to the front of the reviews array
    this.reviews.unshift(newReview);

    // Reset the form fields
    nameInput.value = '';
    commentInput.value = '';
    ratingInput.selectedIndex = 0;

    alert('Review posted!');
  }
}

