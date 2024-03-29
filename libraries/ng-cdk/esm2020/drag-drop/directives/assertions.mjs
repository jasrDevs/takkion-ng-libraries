/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Asserts that a particular node is an element.
 * @param node Node to be checked.
 * @param name Name to attach to the error message.
 */
export function assertElementNode(node, name) {
  if (node.nodeType !== 1) {
    throw Error(
      `${name} must be attached to an element node. ` + `Currently attached to "${node.nodeName}".`
    );
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXJ0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RpcmVjdGl2ZXMvYXNzZXJ0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLGlCQUFpQixDQUFDLElBQVUsRUFBRSxJQUFZO0lBQ3hELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7UUFDdkIsTUFBTSxLQUFLLENBQ1QsR0FBRyxJQUFJLHdDQUF3QyxHQUFHLDBCQUEwQixJQUFJLENBQUMsUUFBUSxJQUFJLENBQzlGLENBQUM7S0FDSDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBBc3NlcnRzIHRoYXQgYSBwYXJ0aWN1bGFyIG5vZGUgaXMgYW4gZWxlbWVudC5cbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gYmUgY2hlY2tlZC5cbiAqIEBwYXJhbSBuYW1lIE5hbWUgdG8gYXR0YWNoIHRvIHRoZSBlcnJvciBtZXNzYWdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0RWxlbWVudE5vZGUobm9kZTogTm9kZSwgbmFtZTogc3RyaW5nKTogYXNzZXJ0cyBub2RlIGlzIEhUTUxFbGVtZW50IHtcbiAgaWYgKG5vZGUubm9kZVR5cGUgIT09IDEpIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIGAke25hbWV9IG11c3QgYmUgYXR0YWNoZWQgdG8gYW4gZWxlbWVudCBub2RlLiBgICsgYEN1cnJlbnRseSBhdHRhY2hlZCB0byBcIiR7bm9kZS5ub2RlTmFtZX1cIi5gLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==
