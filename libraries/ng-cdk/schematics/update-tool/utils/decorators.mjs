'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.getCallDecoratorImport = exports.getAngularDecorators = void 0;
const ts = require('typescript');
const imports_1 = require('./imports');
/**
 * Gets all decorators which are imported from an Angular package
 * (e.g. "@angular/core") from a list of decorators.
 */
function getAngularDecorators(typeChecker, decorators) {
  return decorators
    .map(node => ({ node, importData: getCallDecoratorImport(typeChecker, node) }))
    .filter(({ importData }) => importData && importData.moduleName.startsWith('@angular/'))
    .map(({ node, importData }) => ({
      node: node,
      name: importData.symbolName,
    }));
}
exports.getAngularDecorators = getAngularDecorators;
function getCallDecoratorImport(typeChecker, decorator) {
  if (!ts.isCallExpression(decorator.expression)) {
    return null;
  }
  const valueExpr = decorator.expression.expression;
  let identifier = null;
  if (ts.isIdentifier(valueExpr)) {
    identifier = valueExpr;
  } else if (ts.isPropertyAccessExpression(valueExpr) && ts.isIdentifier(valueExpr.name)) {
    identifier = valueExpr.name;
  }
  return identifier ? (0, imports_1.getImportOfIdentifier)(identifier, typeChecker) : null;
}
exports.getCallDecoratorImport = getCallDecoratorImport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91cGRhdGUtdG9vbC91dGlscy9kZWNvcmF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQUVqQyx1Q0FBd0Q7QUFXeEQ7OztHQUdHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQ2xDLFdBQTJCLEVBQzNCLFVBQW1DO0lBRW5DLE9BQU8sVUFBVTtTQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDNUUsTUFBTSxDQUFDLENBQUMsRUFBQyxVQUFVLEVBQUMsRUFBRSxFQUFFLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3JGLEdBQUcsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVCLElBQUksRUFBRSxJQUErQjtRQUNyQyxJQUFJLEVBQUUsVUFBVyxDQUFDLFVBQVU7S0FDN0IsQ0FBQyxDQUFDLENBQUM7QUFDUixDQUFDO0FBWEQsb0RBV0M7QUFFRCxTQUFnQixzQkFBc0IsQ0FDcEMsV0FBMkIsRUFDM0IsU0FBdUI7SUFFdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDOUMsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUNELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO0lBQ2xELElBQUksVUFBVSxHQUF5QixJQUFJLENBQUM7SUFDNUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzlCLFVBQVUsR0FBRyxTQUFTLENBQUM7S0FDeEI7U0FBTSxJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN0RixVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztLQUM3QjtJQUNELE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFBLCtCQUFxQixFQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzVFLENBQUM7QUFmRCx3REFlQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuaW1wb3J0IHtnZXRJbXBvcnRPZklkZW50aWZpZXIsIEltcG9ydH0gZnJvbSAnLi9pbXBvcnRzJztcblxuZXhwb3J0IHR5cGUgQ2FsbEV4cHJlc3Npb25EZWNvcmF0b3IgPSB0cy5EZWNvcmF0b3IgJiB7XG4gIGV4cHJlc3Npb246IHRzLkNhbGxFeHByZXNzaW9uO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBOZ0RlY29yYXRvciB7XG4gIG5hbWU6IHN0cmluZztcbiAgbm9kZTogQ2FsbEV4cHJlc3Npb25EZWNvcmF0b3I7XG59XG5cbi8qKlxuICogR2V0cyBhbGwgZGVjb3JhdG9ycyB3aGljaCBhcmUgaW1wb3J0ZWQgZnJvbSBhbiBBbmd1bGFyIHBhY2thZ2VcbiAqIChlLmcuIFwiQGFuZ3VsYXIvY29yZVwiKSBmcm9tIGEgbGlzdCBvZiBkZWNvcmF0b3JzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5ndWxhckRlY29yYXRvcnMoXG4gIHR5cGVDaGVja2VyOiB0cy5UeXBlQ2hlY2tlcixcbiAgZGVjb3JhdG9yczogcmVhZG9ubHkgdHMuRGVjb3JhdG9yW10sXG4pOiByZWFkb25seSBOZ0RlY29yYXRvcltdIHtcbiAgcmV0dXJuIGRlY29yYXRvcnNcbiAgICAubWFwKG5vZGUgPT4gKHtub2RlLCBpbXBvcnREYXRhOiBnZXRDYWxsRGVjb3JhdG9ySW1wb3J0KHR5cGVDaGVja2VyLCBub2RlKX0pKVxuICAgIC5maWx0ZXIoKHtpbXBvcnREYXRhfSkgPT4gaW1wb3J0RGF0YSAmJiBpbXBvcnREYXRhLm1vZHVsZU5hbWUuc3RhcnRzV2l0aCgnQGFuZ3VsYXIvJykpXG4gICAgLm1hcCgoe25vZGUsIGltcG9ydERhdGF9KSA9PiAoe1xuICAgICAgbm9kZTogbm9kZSBhcyBDYWxsRXhwcmVzc2lvbkRlY29yYXRvcixcbiAgICAgIG5hbWU6IGltcG9ydERhdGEhLnN5bWJvbE5hbWUsXG4gICAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FsbERlY29yYXRvckltcG9ydChcbiAgdHlwZUNoZWNrZXI6IHRzLlR5cGVDaGVja2VyLFxuICBkZWNvcmF0b3I6IHRzLkRlY29yYXRvcixcbik6IEltcG9ydCB8IG51bGwge1xuICBpZiAoIXRzLmlzQ2FsbEV4cHJlc3Npb24oZGVjb3JhdG9yLmV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgdmFsdWVFeHByID0gZGVjb3JhdG9yLmV4cHJlc3Npb24uZXhwcmVzc2lvbjtcbiAgbGV0IGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXIgfCBudWxsID0gbnVsbDtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcih2YWx1ZUV4cHIpKSB7XG4gICAgaWRlbnRpZmllciA9IHZhbHVlRXhwcjtcbiAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbih2YWx1ZUV4cHIpICYmIHRzLmlzSWRlbnRpZmllcih2YWx1ZUV4cHIubmFtZSkpIHtcbiAgICBpZGVudGlmaWVyID0gdmFsdWVFeHByLm5hbWU7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXIgPyBnZXRJbXBvcnRPZklkZW50aWZpZXIoaWRlbnRpZmllciwgdHlwZUNoZWNrZXIpIDogbnVsbDtcbn1cbiJdfQ==
