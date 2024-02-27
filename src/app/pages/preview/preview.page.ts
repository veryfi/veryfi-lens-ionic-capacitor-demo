import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {

  previewData = '';
  previewTitle = 'Receipts & Invoices';
  lensData: any;
  option = '0';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.lensData = this.route.snapshot.paramMap.get('data');
    const jsonData = JSON.parse(this.lensData);
    this.previewData = jsonData.data;
    this.option = this.route.snapshot.paramMap.get('option');
    this.getPreviewTitle(this.option);
  }

  backToHome() {
    this.router.navigate(['/home'], {replaceUrl: true});
  }

  showExtractedData() {
    this.router.navigate(['/extracted', this.option, JSON.stringify(this.lensData)]);
  }

  getPreviewTitle(option: string) {
    switch (option) {
      case '1':
        this.previewTitle = 'Long receipt';
        break;
      case '2':
        this.previewTitle = 'Check';
        break;
      case '3':
        this.previewTitle = 'Credit card';
        break;
      case '4':
        this.previewTitle = 'Business card';
        break;
      case '6':
        this.previewTitle = 'W-2';
        break;
      case '7':
        this.previewTitle = 'W-9';
        break;
      case '8':
        this.previewTitle = 'Bank Statements';
        break;
      case '9':
        this.previewTitle = 'Barcodes';
        break;
      case '10':
        this.previewTitle = 'Insurance card';
        break;
      case '11':
        this.previewTitle = 'Passport';
        break;
      case '12':
        this.previewTitle = 'Driver license';
        break;
      case '5':
        this.previewTitle = 'OCR';
        break;
      default:
        this.previewTitle = 'Receipts & Invoices';
    }
  }

}
