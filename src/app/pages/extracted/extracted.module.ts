import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExtractedPageRoutingModule } from './extracted-routing.module';
import { ExtractedPage } from './extracted.page';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtractedPageRoutingModule,
    NgxJsonViewerModule
  ],
  declarations: [ExtractedPage]
})
export class ExtractedPageModule {}
