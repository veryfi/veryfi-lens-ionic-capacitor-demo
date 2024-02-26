import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractedPage } from './extracted.page';

const routes: Routes = [
  {
    path: '',
    component: ExtractedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtractedPageRoutingModule {}
