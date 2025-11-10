import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { EngineersService } from './engineers.service';
import { Engineer, Stat, Pr } from '../../shared/models/stats.models';

describe('EngineersService', () => {
  let service: EngineersService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const apiUrl = '/engineers';

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [
        EngineersService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(EngineersService);
  });

  it('should get engineer by id', () => {
    const mockEngineer: Engineer = { id: '1', name: 'Alice' } as Engineer;
    httpClientSpy.get.and.returnValue(of(mockEngineer));

    service.getEngineerById('1').subscribe(engineer => {
      expect(engineer).toEqual(mockEngineer);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1`);
  });

  it('should get engineer stats', () => {
    const mockStats: Stat[] = [{
      label: 'Q1',
      prReviewed: 10,
      prMerged: 5,
      locAdded: 1000,
      locDeleted: 500,
      locTotal: 1500
     }];
    httpClientSpy.get.and.returnValue(of(mockStats));

    service.getEngineersStats('1', 'quarter').subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/stats?period=quarter`);
  });

  it('should get engineer PRs', () => {
    const mockPrs: Pr[] = [{ id: 'pr1' } as Pr];
    httpClientSpy.get.and.returnValue(of(mockPrs));

    service.getEngineersPRs('1', 'quarter').subscribe(prs => {
      expect(prs).toEqual(mockPrs);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/prs?period=quarter`);
  });

  it('should sync engineer stats', () => {
    httpClientSpy.get.and.returnValue(of(void 0));

    service.syncEngineerStats('1').subscribe(result => {
      expect(result).toBeUndefined();
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${apiUrl}/1/update`);
  });
});
