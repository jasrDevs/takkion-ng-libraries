'use strict';
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.getVersionUpgradeData = exports.cdkUpgradeData = void 0;
const version_changes_1 = require('../update-tool/version-changes');
const data_1 = require('./data');
/** Upgrade data for the Angular CDK. */
exports.cdkUpgradeData = {
  attributeSelectors: data_1.attributeSelectors,
  classNames: data_1.classNames,
  constructorChecks: data_1.constructorChecks,
  cssSelectors: data_1.cssSelectors,
  elementSelectors: data_1.elementSelectors,
  inputNames: data_1.inputNames,
  methodCallChecks: data_1.methodCallChecks,
  outputNames: data_1.outputNames,
  propertyNames: data_1.propertyNames,
  symbolRemoval: data_1.symbolRemoval,
};
/**
 * Gets the reduced upgrade data for the specified data key. The function reads out the
 * target version and upgrade data object from the migration and resolves the specified
 * data portion that is specifically tied to the target version.
 */
function getVersionUpgradeData(migration, dataName) {
  // Note that below we need to cast to `unknown` first TS doesn't infer the type of T correctly.
  return (0, version_changes_1.getChangesForTarget)(
    migration.targetVersion,
    migration.upgradeData[dataName]
  );
}
exports.getVersionUpgradeData = getVersionUpgradeData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBncmFkZS1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9zY2hlbWF0aWNzL25nLXVwZGF0ZS91cGdyYWRlLWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsb0VBQW1HO0FBQ25HLGlDQXFCZ0I7QUFFaEIsd0NBQXdDO0FBQzNCLFFBQUEsY0FBYyxHQUFnQjtJQUN6QyxrQkFBa0IsRUFBbEIseUJBQWtCO0lBQ2xCLFVBQVUsRUFBVixpQkFBVTtJQUNWLGlCQUFpQixFQUFqQix3QkFBaUI7SUFDakIsWUFBWSxFQUFaLG1CQUFZO0lBQ1osZ0JBQWdCLEVBQWhCLHVCQUFnQjtJQUNoQixVQUFVLEVBQVYsaUJBQVU7SUFDVixnQkFBZ0IsRUFBaEIsdUJBQWdCO0lBQ2hCLFdBQVcsRUFBWCxrQkFBVztJQUNYLGFBQWEsRUFBYixvQkFBYTtJQUNiLGFBQWEsRUFBYixvQkFBYTtDQUNkLENBQUM7QUFtQkY7Ozs7R0FJRztBQUNILFNBQWdCLHFCQUFxQixDQUduQyxTQUFpQyxFQUFFLFFBQVc7SUFDOUMsK0ZBQStGO0lBQy9GLE9BQU8sSUFBQSxxQ0FBbUIsRUFDeEIsU0FBUyxDQUFDLGFBQWEsRUFDdkIsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQWlDLENBQ2hFLENBQUM7QUFDSixDQUFDO0FBVEQsc0RBU0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb259IGZyb20gJy4uL3VwZGF0ZS10b29sL21pZ3JhdGlvbic7XG5pbXBvcnQge2dldENoYW5nZXNGb3JUYXJnZXQsIFZhbHVlT2ZDaGFuZ2VzLCBWZXJzaW9uQ2hhbmdlc30gZnJvbSAnLi4vdXBkYXRlLXRvb2wvdmVyc2lvbi1jaGFuZ2VzJztcbmltcG9ydCB7XG4gIGF0dHJpYnV0ZVNlbGVjdG9ycyxcbiAgQXR0cmlidXRlU2VsZWN0b3JVcGdyYWRlRGF0YSxcbiAgY2xhc3NOYW1lcyxcbiAgQ2xhc3NOYW1lVXBncmFkZURhdGEsXG4gIGNvbnN0cnVjdG9yQ2hlY2tzLFxuICBDb25zdHJ1Y3RvckNoZWNrc1VwZ3JhZGVEYXRhLFxuICBjc3NTZWxlY3RvcnMsXG4gIENzc1NlbGVjdG9yVXBncmFkZURhdGEsXG4gIGVsZW1lbnRTZWxlY3RvcnMsXG4gIEVsZW1lbnRTZWxlY3RvclVwZ3JhZGVEYXRhLFxuICBpbnB1dE5hbWVzLFxuICBJbnB1dE5hbWVVcGdyYWRlRGF0YSxcbiAgbWV0aG9kQ2FsbENoZWNrcyxcbiAgTWV0aG9kQ2FsbFVwZ3JhZGVEYXRhLFxuICBvdXRwdXROYW1lcyxcbiAgT3V0cHV0TmFtZVVwZ3JhZGVEYXRhLFxuICBwcm9wZXJ0eU5hbWVzLFxuICBQcm9wZXJ0eU5hbWVVcGdyYWRlRGF0YSxcbiAgU3ltYm9sUmVtb3ZhbFVwZ3JhZGVEYXRhLFxuICBzeW1ib2xSZW1vdmFsLFxufSBmcm9tICcuL2RhdGEnO1xuXG4vKiogVXBncmFkZSBkYXRhIGZvciB0aGUgQW5ndWxhciBDREsuICovXG5leHBvcnQgY29uc3QgY2RrVXBncmFkZURhdGE6IFVwZ3JhZGVEYXRhID0ge1xuICBhdHRyaWJ1dGVTZWxlY3RvcnMsXG4gIGNsYXNzTmFtZXMsXG4gIGNvbnN0cnVjdG9yQ2hlY2tzLFxuICBjc3NTZWxlY3RvcnMsXG4gIGVsZW1lbnRTZWxlY3RvcnMsXG4gIGlucHV0TmFtZXMsXG4gIG1ldGhvZENhbGxDaGVja3MsXG4gIG91dHB1dE5hbWVzLFxuICBwcm9wZXJ0eU5hbWVzLFxuICBzeW1ib2xSZW1vdmFsLFxufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgdGhhdCBkZXNjcmliZXMgdGhlIHVwZ3JhZGUgZGF0YSB0aGF0IG5lZWRzIHRvIGJlIGRlZmluZWQgd2hlbiB1c2luZyB0aGUgQ0RLXG4gKiB1cGdyYWRlIHJ1bGVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZ3JhZGVEYXRhIHtcbiAgYXR0cmlidXRlU2VsZWN0b3JzOiBWZXJzaW9uQ2hhbmdlczxBdHRyaWJ1dGVTZWxlY3RvclVwZ3JhZGVEYXRhPjtcbiAgY2xhc3NOYW1lczogVmVyc2lvbkNoYW5nZXM8Q2xhc3NOYW1lVXBncmFkZURhdGE+O1xuICBjb25zdHJ1Y3RvckNoZWNrczogVmVyc2lvbkNoYW5nZXM8Q29uc3RydWN0b3JDaGVja3NVcGdyYWRlRGF0YT47XG4gIGNzc1NlbGVjdG9yczogVmVyc2lvbkNoYW5nZXM8Q3NzU2VsZWN0b3JVcGdyYWRlRGF0YT47XG4gIGVsZW1lbnRTZWxlY3RvcnM6IFZlcnNpb25DaGFuZ2VzPEVsZW1lbnRTZWxlY3RvclVwZ3JhZGVEYXRhPjtcbiAgaW5wdXROYW1lczogVmVyc2lvbkNoYW5nZXM8SW5wdXROYW1lVXBncmFkZURhdGE+O1xuICBtZXRob2RDYWxsQ2hlY2tzOiBWZXJzaW9uQ2hhbmdlczxNZXRob2RDYWxsVXBncmFkZURhdGE+O1xuICBvdXRwdXROYW1lczogVmVyc2lvbkNoYW5nZXM8T3V0cHV0TmFtZVVwZ3JhZGVEYXRhPjtcbiAgcHJvcGVydHlOYW1lczogVmVyc2lvbkNoYW5nZXM8UHJvcGVydHlOYW1lVXBncmFkZURhdGE+O1xuICBzeW1ib2xSZW1vdmFsOiBWZXJzaW9uQ2hhbmdlczxTeW1ib2xSZW1vdmFsVXBncmFkZURhdGE+O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHJlZHVjZWQgdXBncmFkZSBkYXRhIGZvciB0aGUgc3BlY2lmaWVkIGRhdGEga2V5LiBUaGUgZnVuY3Rpb24gcmVhZHMgb3V0IHRoZVxuICogdGFyZ2V0IHZlcnNpb24gYW5kIHVwZ3JhZGUgZGF0YSBvYmplY3QgZnJvbSB0aGUgbWlncmF0aW9uIGFuZCByZXNvbHZlcyB0aGUgc3BlY2lmaWVkXG4gKiBkYXRhIHBvcnRpb24gdGhhdCBpcyBzcGVjaWZpY2FsbHkgdGllZCB0byB0aGUgdGFyZ2V0IHZlcnNpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWZXJzaW9uVXBncmFkZURhdGE8XG4gIFQgZXh0ZW5kcyBrZXlvZiBVcGdyYWRlRGF0YSxcbiAgVSA9IFZhbHVlT2ZDaGFuZ2VzPFVwZ3JhZGVEYXRhW1RdPixcbj4obWlncmF0aW9uOiBNaWdyYXRpb248VXBncmFkZURhdGE+LCBkYXRhTmFtZTogVCk6IFVbXSB7XG4gIC8vIE5vdGUgdGhhdCBiZWxvdyB3ZSBuZWVkIHRvIGNhc3QgdG8gYHVua25vd25gIGZpcnN0IFRTIGRvZXNuJ3QgaW5mZXIgdGhlIHR5cGUgb2YgVCBjb3JyZWN0bHkuXG4gIHJldHVybiBnZXRDaGFuZ2VzRm9yVGFyZ2V0PFU+KFxuICAgIG1pZ3JhdGlvbi50YXJnZXRWZXJzaW9uLFxuICAgIG1pZ3JhdGlvbi51cGdyYWRlRGF0YVtkYXRhTmFtZV0gYXMgdW5rbm93biBhcyBWZXJzaW9uQ2hhbmdlczxVPixcbiAgKTtcbn1cbiJdfQ==
