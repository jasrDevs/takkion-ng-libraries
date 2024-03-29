/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { TakCommonModule } from '../common-behaviors/common-module';
import { TakRipple } from './ripple';
import * as i0 from '@angular/core';
export * from './ripple';
export * from './ripple-ref';
export * from './ripple-renderer';
export class TakRippleModule {}
TakRippleModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRippleModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakRippleModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRippleModule,
  declarations: [TakRipple],
  imports: [TakCommonModule],
  exports: [TakRipple, TakCommonModule],
});
TakRippleModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRippleModule,
  imports: [TakCommonModule, TakCommonModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakRippleModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [TakCommonModule],
          exports: [TakRipple, TakCommonModule],
          declarations: [TakRipple],
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9yaXBwbGUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDbEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbkMsY0FBYyxVQUFVLENBQUM7QUFDekIsY0FBYyxjQUFjLENBQUM7QUFDN0IsY0FBYyxtQkFBbUIsQ0FBQztBQU9sQyxNQUFNLE9BQU8sZUFBZTs7NEdBQWYsZUFBZTs2R0FBZixlQUFlLGlCQUZYLFNBQVMsYUFGZCxlQUFlLGFBQ2YsU0FBUyxFQUFFLGVBQWU7NkdBR3pCLGVBQWUsWUFKaEIsZUFBZSxFQUNKLGVBQWU7MkZBR3pCLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO29CQUMxQixPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO29CQUNyQyxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRDb21tb25Nb2R1bGV9IGZyb20gJy4uL2NvbW1vbi1iZWhhdmlvcnMvY29tbW9uLW1vZHVsZSc7XG5pbXBvcnQge01hdFJpcHBsZX0gZnJvbSAnLi9yaXBwbGUnO1xuXG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZSc7XG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZS1yZWYnO1xuZXhwb3J0ICogZnJvbSAnLi9yaXBwbGUtcmVuZGVyZXInO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdFJpcHBsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0UmlwcGxlXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmlwcGxlTW9kdWxlIHt9XG4iXX0=
