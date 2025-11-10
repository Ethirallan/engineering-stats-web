import { Component, output, signal } from '@angular/core';
import { Period } from '../../models/stats.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-period-button-group',
  imports: [CommonModule],
  templateUrl: './period-button-group.component.html',
  styleUrl: './period-button-group.component.scss',
})
export class PeriodButtonGroupComponent {
  onPeriodChanged = output<Period>();

  selectedPeriod = signal<Period>('quarter');

  changePeriod(period: Period) {
    this.selectedPeriod.set(period);
    this.onPeriodChanged.emit(this.selectedPeriod());
  }
}
