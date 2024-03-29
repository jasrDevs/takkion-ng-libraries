/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Creates a deep clone of an element. */
export function deepCloneNode(node) {
  const clone = node.cloneNode(true);
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  for (let i = 0; i < descendantsWithId.length; i++) {
    descendantsWithId[i].removeAttribute('id');
  }
  if (nodeName === 'canvas') {
    transferCanvasData(node, clone);
  } else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
    transferInputData(node, clone);
  }
  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}
/** Matches elements between an element and its clone and allows for their data to be cloned. */
function transferData(selector, node, clone, callback) {
  const descendantElements = node.querySelectorAll(selector);
  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll(selector);
    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}
// Counter for unique cloned radio button names.
let cloneUniqueId = 0;
/** Transfers the data of one input element to another. */
function transferInputData(source, clone) {
  // Browsers throw an error when assigning the value of a file input programmatically.
  if (clone.type !== 'file') {
    clone.value = source.value;
  }
  // Radio button `name` attributes must be unique for radio button groups
  // otherwise original radio buttons can lose their checked state
  // once the clone is inserted in the DOM.
  if (clone.type === 'radio' && clone.name) {
    clone.name = `tak-clone-${clone.name}-${cloneUniqueId++}`;
  }
}
/** Transfers the data of one canvas element to another. */
function transferCanvasData(source, clone) {
  const context = clone.getContext('2d');
  if (context) {
    // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
    // We can't do much about it so just ignore the error.
    try {
      context.drawImage(source, 0, 0);
    } catch {}
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvbmUtbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RvbS9jbG9uZS1ub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILDBDQUEwQztBQUMxQyxNQUFNLFVBQVUsYUFBYSxDQUFDLElBQWlCO0lBQzdDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFnQixDQUFDO0lBQ2xELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFN0Msa0ZBQWtGO0lBQ2xGLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFNUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqRCxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDNUM7SUFFRCxJQUFJLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDekIsa0JBQWtCLENBQUMsSUFBeUIsRUFBRSxLQUEwQixDQUFDLENBQUM7S0FDM0U7U0FBTSxJQUFJLFFBQVEsS0FBSyxPQUFPLElBQUksUUFBUSxLQUFLLFFBQVEsSUFBSSxRQUFRLEtBQUssVUFBVSxFQUFFO1FBQ25GLGlCQUFpQixDQUFDLElBQXdCLEVBQUUsS0FBeUIsQ0FBQyxDQUFDO0tBQ3hFO0lBRUQsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7SUFDeEQsWUFBWSxDQUFDLHlCQUF5QixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUN4RSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxnR0FBZ0c7QUFDaEcsU0FBUyxZQUFZLENBQ25CLFFBQWdCLEVBQ2hCLElBQWlCLEVBQ2pCLEtBQWtCLEVBQ2xCLFFBQXVDO0lBRXZDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFJLFFBQVEsQ0FBQyxDQUFDO0lBRTlELElBQUksa0JBQWtCLENBQUMsTUFBTSxFQUFFO1FBQzdCLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBSSxRQUFRLENBQUMsQ0FBQztRQUUxRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xELFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRDtLQUNGO0FBQ0gsQ0FBQztBQUVELGdEQUFnRDtBQUNoRCxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFFdEIsMERBQTBEO0FBQzFELFNBQVMsaUJBQWlCLENBQ3hCLE1BQWlDLEVBQ2pDLEtBQTREO0lBRTVELHFGQUFxRjtJQUNyRixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ3pCLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUM1QjtJQUVELHdFQUF3RTtJQUN4RSxnRUFBZ0U7SUFDaEUseUNBQXlDO0lBQ3pDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtRQUN4QyxLQUFLLENBQUMsSUFBSSxHQUFHLGFBQWEsS0FBSyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsRUFBRSxDQUFDO0tBQzNEO0FBQ0gsQ0FBQztBQUVELDJEQUEyRDtBQUMzRCxTQUFTLGtCQUFrQixDQUFDLE1BQXlCLEVBQUUsS0FBd0I7SUFDN0UsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV2QyxJQUFJLE9BQU8sRUFBRTtRQUNYLHdFQUF3RTtRQUN4RSxzREFBc0Q7UUFDdEQsSUFBSTtZQUNGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNqQztRQUFDLE1BQU0sR0FBRTtLQUNYO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogQ3JlYXRlcyBhIGRlZXAgY2xvbmUgb2YgYW4gZWxlbWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmVOb2RlKG5vZGU6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICBjb25zdCBjbG9uZSA9IG5vZGUuY2xvbmVOb2RlKHRydWUpIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCBkZXNjZW5kYW50c1dpdGhJZCA9IGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZF0nKTtcbiAgY29uc3Qgbm9kZU5hbWUgPSBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cbiAgLy8gUmVtb3ZlIHRoZSBgaWRgIHRvIGF2b2lkIGhhdmluZyBtdWx0aXBsZSBlbGVtZW50cyB3aXRoIHRoZSBzYW1lIGlkIG9uIHRoZSBwYWdlLlxuICBjbG9uZS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXNjZW5kYW50c1dpdGhJZC5sZW5ndGg7IGkrKykge1xuICAgIGRlc2NlbmRhbnRzV2l0aElkW2ldLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgfVxuXG4gIGlmIChub2RlTmFtZSA9PT0gJ2NhbnZhcycpIHtcbiAgICB0cmFuc2ZlckNhbnZhc0RhdGEobm9kZSBhcyBIVE1MQ2FudmFzRWxlbWVudCwgY2xvbmUgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xuICB9IGVsc2UgaWYgKG5vZGVOYW1lID09PSAnaW5wdXQnIHx8IG5vZGVOYW1lID09PSAnc2VsZWN0JyB8fCBub2RlTmFtZSA9PT0gJ3RleHRhcmVhJykge1xuICAgIHRyYW5zZmVySW5wdXREYXRhKG5vZGUgYXMgSFRNTElucHV0RWxlbWVudCwgY2xvbmUgYXMgSFRNTElucHV0RWxlbWVudCk7XG4gIH1cblxuICB0cmFuc2ZlckRhdGEoJ2NhbnZhcycsIG5vZGUsIGNsb25lLCB0cmFuc2ZlckNhbnZhc0RhdGEpO1xuICB0cmFuc2ZlckRhdGEoJ2lucHV0LCB0ZXh0YXJlYSwgc2VsZWN0Jywgbm9kZSwgY2xvbmUsIHRyYW5zZmVySW5wdXREYXRhKTtcbiAgcmV0dXJuIGNsb25lO1xufVxuXG4vKiogTWF0Y2hlcyBlbGVtZW50cyBiZXR3ZWVuIGFuIGVsZW1lbnQgYW5kIGl0cyBjbG9uZSBhbmQgYWxsb3dzIGZvciB0aGVpciBkYXRhIHRvIGJlIGNsb25lZC4gKi9cbmZ1bmN0aW9uIHRyYW5zZmVyRGF0YTxUIGV4dGVuZHMgRWxlbWVudD4oXG4gIHNlbGVjdG9yOiBzdHJpbmcsXG4gIG5vZGU6IEhUTUxFbGVtZW50LFxuICBjbG9uZTogSFRNTEVsZW1lbnQsXG4gIGNhbGxiYWNrOiAoc291cmNlOiBULCBjbG9uZTogVCkgPT4gdm9pZCxcbikge1xuICBjb25zdCBkZXNjZW5kYW50RWxlbWVudHMgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGw8VD4oc2VsZWN0b3IpO1xuXG4gIGlmIChkZXNjZW5kYW50RWxlbWVudHMubGVuZ3RoKSB7XG4gICAgY29uc3QgY2xvbmVFbGVtZW50cyA9IGNsb25lLnF1ZXJ5U2VsZWN0b3JBbGw8VD4oc2VsZWN0b3IpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXNjZW5kYW50RWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbGxiYWNrKGRlc2NlbmRhbnRFbGVtZW50c1tpXSwgY2xvbmVFbGVtZW50c1tpXSk7XG4gICAgfVxuICB9XG59XG5cbi8vIENvdW50ZXIgZm9yIHVuaXF1ZSBjbG9uZWQgcmFkaW8gYnV0dG9uIG5hbWVzLlxubGV0IGNsb25lVW5pcXVlSWQgPSAwO1xuXG4vKiogVHJhbnNmZXJzIHRoZSBkYXRhIG9mIG9uZSBpbnB1dCBlbGVtZW50IHRvIGFub3RoZXIuICovXG5mdW5jdGlvbiB0cmFuc2ZlcklucHV0RGF0YShcbiAgc291cmNlOiBFbGVtZW50ICYge3ZhbHVlOiBzdHJpbmd9LFxuICBjbG9uZTogRWxlbWVudCAmIHt2YWx1ZTogc3RyaW5nOyBuYW1lOiBzdHJpbmc7IHR5cGU6IHN0cmluZ30sXG4pIHtcbiAgLy8gQnJvd3NlcnMgdGhyb3cgYW4gZXJyb3Igd2hlbiBhc3NpZ25pbmcgdGhlIHZhbHVlIG9mIGEgZmlsZSBpbnB1dCBwcm9ncmFtbWF0aWNhbGx5LlxuICBpZiAoY2xvbmUudHlwZSAhPT0gJ2ZpbGUnKSB7XG4gICAgY2xvbmUudmFsdWUgPSBzb3VyY2UudmFsdWU7XG4gIH1cblxuICAvLyBSYWRpbyBidXR0b24gYG5hbWVgIGF0dHJpYnV0ZXMgbXVzdCBiZSB1bmlxdWUgZm9yIHJhZGlvIGJ1dHRvbiBncm91cHNcbiAgLy8gb3RoZXJ3aXNlIG9yaWdpbmFsIHJhZGlvIGJ1dHRvbnMgY2FuIGxvc2UgdGhlaXIgY2hlY2tlZCBzdGF0ZVxuICAvLyBvbmNlIHRoZSBjbG9uZSBpcyBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICBpZiAoY2xvbmUudHlwZSA9PT0gJ3JhZGlvJyAmJiBjbG9uZS5uYW1lKSB7XG4gICAgY2xvbmUubmFtZSA9IGBtYXQtY2xvbmUtJHtjbG9uZS5uYW1lfS0ke2Nsb25lVW5pcXVlSWQrK31gO1xuICB9XG59XG5cbi8qKiBUcmFuc2ZlcnMgdGhlIGRhdGEgb2Ygb25lIGNhbnZhcyBlbGVtZW50IHRvIGFub3RoZXIuICovXG5mdW5jdGlvbiB0cmFuc2ZlckNhbnZhc0RhdGEoc291cmNlOiBIVE1MQ2FudmFzRWxlbWVudCwgY2xvbmU6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gIGNvbnN0IGNvbnRleHQgPSBjbG9uZS5nZXRDb250ZXh0KCcyZCcpO1xuXG4gIGlmIChjb250ZXh0KSB7XG4gICAgLy8gSW4gc29tZSBjYXNlcyBgZHJhd0ltYWdlYCBjYW4gdGhyb3cgKGUuZy4gaWYgdGhlIGNhbnZhcyBzaXplIGlzIDB4MCkuXG4gICAgLy8gV2UgY2FuJ3QgZG8gbXVjaCBhYm91dCBpdCBzbyBqdXN0IGlnbm9yZSB0aGUgZXJyb3IuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKHNvdXJjZSwgMCwgMCk7XG4gICAgfSBjYXRjaCB7fVxuICB9XG59XG4iXX0=
