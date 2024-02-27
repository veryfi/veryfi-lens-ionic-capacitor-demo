import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-extracted',
  templateUrl: './extracted.page.html',
  styleUrls: ['./extracted.page.scss'],
})
export class ExtractedPage implements OnInit {

  lensData: any;
  previewData = '';
  option = '0';
  buttonSelected = 1;
  dataSelected = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.lensData = this.route.snapshot.paramMap.get('data');
    const jsonData = JSON.parse(this.lensData);
    this.previewData = JSON.parse(jsonData);
    this.option = this.route.snapshot.paramMap.get('option');
  }

  selectContent(button: number) {
    this.buttonSelected = button;
    if (button === 1) {
      this.dataSelected = true;
    } else {
      this.dataSelected = false;
    }
  }

}
