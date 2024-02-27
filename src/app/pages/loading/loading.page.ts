/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit, NgZone } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import '@veryfi/veryfi-lens-capacitor';
import { VeryfiLensCapacitor } from '@veryfi/veryfi-lens-capacitor';
import { DataService, LensEvent } from '../../services/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  option = '0';
  options: AnimationOptions = {
    path: '../../assets/loading_animation.json'
  };

  constructor(private ngZone: NgZone, private data: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.option = this.route.snapshot.paramMap.get('option');
    this.setEventListener();
  }

  setEventListener() {
    VeryfiLensCapacitor.setLensEventDelegate();
    VeryfiLensCapacitor.addListener('veryfiLensError', (data: Object) => {
      console.log('veryfiLensError');
      console.log(JSON.stringify(data));
      this.addEventToList('veryfiLensError', JSON.stringify(data));
    });
    VeryfiLensCapacitor.addListener('veryfiLensSuccess', (data: Object) => {
      console.log('veryfiLensSuccess');
      console.log(JSON.stringify(data));
      this.addEventToList('veryfiLensSuccess', JSON.stringify(data));
      this.router.navigate(['/preview', this.option, JSON.stringify(data)]);
    });
    VeryfiLensCapacitor.addListener('veryfiLensUpdate', (data: Object) => {
      console.log('veryfiLensUpdate');
      console.log(JSON.stringify(data));
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
