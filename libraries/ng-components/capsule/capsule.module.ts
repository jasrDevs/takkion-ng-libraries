import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakCapsule } from './capsule.component';

@NgModule({
  declarations: [TakCapsule],
  imports: [CommonModule],
  exports: [TakCapsule],
})
export class TakCapsuleModule {}
