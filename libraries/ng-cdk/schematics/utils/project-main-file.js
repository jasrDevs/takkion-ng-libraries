'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.getProjectMainFile = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const project_targets_1 = require('./project-targets');
/** Looks for the main TypeScript file in the given project and returns its path. */
function getProjectMainFile(project) {
  const buildOptions = (0, project_targets_1.getProjectTargetOptions)(project, 'build');
  if (!buildOptions.main) {
    throw new schematics_1.SchematicsException(
      `Could not find the project main file inside of the ` +
        `workspace config (${project.sourceRoot})`
    );
  }
  return buildOptions.main;
}
exports.getProjectMainFile = getProjectMainFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC1tYWluLWZpbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvcHJvamVjdC1tYWluLWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBSUgsMkRBQStEO0FBQy9ELHVEQUEwRDtBQUUxRCxvRkFBb0Y7QUFDcEYsU0FBZ0Isa0JBQWtCLENBQUMsT0FBMEI7SUFDM0QsTUFBTSxZQUFZLEdBQUcsSUFBQSx5Q0FBdUIsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFFL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUU7UUFDdEIsTUFBTSxJQUFJLGdDQUFtQixDQUMzQixxREFBcUQ7WUFDbkQscUJBQXFCLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FDN0MsQ0FBQztLQUNIO0lBRUQsT0FBTyxZQUFZLENBQUMsSUFBWSxDQUFDO0FBQ25DLENBQUM7QUFYRCxnREFXQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BhdGh9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7UHJvamVjdERlZmluaXRpb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3NyYy93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9ufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQge2dldFByb2plY3RUYXJnZXRPcHRpb25zfSBmcm9tICcuL3Byb2plY3QtdGFyZ2V0cyc7XG5cbi8qKiBMb29rcyBmb3IgdGhlIG1haW4gVHlwZVNjcmlwdCBmaWxlIGluIHRoZSBnaXZlbiBwcm9qZWN0IGFuZCByZXR1cm5zIGl0cyBwYXRoLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByb2plY3RNYWluRmlsZShwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbik6IFBhdGgge1xuICBjb25zdCBidWlsZE9wdGlvbnMgPSBnZXRQcm9qZWN0VGFyZ2V0T3B0aW9ucyhwcm9qZWN0LCAnYnVpbGQnKTtcblxuICBpZiAoIWJ1aWxkT3B0aW9ucy5tYWluKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oXG4gICAgICBgQ291bGQgbm90IGZpbmQgdGhlIHByb2plY3QgbWFpbiBmaWxlIGluc2lkZSBvZiB0aGUgYCArXG4gICAgICAgIGB3b3Jrc3BhY2UgY29uZmlnICgke3Byb2plY3Quc291cmNlUm9vdH0pYCxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGJ1aWxkT3B0aW9ucy5tYWluIGFzIFBhdGg7XG59XG4iXX0=
