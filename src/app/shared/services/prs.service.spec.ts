import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { PrsService } from './prs.service';
import { Pr, PRState } from '../models/stats.models';

describe('PrsService', () => {
  let service: PrsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['patch']);

    TestBed.configureTestingModule({
      providers: [
        PrsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(PrsService);
  });

  it('should toggle countInStats and call patch', () => {
    const pr: Pr = {
      id: '00000000-0000-0000-0000-000000000000',
      title: 'Test PR',
      url: 'http://example.com/pr/1',
      openedAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
      mergedAt: null,
      closedAt: null,
      state: PRState.OPEN,
      locTotal: 100,
      locAdded: 80,
      locDeleted: 20,
      countInStats: true,
    }
    const updatedPr: Pr = { ...pr, countInStats: false };
    httpClientSpy.patch.and.returnValue(of(updatedPr));

    service.togglePrCountInStats(pr).subscribe(result => {
      expect(result).toEqual(updatedPr);
    });

    expect(httpClientSpy.patch).toHaveBeenCalledWith(
      jasmine.stringMatching(`/prs/${pr.id}`),
      { countInStats: false }
    );
  });
});
