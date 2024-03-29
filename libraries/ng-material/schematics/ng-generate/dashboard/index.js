'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
const schematics_1 = require('@angular-devkit/schematics');
const schematics_2 = require('@takkion/ng-cdk/schematics');
/**
 * Scaffolds a new dashboard component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
  return (0, schematics_1.chain)([
    (0, schematics_2.buildComponent)(
      { ...options },
      {
        template:
          './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
        stylesheet:
          './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
      }
    ),
    options.skipImport ? (0, schematics_1.noop)() : addNavModulesToModule(options),
  ]);
}
exports.default = default_1;
/**
 * Adds the required modules to the relative module.
 */
function addNavModulesToModule(options) {
  return async host => {
    const modulePath = await (0, schematics_2.findModuleFromOptions)(host, options);
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakGridListModule',
      '@takkion/ng-material/grid-list'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakCardModule',
      '@takkion/ng-material/card'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakMenuModule',
      '@takkion/ng-material/menu'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakIconModule',
      '@takkion/ng-material/icon'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakButtonModule',
      '@takkion/ng-material/button'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'LayoutModule',
      '@takkion/ng-cdk/layout'
    );
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS9kYXNoYm9hcmQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyREFBbUU7QUFDbkUsd0RBSWlDO0FBR2pDOzs7R0FHRztBQUNILG1CQUF5QixPQUFlO0lBQ3RDLE9BQU8sSUFBQSxrQkFBSyxFQUFDO1FBQ1gsSUFBQSwyQkFBYyxFQUNaLEVBQUMsR0FBRyxPQUFPLEVBQUMsRUFDWjtZQUNFLFFBQVEsRUFDTixrRkFBa0Y7WUFDcEYsVUFBVSxFQUNSLHVGQUF1RjtTQUMxRixDQUNGO1FBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBSSxHQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQztLQUM3RCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsNEJBYUM7QUFFRDs7R0FFRztBQUNILFNBQVMscUJBQXFCLENBQUMsT0FBZTtJQUM1QyxPQUFPLEtBQUssRUFBRSxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sSUFBQSxrQ0FBcUIsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUUsQ0FBQztRQUNqRSxJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztRQUM5RixJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDckYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUNyRixJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztRQUN6RixJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDbkYsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBub29wLCBSdWxlLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZSxcbiAgYnVpbGRDb21wb25lbnQsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgYSBuZXcgZGFzaGJvYXJkIGNvbXBvbmVudC5cbiAqIEludGVybmFsbHkgaXQgYm9vdHN0cmFwcyB0aGUgYmFzZSBjb21wb25lbnQgc2NoZW1hdGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGNoYWluKFtcbiAgICBidWlsZENvbXBvbmVudChcbiAgICAgIHsuLi5vcHRpb25zfSxcbiAgICAgIHtcbiAgICAgICAgdGVtcGxhdGU6XG4gICAgICAgICAgJy4vX19wYXRoX18vX19uYW1lQGRhc2hlcml6ZUBpZi1mbGF0X18vX19uYW1lQGRhc2hlcml6ZV9fLmNvbXBvbmVudC5odG1sLnRlbXBsYXRlJyxcbiAgICAgICAgc3R5bGVzaGVldDpcbiAgICAgICAgICAnLi9fX3BhdGhfXy9fX25hbWVAZGFzaGVyaXplQGlmLWZsYXRfXy9fX25hbWVAZGFzaGVyaXplX18uY29tcG9uZW50Ll9fc3R5bGVfXy50ZW1wbGF0ZScsXG4gICAgICB9LFxuICAgICksXG4gICAgb3B0aW9ucy5za2lwSW1wb3J0ID8gbm9vcCgpIDogYWRkTmF2TW9kdWxlc1RvTW9kdWxlKG9wdGlvbnMpLFxuICBdKTtcbn1cblxuLyoqXG4gKiBBZGRzIHRoZSByZXF1aXJlZCBtb2R1bGVzIHRvIHRoZSByZWxhdGl2ZSBtb2R1bGUuXG4gKi9cbmZ1bmN0aW9uIGFkZE5hdk1vZHVsZXNUb01vZHVsZShvcHRpb25zOiBTY2hlbWEpIHtcbiAgcmV0dXJuIGFzeW5jIChob3N0OiBUcmVlKSA9PiB7XG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IChhd2FpdCBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoaG9zdCwgb3B0aW9ucykpITtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0R3JpZExpc3RNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvZ3JpZC1saXN0Jyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdENhcmRNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCcpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRNZW51TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0SWNvbk1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdEJ1dHRvbk1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTGF5b3V0TW9kdWxlJywgJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnKTtcbiAgfTtcbn1cbiJdfQ==
