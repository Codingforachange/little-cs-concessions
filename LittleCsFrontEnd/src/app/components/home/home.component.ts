import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { MenuComponent } from "../menu/menu.component";
import { AboutComponent } from "../about/about.component";
import { EventsComponent } from "../events/events.component";
import { GalleryComponent } from "../gallery/gallery.component";
import { ReviewsComponent } from "../reviews/reviews.component";
import { ContactComponent } from "../contact/contact.component";
import { LocationComponent } from "../location/location.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, MenuComponent, AboutComponent, EventsComponent, GalleryComponent, ReviewsComponent, ContactComponent, LocationComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
