
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoadingPageRoutingModule } from './loading-routing.module';
import { LoadingPage } from './loading.page';
import { LottieModule } from 'ngx-lottie';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function playerFactory() {
  return import('lottie-web');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadingPageRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  declarations: [LoadingPage]
})
export class LoadingPageModule {}
