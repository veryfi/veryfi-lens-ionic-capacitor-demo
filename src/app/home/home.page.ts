import { Component, NgZone } from '@angular/core';
import '@veryfi/veryfi-lens-capacitor';
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';
import { DataService, LensEvent } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  thumbnail = 'https://cdn.veryfi.com/wp-content/uploads/Screen-Shot-2017-11-20-at-12.02.57-PM.png';
  constructor(private ngZone: NgZone, private data: DataService) {
    this.setupVeryfiLens();
    this.setEventListener();
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 1);
  }

  getLensEvents(): LensEvent[] {
    return this.data.getLensEvents();
  }

  setupVeryfiLens() {
    const veryfiLensCredentials = {
      url: 'XXX', // replace XXX with your assigned Client Id
      clientId: 'XXX', // replace XXX with your assigned Username
      userName: 'XXX', // replace XXX with your assigned API Key
      apiKey: 'XXX' // replace XXX with your assigned Endpoint URL
    };

    const veryfiLensSettings = {
      blurDetectionIsOn: true,
      autoLightDetectionIsOn: false,
      showDocumentTypes: true,
      documentTypes: ['receipt'],
    };

    const options = {
      credentials: veryfiLensCredentials,
      settings: veryfiLensSettings
    };
    VeryfiLensCapacitor.veryfiInitLens(options);
  }

  showCamera() {
    VeryfiLensCapacitor.showCamera();
  }

  setEventListener() {
    VeryfiLensCapacitor.setLensEventDelegate();
    VeryfiLensCapacitor.addListener('veryfiLensClose', (data: Object) => {
      console.log('veryfiLensClose');
      console.log(data);
      this.addEventToList('veryfiLensClose', JSON.stringify(data));
    });
    VeryfiLensCapacitor.addListener('veryfiLensError', (data: Object) => {
      console.log('veryfiLensError');
      console.log(data);
      this.addEventToList('veryfiLensError', JSON.stringify(data));
    });
    VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data: Object) => {
      console.log('veryfiLensSuccess');
      console.log(data);
      this.addEventToList('veryfiLensSuccess', JSON.stringify(data));
    });
    VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data: Object) => {
      console.log('veryfiLensUpdate');
      console.log(data);
      this.addEventToList('veryfiLensUpdate', JSON.stringify(data));
    });
  }

  addEventToList(name: string, data: string) {
    this.ngZone.run(() => {
      this.data.lensEvents.push({
        eventTitle: name,
        eventData: data,
      });
    });
  }
}
