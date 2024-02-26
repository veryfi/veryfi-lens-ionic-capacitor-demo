import { Injectable } from '@angular/core';

export interface LensEvent {
  eventTitle: string;
  eventData: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataService {
  public lensEvents: LensEvent[] = [
  ];

  constructor() { }

  public getLensEvents(): LensEvent[] {
    return this.lensEvents;
  }
}
