'use strict';
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.hasNgModuleImport = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const ts = require('typescript');
/**
 * Whether the Angular module in the given path imports the specified module class name.
 */
function hasNgModuleImport(tree, modulePath, className) {
  const moduleFileContent = tree.read(modulePath);
  if (!moduleFileContent) {
    throw new schematics_1.SchematicsException(`Could not read Angular module file: ${modulePath}`);
  }
  const parsedFile = ts.createSourceFile(
    modulePath,
    moduleFileContent.toString(),
    ts.ScriptTarget.Latest,
    true
  );
  const ngModuleMetadata = findNgModuleMetadata(parsedFile);
  if (!ngModuleMetadata) {
    throw new schematics_1.SchematicsException(
      `Could not find NgModule declaration inside: "${modulePath}"`
    );
  }
  for (let property of ngModuleMetadata.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      property.name.getText() !== 'imports' ||
      !ts.isArrayLiteralExpression(property.initializer)
    ) {
      continue;
    }
    if (property.initializer.elements.some(element => element.getText() === className)) {
      return true;
    }
  }
  return false;
}
exports.hasNgModuleImport = hasNgModuleImport;
/**
 * Resolves the last identifier that is part of the given expression. This helps resolving
 * identifiers of nested property access expressions (e.g. myNamespace.core.NgModule).
 */
function resolveIdentifierOfExpression(expression) {
  if (ts.isIdentifier(expression)) {
    return expression;
  } else if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
    return expression.name;
  }
  return null;
}
/**
 * Finds a NgModule declaration within the specified TypeScript node and returns the
 * corresponding metadata for it. This function searches breadth first because
 * NgModule's are usually not nested within other expressions or declarations.
 */
