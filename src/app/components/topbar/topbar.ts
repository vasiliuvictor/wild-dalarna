import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styles: `:host { display: block; }`,
})
export class Topbar {
  protected places = inject(PlacesService);
}
