/* eslint-disable @typescript-eslint/ban-types */
import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import '@veryfi/veryfi-lens-capacitor';
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';
import { SettingsService } from '../../services/settings.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  option = '0';

  constructor(private ngZone: NgZone, private router: Router, private veryfiSettings: SettingsService, private data: DataService) { }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 1);
  }

  showLoadingScreen(option: string) {
    if (option === '0') {
      this.option = option;
      this.setDocumentType(option);
      this.setupVeryfiLens();
      this.setEventListener();
      this.showCamera();
    }
  }

  setupVeryfiLens() {
    const veryfiLensCredentials = {
      url: '', // replace XXX with your assigned Client Id
      clientId: '', // replace XXX with your assigned Username
      userName: '', // replace XXX with your assigned API Key
      apiKey: '' // replace XXX with your assigned Endpoint URL
    };

    const options = {
      credentials: veryfiLensCredentials,
      settings: this.veryfiSettings.veryfiLensSettings
    };
    VeryfiLensCapacitor.veryfiInitLens(options);
  }

  showCamera() {
    VeryfiLensCapacitor.showCamera();
  }

  showSettings(option: string) {
    this.router.navigate(['/settings', option]);
  }

  showDocumentCapture() {
    window.open('https://www.youtube.com/playlist?list=PLkA-lFc8JUY55g0Pgmegs86Tq6ZfK0yb2', '_system');
  }

  setDocumentType(option: string) {
    switch (option) {
      case '0':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['receipt'];
        break;
      case '1':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['long_receipt'];
        break;
      case '2':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['check'];
        break;
      case '3':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['credit_card'];
        break;
      case '4':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['business_card'];
        break;
      case '5':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['code'];
        break;
      case '6':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['w2'];
        break;
      case '7':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['w9'];
        break;
      case '8':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['bank_statements'];
        break;
      case '9':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['barcodes'];
        break;
      case '10':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['insurance_card'];
        break;
      case '11':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['passport'];
        break;
      case '12':
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['driver_license'];
        break;
      default:
        this.veryfiSettings.veryfiLensSettings.documentTypes = ['receipt'];
    }
  }

  addEventToList(name: string, data: string) {
    this.ngZone.run(() => {
      this.data.lensEvents.push({
        eventTitle: name,
        eventData: data,
      });
    });
  }

  setEventListener() {
    VeryfiLensCapacitor.setLensEventDelegate();
    VeryfiLensCapacitor.addListener('veryfiLensClose', (data: Object) => {
      console.log('veryfiLensClose');
      console.log(JSON.stringify(data));
      this.addEventToList('veryfiLensClose', JSON.stringify(data));
      this.router.navigate(['/loading', this.option]);
    });
  }
}