function findNgModuleMetadata(rootNode) {
  // Add immediate child nodes of the root node to the queue.
  const nodeQueue = [...rootNode.getChildren()];
  while (nodeQueue.length) {
    const node = nodeQueue.shift();
    if (
      ts.isDecorator(node) &&
      ts.isCallExpression(node.expression) &&
      isNgModuleCallExpression(node.expression)
    ) {
      return node.expression.arguments[0];
    } else {
      nodeQueue.push(...node.getChildren());
    }
  }
  return null;
}
/** Whether the specified call expression is referring to a NgModule definition. */
function isNgModuleCallExpression(callExpression) {
  if (
    !callExpression.arguments.length ||
    !ts.isObjectLiteralExpression(callExpression.arguments[0])
  ) {
    return false;
  }
  // The `NgModule` call expression name is never referring to a `PrivateIdentifier`.
  const decoratorIdentifier = resolveIdentifierOfExpression(callExpression.expression);
  return decoratorIdentifier ? decoratorIdentifier.text === 'NgModule' : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbW9kdWxlLWltcG9ydHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvYXN0L25nLW1vZHVsZS1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILDJEQUFxRTtBQUNyRSxpQ0FBaUM7QUFFakM7O0dBRUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFVLEVBQUUsVUFBa0IsRUFBRSxTQUFpQjtJQUNqRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFaEQsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1FBQ3RCLE1BQU0sSUFBSSxnQ0FBbUIsQ0FBQyx1Q0FBdUMsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUNwRjtJQUVELE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDcEMsVUFBVSxFQUNWLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUM1QixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFDdEIsSUFBSSxDQUNMLENBQUM7SUFDRixNQUFNLGdCQUFnQixHQUFHLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRTFELElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtRQUNyQixNQUFNLElBQUksZ0NBQW1CLENBQUMsZ0RBQWdELFVBQVUsR0FBRyxDQUFDLENBQUM7S0FDOUY7SUFFRCxLQUFLLElBQUksUUFBUSxJQUFJLGdCQUFpQixDQUFDLFVBQVUsRUFBRTtRQUNqRCxJQUNFLENBQUMsRUFBRSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQztZQUNsQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLFNBQVM7WUFDckMsQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUNsRDtZQUNBLFNBQVM7U0FDVjtRQUVELElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQ2xGLE9BQU8sSUFBSSxDQUFDO1NBQ2I7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWxDRCw4Q0FrQ0M7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLDZCQUE2QixDQUFDLFVBQXlCO0lBQzlELElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUMvQixPQUFPLFVBQVUsQ0FBQztLQUNuQjtTQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hGLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQztLQUN4QjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLG9CQUFvQixDQUFDLFFBQWlCO0lBQzdDLDJEQUEyRDtJQUMzRCxNQUFNLFNBQVMsR0FBYyxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFFekQsT0FBTyxTQUFTLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUcsQ0FBQztRQUVoQyxJQUNFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3BDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDekM7WUFDQSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBK0IsQ0FBQztTQUNuRTthQUFNO1lBQ0wsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxtRkFBbUY7QUFDbkYsU0FBUyx3QkFBd0IsQ0FBQyxjQUFpQztJQUNqRSxJQUNFLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNO1FBQ2hDLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDMUQ7UUFDQSxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsbUZBQW1GO0lBQ25GLE1BQU0sbUJBQW1CLEdBQUcsNkJBQTZCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3JGLE9BQU8sbUJBQW1CLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUMvRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogV2hldGhlciB0aGUgQW5ndWxhciBtb2R1bGUgaW4gdGhlIGdpdmVuIHBhdGggaW1wb3J0cyB0aGUgc3BlY2lmaWVkIG1vZHVsZSBjbGFzcyBuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzTmdNb2R1bGVJbXBvcnQodHJlZTogVHJlZSwgbW9kdWxlUGF0aDogc3RyaW5nLCBjbGFzc05hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBtb2R1bGVGaWxlQ29udGVudCA9IHRyZWUucmVhZChtb2R1bGVQYXRoKTtcblxuICBpZiAoIW1vZHVsZUZpbGVDb250ZW50KSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENvdWxkIG5vdCByZWFkIEFuZ3VsYXIgbW9kdWxlIGZpbGU6ICR7bW9kdWxlUGF0aH1gKTtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlZEZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFxuICAgIG1vZHVsZVBhdGgsXG4gICAgbW9kdWxlRmlsZUNvbnRlbnQudG9TdHJpbmcoKSxcbiAgICB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LFxuICAgIHRydWUsXG4gICk7XG4gIGNvbnN0IG5nTW9kdWxlTWV0YWRhdGEgPSBmaW5kTmdNb2R1bGVNZXRhZGF0YShwYXJzZWRGaWxlKTtcblxuICBpZiAoIW5nTW9kdWxlTWV0YWRhdGEpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IGZpbmQgTmdNb2R1bGUgZGVjbGFyYXRpb24gaW5zaWRlOiBcIiR7bW9kdWxlUGF0aH1cImApO1xuICB9XG5cbiAgZm9yIChsZXQgcHJvcGVydHkgb2YgbmdNb2R1bGVNZXRhZGF0YSEucHJvcGVydGllcykge1xuICAgIGlmIChcbiAgICAgICF0cy5pc1Byb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSkgfHxcbiAgICAgIHByb3BlcnR5Lm5hbWUuZ2V0VGV4dCgpICE9PSAnaW1wb3J0cycgfHxcbiAgICAgICF0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24ocHJvcGVydHkuaW5pdGlhbGl6ZXIpXG4gICAgKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydHkuaW5pdGlhbGl6ZXIuZWxlbWVudHMuc29tZShlbGVtZW50ID0+IGVsZW1lbnQuZ2V0VGV4dCgpID09PSBjbGFzc05hbWUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGxhc3QgaWRlbnRpZmllciB0aGF0IGlzIHBhcnQgb2YgdGhlIGdpdmVuIGV4cHJlc3Npb24uIFRoaXMgaGVscHMgcmVzb2x2aW5nXG4gKiBpZGVudGlmaWVycyBvZiBuZXN0ZWQgcHJvcGVydHkgYWNjZXNzIGV4cHJlc3Npb25zIChlLmcuIG15TmFtZXNwYWNlLmNvcmUuTmdNb2R1bGUpLlxuICovXG5mdW5jdGlvbiByZXNvbHZlSWRlbnRpZmllck9mRXhwcmVzc2lvbihleHByZXNzaW9uOiB0cy5FeHByZXNzaW9uKTogdHMuSWRlbnRpZmllciB8IG51bGwge1xuICBpZiAodHMuaXNJZGVudGlmaWVyKGV4cHJlc3Npb24pKSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb247XG4gIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24oZXhwcmVzc2lvbikgJiYgdHMuaXNJZGVudGlmaWVyKGV4cHJlc3Npb24ubmFtZSkpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbi5uYW1lO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIEZpbmRzIGEgTmdNb2R1bGUgZGVjbGFyYXRpb24gd2l0aGluIHRoZSBzcGVjaWZpZWQgVHlwZVNjcmlwdCBub2RlIGFuZCByZXR1cm5zIHRoZVxuICogY29ycmVzcG9uZGluZyBtZXRhZGF0YSBmb3IgaXQuIFRoaXMgZnVuY3Rpb24gc2VhcmNoZXMgYnJlYWR0aCBmaXJzdCBiZWNhdXNlXG4gKiBOZ01vZHVsZSdzIGFyZSB1c3VhbGx5IG5vdCBuZXN0ZWQgd2l0aGluIG90aGVyIGV4cHJlc3Npb25zIG9yIGRlY2xhcmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmluZE5nTW9kdWxlTWV0YWRhdGEocm9vdE5vZGU6IHRzLk5vZGUpOiB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbiB8IG51bGwge1xuICAvLyBBZGQgaW1tZWRpYXRlIGNoaWxkIG5vZGVzIG9mIHRoZSByb290IG5vZGUgdG8gdGhlIHF1ZXVlLlxuICBjb25zdCBub2RlUXVldWU6IHRzLk5vZGVbXSA9IFsuLi5yb290Tm9kZS5nZXRDaGlsZHJlbigpXTtcblxuICB3aGlsZSAobm9kZVF1ZXVlLmxlbmd0aCkge1xuICAgIGNvbnN0IG5vZGUgPSBub2RlUXVldWUuc2hpZnQoKSE7XG5cbiAgICBpZiAoXG4gICAgICB0cy5pc0RlY29yYXRvcihub2RlKSAmJlxuICAgICAgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pICYmXG4gICAgICBpc05nTW9kdWxlQ2FsbEV4cHJlc3Npb24obm9kZS5leHByZXNzaW9uKVxuICAgICkge1xuICAgICAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF0gYXMgdHMuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb247XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVRdWV1ZS5wdXNoKC4uLm5vZGUuZ2V0Q2hpbGRyZW4oKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKiBXaGV0aGVyIHRoZSBzcGVjaWZpZWQgY2FsbCBleHByZXNzaW9uIGlzIHJlZmVycmluZyB0byBhIE5nTW9kdWxlIGRlZmluaXRpb24uICovXG5mdW5jdGlvbiBpc05nTW9kdWxlQ2FsbEV4cHJlc3Npb24oY2FsbEV4cHJlc3Npb246IHRzLkNhbGxFeHByZXNzaW9uKTogYm9vbGVhbiB7XG4gIGlmIChcbiAgICAhY2FsbEV4cHJlc3Npb24uYXJndW1lbnRzLmxlbmd0aCB8fFxuICAgICF0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKGNhbGxFeHByZXNzaW9uLmFyZ3VtZW50c1swXSlcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVGhlIGBOZ01vZHVsZWAgY2FsbCBleHByZXNzaW9uIG5hbWUgaXMgbmV2ZXIgcmVmZXJyaW5nIHRvIGEgYFByaXZhdGVJZGVudGlmaWVyYC5cbiAgY29uc3QgZGVjb3JhdG9ySWRlbnRpZmllciA9IHJlc29sdmVJZGVudGlmaWVyT2ZFeHByZXNzaW9uKGNhbGxFeHByZXNzaW9uLmV4cHJlc3Npb24pO1xuICByZXR1cm4gZGVjb3JhdG9ySWRlbnRpZmllciA/IGRlY29yYXRvcklkZW50aWZpZXIudGV4dCA9PT0gJ05nTW9kdWxlJyA6IGZhbHNlO1xufVxuIl19
