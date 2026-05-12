import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuItems = [
    {
      name: 'Funnel Cake',
      price: 8.00,
      description: 'Classic fair style with powdered sugar.',
      image: 'assets/funnel-cake.png'
    },
    {
      name:'Deep Fried Oreos',
      price: 5.00,
      description:'5 per order. Melt-in-your-mouth delicious.',
      image: 'assets/oreos.png'
    },
    {
      name: 'Fresh Squeezed Lemonade',
      price: 6.00,
      description: 'Large(with $3 refills) or Small for $4.',
      image: 'assets/lemonade.png'
    }
  ];
}
