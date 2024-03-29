'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPackageVersionFromPackageJson = exports.addPackageToPackageJson = void 0;
/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}
/** Adds a package to the package.json in the given host tree. */
function addPackageToPackageJson(host, pkg, version) {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json').toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json.dependencies) {
      json.dependencies = {};
    }
    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }
    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }
  return host;
}
exports.addPackageToPackageJson = addPackageToPackageJson;
/** Gets the version of the specified package by looking at the package.json in the given tree. */
function getPackageVersionFromPackageJson(tree, name) {
  if (!tree.exists('package.json')) {
    return null;
  }
  const packageJson = JSON.parse(tree.read('package.json').toString('utf8'));
  if (packageJson.dependencies && packageJson.dependencies[name]) {
    return packageJson.dependencies[name];
  }
  return null;
}
exports.getPackageVersionFromPackageJson = getPackageVersionFromPackageJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctYWRkL3BhY2thZ2UtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQVFIOzs7R0FHRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsR0FBMkI7SUFDbkQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztTQUNwQixJQUFJLEVBQUU7U0FDTixNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLEVBQUUsRUFBNEIsQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRCxpRUFBaUU7QUFDakUsU0FBZ0IsdUJBQXVCLENBQUMsSUFBVSxFQUFFLEdBQVcsRUFBRSxPQUFlO0lBQzlFLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRTtRQUMvQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBZ0IsQ0FBQztRQUVuRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUN4QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pEO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFsQkQsMERBa0JDO0FBRUQsa0dBQWtHO0FBQ2xHLFNBQWdCLGdDQUFnQyxDQUFDLElBQVUsRUFBRSxJQUFZO0lBQ3ZFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1FBQ2hDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFnQixDQUFDO0lBRTNGLElBQUksV0FBVyxDQUFDLFlBQVksSUFBSSxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzlELE9BQU8sV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVpELDRFQVlDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuXG5pbnRlcmZhY2UgUGFja2FnZUpzb24ge1xuICBkZXBlbmRlbmNpZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG59XG5cbi8qKlxuICogU29ydHMgdGhlIGtleXMgb2YgdGhlIGdpdmVuIG9iamVjdC5cbiAqIEByZXR1cm5zIEEgbmV3IG9iamVjdCBpbnN0YW5jZSB3aXRoIHNvcnRlZCBrZXlzXG4gKi9cbmZ1bmN0aW9uIHNvcnRPYmplY3RCeUtleXMob2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopXG4gICAgLnNvcnQoKVxuICAgIC5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XG4gICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTtcbn1cblxuLyoqIEFkZHMgYSBwYWNrYWdlIHRvIHRoZSBwYWNrYWdlLmpzb24gaW4gdGhlIGdpdmVuIGhvc3QgdHJlZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRQYWNrYWdlVG9QYWNrYWdlSnNvbihob3N0OiBUcmVlLCBwa2c6IHN0cmluZywgdmVyc2lvbjogc3RyaW5nKTogVHJlZSB7XG4gIGlmIChob3N0LmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICBjb25zdCBzb3VyY2VUZXh0ID0gaG9zdC5yZWFkKCdwYWNrYWdlLmpzb24nKSEudG9TdHJpbmcoJ3V0Zi04Jyk7XG4gICAgY29uc3QganNvbiA9IEpTT04ucGFyc2Uoc291cmNlVGV4dCkgYXMgUGFja2FnZUpzb247XG5cbiAgICBpZiAoIWpzb24uZGVwZW5kZW5jaWVzKSB7XG4gICAgICBqc29uLmRlcGVuZGVuY2llcyA9IHt9O1xuICAgIH1cblxuICAgIGlmICghanNvbi5kZXBlbmRlbmNpZXNbcGtnXSkge1xuICAgICAganNvbi5kZXBlbmRlbmNpZXNbcGtnXSA9IHZlcnNpb247XG4gICAgICBqc29uLmRlcGVuZGVuY2llcyA9IHNvcnRPYmplY3RCeUtleXMoanNvbi5kZXBlbmRlbmNpZXMpO1xuICAgIH1cblxuICAgIGhvc3Qub3ZlcndyaXRlKCdwYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCAyKSk7XG4gIH1cblxuICByZXR1cm4gaG9zdDtcbn1cblxuLyoqIEdldHMgdGhlIHZlcnNpb24gb2YgdGhlIHNwZWNpZmllZCBwYWNrYWdlIGJ5IGxvb2tpbmcgYXQgdGhlIHBhY2thZ2UuanNvbiBpbiB0aGUgZ2l2ZW4gdHJlZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlVmVyc2lvbkZyb21QYWNrYWdlSnNvbih0cmVlOiBUcmVlLCBuYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKCF0cmVlLmV4aXN0cygncGFja2FnZS5qc29uJykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZSh0cmVlLnJlYWQoJ3BhY2thZ2UuanNvbicpIS50b1N0cmluZygndXRmOCcpKSBhcyBQYWNrYWdlSnNvbjtcblxuICBpZiAocGFja2FnZUpzb24uZGVwZW5kZW5jaWVzICYmIHBhY2thZ2VKc29uLmRlcGVuZGVuY2llc1tuYW1lXSkge1xuICAgIHJldHVybiBwYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXNbbmFtZV07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==
