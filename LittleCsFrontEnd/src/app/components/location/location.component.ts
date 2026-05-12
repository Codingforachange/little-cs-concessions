import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  // Default values while loading
  currentLocation: string = "Checking our schedule...";
  mapUrl!: SafeResourceUrl;

  constructor(
    private eventService: EventService, 
    private sanitizer: DomSanitizer
  ) {
    // Set a safe initial default (New Kensington)
    this.setMapUrl("New Kensington, PA");
  }

  ngOnInit(): void {
    this.updateLiveLocation();
  }

  updateLiveLocation(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.toLocaleString('default', { month: 'long' });
        const currentYear = today.getFullYear();

        // 1. Look for an event matching today's date
        const todaysEvent = events.find(e => e.day === currentDay);
       

        if (todaysEvent) {
          // 2. If found, update the display text and map
          this.currentLocation = `${todaysEvent.title} @ ${todaysEvent.location}`;
          this.setMapUrl(todaysEvent.address);
        } else {
          // 3. Fallback if no event is scheduled for today
          this.currentLocation = "Back at the Home Base";
          this.setMapUrl("New Kensington, PA");
        }
      },
      error: (err) => {
        console.error("Could not fetch events for map:", err);
        this.currentLocation = "Location currently unavailable";
      }
    });
  }

  private setMapUrl(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    // Standard Google Maps Embed URL
    const url = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}