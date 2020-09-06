import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopRoutingModule } from './top-routing.module';
import { TopComponent } from './top/top.component';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [TopComponent, WelcomeComponent],
  imports: [
    CommonModule,
    TopRoutingModule,
    MatTabsModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class TopModule { }
