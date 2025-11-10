import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gradient-button',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gradient-button.component.html',
  styleUrl: './gradient-button.component.scss',
})
export class GradientButtonComponent {
  type = input<'primary' | 'secondary' | 'danger' | 'submit'>('primary');
  label = input<string>('');
  disabled = input<boolean>(false);
}
