'use strict';
/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.hasPropertyNameText = exports.getPropertyNameText = void 0;
const ts = require('typescript');
/**
 * Gets the text of the given property name. Returns null if the property
 * name couldn't be determined statically.
 */
function getPropertyNameText(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteralLike(node)) {
    return node.text;
  }
  return null;
}
exports.getPropertyNameText = getPropertyNameText;
/** Checks whether the given property name has a text. */
function hasPropertyNameText(node) {
  return ts.isStringLiteral(node) || ts.isNumericLiteral(node) || ts.isIdentifier(node);
}
exports.hasPropertyNameText = hasPropertyNameText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvc2NoZW1hdGljcy91cGRhdGUtdG9vbC91dGlscy9wcm9wZXJ0eS1uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILGlDQUFpQztBQUtqQzs7O0dBR0c7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxJQUFxQjtJQUN2RCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUxELGtEQUtDO0FBRUQseURBQXlEO0FBQ3pELFNBQWdCLG1CQUFtQixDQUFDLElBQXFCO0lBQ3ZELE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RixDQUFDO0FBRkQsa0RBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKiBUeXBlIHRoYXQgZGVzY3JpYmVzIGEgcHJvcGVydHkgbmFtZSB3aXRoIGFuIG9idGFpbmFibGUgdGV4dC4gKi9cbnR5cGUgUHJvcGVydHlOYW1lV2l0aFRleHQgPSBFeGNsdWRlPHRzLlByb3BlcnR5TmFtZSwgdHMuQ29tcHV0ZWRQcm9wZXJ0eU5hbWU+O1xuXG4vKipcbiAqIEdldHMgdGhlIHRleHQgb2YgdGhlIGdpdmVuIHByb3BlcnR5IG5hbWUuIFJldHVybnMgbnVsbCBpZiB0aGUgcHJvcGVydHlcbiAqIG5hbWUgY291bGRuJ3QgYmUgZGV0ZXJtaW5lZCBzdGF0aWNhbGx5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvcGVydHlOYW1lVGV4dChub2RlOiB0cy5Qcm9wZXJ0eU5hbWUpOiBzdHJpbmcgfCBudWxsIHtcbiAgaWYgKHRzLmlzSWRlbnRpZmllcihub2RlKSB8fCB0cy5pc1N0cmluZ0xpdGVyYWxMaWtlKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUudGV4dDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0eSBuYW1lIGhhcyBhIHRleHQuICovXG5leHBvcnQgZnVuY3Rpb24gaGFzUHJvcGVydHlOYW1lVGV4dChub2RlOiB0cy5Qcm9wZXJ0eU5hbWUpOiBub2RlIGlzIFByb3BlcnR5TmFtZVdpdGhUZXh0IHtcbiAgcmV0dXJuIHRzLmlzU3RyaW5nTGl0ZXJhbChub2RlKSB8fCB0cy5pc051bWVyaWNMaXRlcmFsKG5vZGUpIHx8IHRzLmlzSWRlbnRpZmllcihub2RlKTtcbn1cbiJdfQ==
