'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.findModuleFromOptions =
  exports.addModuleImportToModule =
  exports.addModuleImportToRootModule =
  exports.parseSourceFile =
    void 0;
const schematics_1 = require('@angular-devkit/schematics');
const change_1 = require('@schematics/angular/utility/change');
const workspace_1 = require('@schematics/angular/utility/workspace');
const find_module_1 = require('@schematics/angular/utility/find-module');
const ast_utils_1 = require('@schematics/angular/utility/ast-utils');
const ng_ast_utils_1 = require('@schematics/angular/utility/ng-ast-utils');
const ts = require('typescript');
const project_main_file_1 = require('./project-main-file');
/** Reads file given path and returns TypeScript source file. */
function parseSourceFile(host, path) {
  const buffer = host.read(path);
  if (!buffer) {
    throw new schematics_1.SchematicsException(`Could not find file for path: ${path}`);
  }
  return ts.createSourceFile(path, buffer.toString(), ts.ScriptTarget.Latest, true);
}
exports.parseSourceFile = parseSourceFile;
/** Import and add module to root app module. */
function addModuleImportToRootModule(host, moduleName, src, project) {
  const modulePath = (0, ng_ast_utils_1.getAppModulePath)(
    host,
    (0, project_main_file_1.getProjectMainFile)(project)
  );
  addModuleImportToModule(host, modulePath, moduleName, src);
}
exports.addModuleImportToRootModule = addModuleImportToRootModule;
/**
 * Import and add module to specific module path.
 * @param host the tree we are updating
 * @param modulePath src location of the module to import
 * @param moduleName name of module to import
 * @param src src location to import
 */
