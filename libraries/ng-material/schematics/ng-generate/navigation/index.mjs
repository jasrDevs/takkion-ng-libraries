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
 * Scaffolds a new navigation component.
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
      'LayoutModule',
      '@takkion/ng-cdk/layout'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakToolbarModule',
      '@takkion/ng-material/toolbar'
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
      'TakSidenavModule',
      '@takkion/ng-material/sidenav'
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
      'TakListModule',
      '@takkion/ng-material/list'
    );
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS9uYXZpZ2F0aW9uL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMkRBQW1FO0FBQ25FLHdEQUlpQztBQUdqQzs7O0dBR0c7QUFDSCxtQkFBeUIsT0FBZTtJQUN0QyxPQUFPLElBQUEsa0JBQUssRUFBQztRQUNYLElBQUEsMkJBQWMsRUFDWixFQUFDLEdBQUcsT0FBTyxFQUFDLEVBQ1o7WUFDRSxRQUFRLEVBQ04sa0ZBQWtGO1lBQ3BGLFVBQVUsRUFDUix1RkFBdUY7U0FDMUYsQ0FDRjtRQUNELE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUEsaUJBQUksR0FBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUM7S0FDN0QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWJELDRCQWFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLE9BQWU7SUFDNUMsT0FBTyxLQUFLLEVBQUUsSUFBVSxFQUFFLEVBQUU7UUFDMUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLElBQUEsa0NBQXFCLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFFLENBQUM7UUFDakUsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQzNGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQ3pGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1FBQzNGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUNyRixJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NoYWluLCBub29wLCBSdWxlLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge1xuICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZSxcbiAgYnVpbGRDb21wb25lbnQsXG4gIGZpbmRNb2R1bGVGcm9tT3B0aW9ucyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4vc2NoZW1hJztcblxuLyoqXG4gKiBTY2FmZm9sZHMgYSBuZXcgbmF2aWdhdGlvbiBjb21wb25lbnQuXG4gKiBJbnRlcm5hbGx5IGl0IGJvb3RzdHJhcHMgdGhlIGJhc2UgY29tcG9uZW50IHNjaGVtYXRpY1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBjaGFpbihbXG4gICAgYnVpbGRDb21wb25lbnQoXG4gICAgICB7Li4ub3B0aW9uc30sXG4gICAgICB7XG4gICAgICAgIHRlbXBsYXRlOlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuaHRtbC50ZW1wbGF0ZScsXG4gICAgICAgIHN0eWxlc2hlZXQ6XG4gICAgICAgICAgJy4vX19wYXRoX18vX19uYW1lQGRhc2hlcml6ZUBpZi1mbGF0X18vX19uYW1lQGRhc2hlcml6ZV9fLmNvbXBvbmVudC5fX3N0eWxlX18udGVtcGxhdGUnLFxuICAgICAgfSxcbiAgICApLFxuICAgIG9wdGlvbnMuc2tpcEltcG9ydCA/IG5vb3AoKSA6IGFkZE5hdk1vZHVsZXNUb01vZHVsZShvcHRpb25zKSxcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyB0aGUgcmVxdWlyZWQgbW9kdWxlcyB0byB0aGUgcmVsYXRpdmUgbW9kdWxlLlxuICovXG5mdW5jdGlvbiBhZGROYXZNb2R1bGVzVG9Nb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSAoYXdhaXQgZmluZE1vZHVsZUZyb21PcHRpb25zKGhvc3QsIG9wdGlvbnMpKSE7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ0xheW91dE1vZHVsZScsICdAYW5ndWxhci9jZGsvbGF5b3V0Jyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdFRvb2xiYXJNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvdG9vbGJhcicpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRCdXR0b25Nb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdFNpZGVuYXZNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2lkZW5hdicpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRJY29uTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nKTtcbiAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCAnTWF0TGlzdE1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9saXN0Jyk7XG4gIH07XG59XG4iXX0=
