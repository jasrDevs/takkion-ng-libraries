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
 * Scaffolds a new table component.
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
    options.skipImport ? (0, schematics_1.noop)() : addTableModulesToModule(options),
  ]);
}
exports.default = default_1;
/**
 * Adds the required modules to the relative module.
 */
function addTableModulesToModule(options) {
  return async host => {
    const modulePath = await (0, schematics_2.findModuleFromOptions)(host, options);
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakTableModule',
      '@takkion/ng-material/table'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakPaginatorModule',
      '@takkion/ng-material/paginator'
    );
    (0, schematics_2.addModuleImportToModule)(
      host,
      modulePath,
      'TakSortModule',
      '@takkion/ng-material/sort'
    );
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJEQUFtRTtBQUNuRSx3REFJaUM7QUFHakM7OztHQUdHO0FBQ0gsbUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxJQUFBLGtCQUFLLEVBQUM7UUFDWCxJQUFBLDJCQUFjLEVBQ1osRUFBQyxHQUFHLE9BQU8sRUFBQyxFQUNaO1lBQ0UsUUFBUSxFQUNOLGtGQUFrRjtZQUNwRixVQUFVLEVBQ1IsdUZBQXVGO1NBQzFGLENBQ0Y7UUFDRCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFBLGlCQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO0tBQy9ELENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCw0QkFhQztBQUVEOztHQUVHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FBQyxPQUFlO0lBQzlDLE9BQU8sS0FBSyxFQUFFLElBQVUsRUFBRSxFQUFFO1FBQzFCLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSxJQUFBLGtDQUFxQixFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBRSxDQUFDO1FBQ2pFLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3ZGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQy9GLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUN2RixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlLFxuICBidWlsZENvbXBvbmVudCxcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi9zY2hlbWEnO1xuXG4vKipcbiAqIFNjYWZmb2xkcyBhIG5ldyB0YWJsZSBjb21wb25lbnQuXG4gKiBJbnRlcm5hbGx5IGl0IGJvb3RzdHJhcHMgdGhlIGJhc2UgY29tcG9uZW50IHNjaGVtYXRpY1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBjaGFpbihbXG4gICAgYnVpbGRDb21wb25lbnQoXG4gICAgICB7Li4ub3B0aW9uc30sXG4gICAgICB7XG4gICAgICAgIHRlbXBsYXRlOlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuaHRtbC50ZW1wbGF0ZScsXG4gICAgICAgIHN0eWxlc2hlZXQ6XG4gICAgICAgICAgJy4vX19wYXRoX18vX19uYW1lQGRhc2hlcml6ZUBpZi1mbGF0X18vX19uYW1lQGRhc2hlcml6ZV9fLmNvbXBvbmVudC5fX3N0eWxlX18udGVtcGxhdGUnLFxuICAgICAgfSxcbiAgICApLFxuICAgIG9wdGlvbnMuc2tpcEltcG9ydCA/IG5vb3AoKSA6IGFkZFRhYmxlTW9kdWxlc1RvTW9kdWxlKG9wdGlvbnMpLFxuICBdKTtcbn1cblxuLyoqXG4gKiBBZGRzIHRoZSByZXF1aXJlZCBtb2R1bGVzIHRvIHRoZSByZWxhdGl2ZSBtb2R1bGUuXG4gKi9cbmZ1bmN0aW9uIGFkZFRhYmxlTW9kdWxlc1RvTW9kdWxlKG9wdGlvbnM6IFNjaGVtYSkge1xuICByZXR1cm4gYXN5bmMgKGhvc3Q6IFRyZWUpID0+IHtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gKGF3YWl0IGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhob3N0LCBvcHRpb25zKSkhO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRUYWJsZU1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC90YWJsZScpO1xuICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRQYWdpbmF0b3JNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvcGFnaW5hdG9yJyk7XG4gICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdFNvcnRNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvc29ydCcpO1xuICB9O1xufVxuIl19