function addModuleImportToModule(host, modulePath, moduleName, src) {
  const moduleSource = parseSourceFile(host, modulePath);
  if (!moduleSource) {
    throw new schematics_1.SchematicsException(`Module not found: ${modulePath}`);
  }
  const changes = (0, ast_utils_1.addImportToModule)(moduleSource, modulePath, moduleName, src);
  const recorder = host.beginUpdate(modulePath);
  changes.forEach(change => {
    if (change instanceof change_1.InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  });
  host.commitUpdate(recorder);
}
exports.addModuleImportToModule = addModuleImportToModule;
/** Wraps the internal find module from options with undefined path handling  */
async function findModuleFromOptions(host, options) {
  const workspace = await (0, workspace_1.getWorkspace)(host);
  if (!options.project) {
    options.project = Array.from(workspace.projects.keys())[0];
  }
  const project = workspace.projects.get(options.project);
  if (options.path === undefined) {
    options.path = `/${project.root}/src/app`;
  }
  return (0, find_module_1.findModuleFromOptions)(host, options);
}
exports.findModuleFromOptions = findModuleFromOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL3V0aWxzL2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCwyREFBcUU7QUFFckUsK0RBQWdFO0FBQ2hFLHFFQUFtRTtBQUNuRSx5RUFBb0c7QUFDcEcscUVBQXdFO0FBQ3hFLDJFQUEwRTtBQUUxRSxpQ0FBaUM7QUFDakMsMkRBQXVEO0FBRXZELGdFQUFnRTtBQUNoRSxTQUFnQixlQUFlLENBQUMsSUFBVSxFQUFFLElBQVk7SUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxJQUFJLGdDQUFtQixDQUFDLGlDQUFpQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3hFO0lBQ0QsT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRixDQUFDO0FBTkQsMENBTUM7QUFFRCxnREFBZ0Q7QUFDaEQsU0FBZ0IsMkJBQTJCLENBQ3pDLElBQVUsRUFDVixVQUFrQixFQUNsQixHQUFXLEVBQ1gsT0FBMEI7SUFFMUIsTUFBTSxVQUFVLEdBQUcsSUFBQSwrQkFBZ0IsRUFBQyxJQUFJLEVBQUUsSUFBQSxzQ0FBa0IsRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLHVCQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFSRCxrRUFRQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLHVCQUF1QixDQUNyQyxJQUFVLEVBQ1YsVUFBa0IsRUFDbEIsVUFBa0IsRUFDbEIsR0FBVztJQUVYLE1BQU0sWUFBWSxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFFdkQsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNqQixNQUFNLElBQUksZ0NBQW1CLENBQUMscUJBQXFCLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDbEU7SUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFBLDZCQUFpQixFQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFOUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2QixJQUFJLE1BQU0sWUFBWSxxQkFBWSxFQUFFO1lBQ2xDLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQXRCRCwwREFzQkM7QUFFRCxnRkFBZ0Y7QUFDekUsS0FBSyxVQUFVLHFCQUFxQixDQUN6QyxJQUFVLEVBQ1YsT0FBeUI7SUFFekIsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFBLHdCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFFM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7UUFDcEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1RDtJQUVELE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUUsQ0FBQztJQUV6RCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxVQUFVLENBQUM7S0FDM0M7SUFFRCxPQUFPLElBQUEsbUNBQWtCLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFqQkQsc0RBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtTY2hlbWEgYXMgQ29tcG9uZW50T3B0aW9uc30gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci9jb21wb25lbnQvc2NoZW1hJztcbmltcG9ydCB7SW5zZXJ0Q2hhbmdlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvY2hhbmdlJztcbmltcG9ydCB7Z2V0V29ya3NwYWNlfSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvd29ya3NwYWNlJztcbmltcG9ydCB7ZmluZE1vZHVsZUZyb21PcHRpb25zIGFzIGludGVybmFsRmluZE1vZHVsZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2ZpbmQtbW9kdWxlJztcbmltcG9ydCB7YWRkSW1wb3J0VG9Nb2R1bGV9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS9hc3QtdXRpbHMnO1xuaW1wb3J0IHtnZXRBcHBNb2R1bGVQYXRofSBmcm9tICdAc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvbmctYXN0LXV0aWxzJztcbmltcG9ydCB7UHJvamVjdERlZmluaXRpb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3NyYy93b3Jrc3BhY2UnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge2dldFByb2plY3RNYWluRmlsZX0gZnJvbSAnLi9wcm9qZWN0LW1haW4tZmlsZSc7XG5cbi8qKiBSZWFkcyBmaWxlIGdpdmVuIHBhdGggYW5kIHJldHVybnMgVHlwZVNjcmlwdCBzb3VyY2UgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNvdXJjZUZpbGUoaG9zdDogVHJlZSwgcGF0aDogc3RyaW5nKTogdHMuU291cmNlRmlsZSB7XG4gIGNvbnN0IGJ1ZmZlciA9IGhvc3QucmVhZChwYXRoKTtcbiAgaWYgKCFidWZmZXIpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IGZpbmQgZmlsZSBmb3IgcGF0aDogJHtwYXRofWApO1xuICB9XG4gIHJldHVybiB0cy5jcmVhdGVTb3VyY2VGaWxlKHBhdGgsIGJ1ZmZlci50b1N0cmluZygpLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCB0cnVlKTtcbn1cblxuLyoqIEltcG9ydCBhbmQgYWRkIG1vZHVsZSB0byByb290IGFwcCBtb2R1bGUuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkTW9kdWxlSW1wb3J0VG9Sb290TW9kdWxlKFxuICBob3N0OiBUcmVlLFxuICBtb2R1bGVOYW1lOiBzdHJpbmcsXG4gIHNyYzogc3RyaW5nLFxuICBwcm9qZWN0OiBQcm9qZWN0RGVmaW5pdGlvbixcbikge1xuICBjb25zdCBtb2R1bGVQYXRoID0gZ2V0QXBwTW9kdWxlUGF0aChob3N0LCBnZXRQcm9qZWN0TWFpbkZpbGUocHJvamVjdCkpO1xuICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShob3N0LCBtb2R1bGVQYXRoLCBtb2R1bGVOYW1lLCBzcmMpO1xufVxuXG4vKipcbiAqIEltcG9ydCBhbmQgYWRkIG1vZHVsZSB0byBzcGVjaWZpYyBtb2R1bGUgcGF0aC5cbiAqIEBwYXJhbSBob3N0IHRoZSB0cmVlIHdlIGFyZSB1cGRhdGluZ1xuICogQHBhcmFtIG1vZHVsZVBhdGggc3JjIGxvY2F0aW9uIG9mIHRoZSBtb2R1bGUgdG8gaW1wb3J0XG4gKiBAcGFyYW0gbW9kdWxlTmFtZSBuYW1lIG9mIG1vZHVsZSB0byBpbXBvcnRcbiAqIEBwYXJhbSBzcmMgc3JjIGxvY2F0aW9uIHRvIGltcG9ydFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoXG4gIGhvc3Q6IFRyZWUsXG4gIG1vZHVsZVBhdGg6IHN0cmluZyxcbiAgbW9kdWxlTmFtZTogc3RyaW5nLFxuICBzcmM6IHN0cmluZyxcbikge1xuICBjb25zdCBtb2R1bGVTb3VyY2UgPSBwYXJzZVNvdXJjZUZpbGUoaG9zdCwgbW9kdWxlUGF0aCk7XG5cbiAgaWYgKCFtb2R1bGVTb3VyY2UpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgTW9kdWxlIG5vdCBmb3VuZDogJHttb2R1bGVQYXRofWApO1xuICB9XG5cbiAgY29uc3QgY2hhbmdlcyA9IGFkZEltcG9ydFRvTW9kdWxlKG1vZHVsZVNvdXJjZSwgbW9kdWxlUGF0aCwgbW9kdWxlTmFtZSwgc3JjKTtcbiAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1vZHVsZVBhdGgpO1xuXG4gIGNoYW5nZXMuZm9yRWFjaChjaGFuZ2UgPT4ge1xuICAgIGlmIChjaGFuZ2UgaW5zdGFuY2VvZiBJbnNlcnRDaGFuZ2UpIHtcbiAgICAgIHJlY29yZGVyLmluc2VydExlZnQoY2hhbmdlLnBvcywgY2hhbmdlLnRvQWRkKTtcbiAgICB9XG4gIH0pO1xuXG4gIGhvc3QuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcbn1cblxuLyoqIFdyYXBzIHRoZSBpbnRlcm5hbCBmaW5kIG1vZHVsZSBmcm9tIG9wdGlvbnMgd2l0aCB1bmRlZmluZWQgcGF0aCBoYW5kbGluZyAgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaW5kTW9kdWxlRnJvbU9wdGlvbnMoXG4gIGhvc3Q6IFRyZWUsXG4gIG9wdGlvbnM6IENvbXBvbmVudE9wdGlvbnMsXG4pOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCB3b3Jrc3BhY2UgPSBhd2FpdCBnZXRXb3Jrc3BhY2UoaG9zdCk7XG5cbiAgaWYgKCFvcHRpb25zLnByb2plY3QpIHtcbiAgICBvcHRpb25zLnByb2plY3QgPSBBcnJheS5mcm9tKHdvcmtzcGFjZS5wcm9qZWN0cy5rZXlzKCkpWzBdO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdCA9IHdvcmtzcGFjZS5wcm9qZWN0cy5nZXQob3B0aW9ucy5wcm9qZWN0KSE7XG5cbiAgaWYgKG9wdGlvbnMucGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgb3B0aW9ucy5wYXRoID0gYC8ke3Byb2plY3Qucm9vdH0vc3JjL2FwcGA7XG4gIH1cblxuICByZXR1cm4gaW50ZXJuYWxGaW5kTW9kdWxlKGhvc3QsIG9wdGlvbnMpO1xufVxuIl19
