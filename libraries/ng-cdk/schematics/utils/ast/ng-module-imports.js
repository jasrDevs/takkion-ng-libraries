"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasNgModuleImport = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const ts = require("typescript");
/**
 * Whether the Angular module in the given path imports the specified module class name.
 */
function hasNgModuleImport(tree, modulePath, className) {
    const moduleFileContent = tree.read(modulePath);
    if (!moduleFileContent) {
        throw new schematics_1.SchematicsException(`Could not read Angular module file: ${modulePath}`);
    }
    const parsedFile = ts.createSourceFile(modulePath, moduleFileContent.toString(), ts.ScriptTarget.Latest, true);
    const ngModuleMetadata = findNgModuleMetadata(parsedFile);
    if (!ngModuleMetadata) {
        throw new schematics_1.SchematicsException(`Could not find NgModule declaration inside: "${modulePath}"`);
    }
    for (let property of ngModuleMetadata.properties) {
        if (!ts.isPropertyAssignment(property) ||
            property.name.getText() !== 'imports' ||
            !ts.isArrayLiteralExpression(property.initializer)) {
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
    }
    else if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
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
        if (ts.isDecorator(node) &&
            ts.isCallExpression(node.expression) &&
            isNgModuleCallExpression(node.expression)) {
            return node.expression.arguments[0];
        }
        else {
            nodeQueue.push(...node.getChildren());
        }
    }
    return null;
}
/** Whether the specified call expression is referring to a NgModule definition. */
function isNgModuleCallExpression(callExpression) {
    if (!callExpression.arguments.length ||
        !ts.isObjectLiteralExpression(callExpression.arguments[0])) {
        return false;
    }
    // The `NgModule` call expression name is never referring to a `PrivateIdentifier`.
    const decoratorIdentifier = resolveIdentifierOfExpression(callExpression.expression);
    return decoratorIdentifier ? decoratorIdentifier.text === 'NgModule' : false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbW9kdWxlLWltcG9ydHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvYXN0L25nLW1vZHVsZS1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILDJEQUFxRTtBQUNyRSxpQ0FBaUM7QUFFakM7O0dBRUc7QUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxJQUFVLEVBQUUsVUFBa0IsRUFBRSxTQUFpQjtJQUNqRixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFaEQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDdkIsTUFBTSxJQUFJLGdDQUFtQixDQUFDLHVDQUF1QyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQ3BDLFVBQVUsRUFDVixpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsRUFDNUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQ3RCLElBQUksQ0FDTCxDQUFDO0lBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUUxRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN0QixNQUFNLElBQUksZ0NBQW1CLENBQUMsZ0RBQWdELFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELEtBQUssSUFBSSxRQUFRLElBQUksZ0JBQWlCLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEQsSUFDRSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUM7WUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxTQUFTO1lBQ3JDLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFDbEQsQ0FBQztZQUNELFNBQVM7UUFDWCxDQUFDO1FBRUQsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEtBQUssU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUNuRixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBbENELDhDQWtDQztBQUVEOzs7R0FHRztBQUNILFNBQVMsNkJBQTZCLENBQUMsVUFBeUI7SUFDOUQsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztTQUFNLElBQUksRUFBRSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDekYsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBUyxvQkFBb0IsQ0FBQyxRQUFpQjtJQUM3QywyREFBMkQ7SUFDM0QsTUFBTSxTQUFTLEdBQWMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBRXpELE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUcsQ0FBQztRQUVoQyxJQUNFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3BDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDekMsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUErQixDQUFDO1FBQ3BFLENBQUM7YUFBTSxDQUFDO1lBQ04sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7SUFDSCxDQUFDO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsbUZBQW1GO0FBQ25GLFNBQVMsd0JBQXdCLENBQUMsY0FBaUM7SUFDakUsSUFDRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUNoQyxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzFELENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxtRkFBbUY7SUFDbkYsTUFBTSxtQkFBbUIsR0FBRyw2QkFBNkIsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDckYsT0FBTyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQy9FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTY2hlbWF0aWNzRXhjZXB0aW9uLCBUcmVlfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBXaGV0aGVyIHRoZSBBbmd1bGFyIG1vZHVsZSBpbiB0aGUgZ2l2ZW4gcGF0aCBpbXBvcnRzIHRoZSBzcGVjaWZpZWQgbW9kdWxlIGNsYXNzIG5hbWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNOZ01vZHVsZUltcG9ydCh0cmVlOiBUcmVlLCBtb2R1bGVQYXRoOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IG1vZHVsZUZpbGVDb250ZW50ID0gdHJlZS5yZWFkKG1vZHVsZVBhdGgpO1xuXG4gIGlmICghbW9kdWxlRmlsZUNvbnRlbnQpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IHJlYWQgQW5ndWxhciBtb2R1bGUgZmlsZTogJHttb2R1bGVQYXRofWApO1xuICB9XG5cbiAgY29uc3QgcGFyc2VkRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgbW9kdWxlUGF0aCxcbiAgICBtb2R1bGVGaWxlQ29udGVudC50b1N0cmluZygpLFxuICAgIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsXG4gICAgdHJ1ZSxcbiAgKTtcbiAgY29uc3QgbmdNb2R1bGVNZXRhZGF0YSA9IGZpbmROZ01vZHVsZU1ldGFkYXRhKHBhcnNlZEZpbGUpO1xuXG4gIGlmICghbmdNb2R1bGVNZXRhZGF0YSkge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDb3VsZCBub3QgZmluZCBOZ01vZHVsZSBkZWNsYXJhdGlvbiBpbnNpZGU6IFwiJHttb2R1bGVQYXRofVwiYCk7XG4gIH1cblxuICBmb3IgKGxldCBwcm9wZXJ0eSBvZiBuZ01vZHVsZU1ldGFkYXRhIS5wcm9wZXJ0aWVzKSB7XG4gICAgaWYgKFxuICAgICAgIXRzLmlzUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5KSB8fFxuICAgICAgcHJvcGVydHkubmFtZS5nZXRUZXh0KCkgIT09ICdpbXBvcnRzJyB8fFxuICAgICAgIXRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihwcm9wZXJ0eS5pbml0aWFsaXplcilcbiAgICApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0eS5pbml0aWFsaXplci5lbGVtZW50cy5zb21lKGVsZW1lbnQgPT4gZWxlbWVudC5nZXRUZXh0KCkgPT09IGNsYXNzTmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgbGFzdCBpZGVudGlmaWVyIHRoYXQgaXMgcGFydCBvZiB0aGUgZ2l2ZW4gZXhwcmVzc2lvbi4gVGhpcyBoZWxwcyByZXNvbHZpbmdcbiAqIGlkZW50aWZpZXJzIG9mIG5lc3RlZCBwcm9wZXJ0eSBhY2Nlc3MgZXhwcmVzc2lvbnMgKGUuZy4gbXlOYW1lc3BhY2UuY29yZS5OZ01vZHVsZSkuXG4gKi9cbmZ1bmN0aW9uIHJlc29sdmVJZGVudGlmaWVyT2ZFeHByZXNzaW9uKGV4cHJlc3Npb246IHRzLkV4cHJlc3Npb24pOiB0cy5JZGVudGlmaWVyIHwgbnVsbCB7XG4gIGlmICh0cy5pc0lkZW50aWZpZXIoZXhwcmVzc2lvbikpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbjtcbiAgfSBlbHNlIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihleHByZXNzaW9uKSAmJiB0cy5pc0lkZW50aWZpZXIoZXhwcmVzc2lvbi5uYW1lKSkge1xuICAgIHJldHVybiBleHByZXNzaW9uLm5hbWU7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogRmluZHMgYSBOZ01vZHVsZSBkZWNsYXJhdGlvbiB3aXRoaW4gdGhlIHNwZWNpZmllZCBUeXBlU2NyaXB0IG5vZGUgYW5kIHJldHVybnMgdGhlXG4gKiBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIGZvciBpdC4gVGhpcyBmdW5jdGlvbiBzZWFyY2hlcyBicmVhZHRoIGZpcnN0IGJlY2F1c2VcbiAqIE5nTW9kdWxlJ3MgYXJlIHVzdWFsbHkgbm90IG5lc3RlZCB3aXRoaW4gb3RoZXIgZXhwcmVzc2lvbnMgb3IgZGVjbGFyYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaW5kTmdNb2R1bGVNZXRhZGF0YShyb290Tm9kZTogdHMuTm9kZSk6IHRzLk9iamVjdExpdGVyYWxFeHByZXNzaW9uIHwgbnVsbCB7XG4gIC8vIEFkZCBpbW1lZGlhdGUgY2hpbGQgbm9kZXMgb2YgdGhlIHJvb3Qgbm9kZSB0byB0aGUgcXVldWUuXG4gIGNvbnN0IG5vZGVRdWV1ZTogdHMuTm9kZVtdID0gWy4uLnJvb3ROb2RlLmdldENoaWxkcmVuKCldO1xuXG4gIHdoaWxlIChub2RlUXVldWUubGVuZ3RoKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5vZGVRdWV1ZS5zaGlmdCgpITtcblxuICAgIGlmIChcbiAgICAgIHRzLmlzRGVjb3JhdG9yKG5vZGUpICYmXG4gICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUuZXhwcmVzc2lvbikgJiZcbiAgICAgIGlzTmdNb2R1bGVDYWxsRXhwcmVzc2lvbihub2RlLmV4cHJlc3Npb24pXG4gICAgKSB7XG4gICAgICByZXR1cm4gbm9kZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXSBhcyB0cy5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZVF1ZXVlLnB1c2goLi4ubm9kZS5nZXRDaGlsZHJlbigpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIFdoZXRoZXIgdGhlIHNwZWNpZmllZCBjYWxsIGV4cHJlc3Npb24gaXMgcmVmZXJyaW5nIHRvIGEgTmdNb2R1bGUgZGVmaW5pdGlvbi4gKi9cbmZ1bmN0aW9uIGlzTmdNb2R1bGVDYWxsRXhwcmVzc2lvbihjYWxsRXhwcmVzc2lvbjogdHMuQ2FsbEV4cHJlc3Npb24pOiBib29sZWFuIHtcbiAgaWYgKFxuICAgICFjYWxsRXhwcmVzc2lvbi5hcmd1bWVudHMubGVuZ3RoIHx8XG4gICAgIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oY2FsbEV4cHJlc3Npb24uYXJndW1lbnRzWzBdKVxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvLyBUaGUgYE5nTW9kdWxlYCBjYWxsIGV4cHJlc3Npb24gbmFtZSBpcyBuZXZlciByZWZlcnJpbmcgdG8gYSBgUHJpdmF0ZUlkZW50aWZpZXJgLlxuICBjb25zdCBkZWNvcmF0b3JJZGVudGlmaWVyID0gcmVzb2x2ZUlkZW50aWZpZXJPZkV4cHJlc3Npb24oY2FsbEV4cHJlc3Npb24uZXhwcmVzc2lvbik7XG4gIHJldHVybiBkZWNvcmF0b3JJZGVudGlmaWVyID8gZGVjb3JhdG9ySWRlbnRpZmllci50ZXh0ID09PSAnTmdNb2R1bGUnIDogZmFsc2U7XG59XG4iXX0=