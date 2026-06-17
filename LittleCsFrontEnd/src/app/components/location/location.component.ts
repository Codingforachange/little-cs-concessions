import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventService } from '../../services/event.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  currentLocation: string = "Checking our schedule...";
  mapUrl!: SafeResourceUrl;

  constructor(
    private eventService: EventService,
    private sanitizer: DomSanitizer,
    private locationService: LocationService
  ) {
    // Initial default map
    this.setMapUrl("New Kensington, PA");
  }

  ngOnInit(): void {
    this.updateLiveLocation();
  }

  updateLiveLocation(): void {
    // 1. First, try to get the specific "Live" location from PostgreSQL
    this.locationService.getLocation().subscribe({
      next: (data) => {
        if (data && data.address) {
          console.log('PostgreSQL Live Location Found:', data);
          this.currentLocation = `${data.name} @ ${data.address}, ${data.city}`;
          this.setMapUrl(`${data.address}, ${data.city}`);
        } else {
          // 2. If no "Live" record, fallback to checking the general Events schedule
          this.checkGeneralSchedule();
        }
      },
      error: (err) => {
        console.error('Database fetch failed, checking general schedule...', err);
        this.checkGeneralSchedule();
      }
    });
  }

  checkGeneralSchedule(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const today = new Date();
        const currentDay = today.getDate();
        
        // Find if today's date matches any event in the list
        const todaysEvent = events.find((e: any) => e.day === currentDay);

        if (todaysEvent) {
          this.currentLocation = `${todaysEvent.title} @ ${todaysEvent.location}`;
          this.setMapUrl(todaysEvent.address);
        } else {
          this.currentLocation = "Back at the Home Base";
          this.setMapUrl("New Kensington, PA");
        }
      },
      error: (err) => {
        this.currentLocation = "Location currently unavailable";
        this.setMapUrl("New Kensington, PA");
      }
    });
  }

  private setMapUrl(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}