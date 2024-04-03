/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, } from '@angular/core';
/** Indicates how a view was changed by a {@link _ViewRepeater}. */
export var _ViewRepeaterOperation;
(function (_ViewRepeaterOperation) {
    /** The content of an existing view was replaced with another item. */
    _ViewRepeaterOperation[_ViewRepeaterOperation["REPLACED"] = 0] = "REPLACED";
    /** A new view was created with `createEmbeddedView`. */
    _ViewRepeaterOperation[_ViewRepeaterOperation["INSERTED"] = 1] = "INSERTED";
    /** The position of a view changed, but the content remains the same. */
    _ViewRepeaterOperation[_ViewRepeaterOperation["MOVED"] = 2] = "MOVED";
    /** A view was detached from the view container. */
    _ViewRepeaterOperation[_ViewRepeaterOperation["REMOVED"] = 3] = "REMOVED";
})(_ViewRepeaterOperation || (_ViewRepeaterOperation = {}));
/**
 * Injection token for {@link _ViewRepeater}. This token is for use by Angular Material only.
 * @docs-private
 */
export const _VIEW_REPEATER_STRATEGY = new InjectionToken('_ViewRepeater');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1yZXBlYXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvY29sbGVjdGlvbnMvdmlldy1yZXBlYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsY0FBYyxHQUtmLE1BQU0sZUFBZSxDQUFDO0FBNkN2QixtRUFBbUU7QUFDbkUsTUFBTSxDQUFOLElBQVksc0JBU1g7QUFURCxXQUFZLHNCQUFzQjtJQUNoQyxzRUFBc0U7SUFDdEUsMkVBQVEsQ0FBQTtJQUNSLHdEQUF3RDtJQUN4RCwyRUFBUSxDQUFBO0lBQ1Isd0VBQXdFO0lBQ3hFLHFFQUFLLENBQUE7SUFDTCxtREFBbUQ7SUFDbkQseUVBQU8sQ0FBQTtBQUNULENBQUMsRUFUVyxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBU2pDO0FBNkNEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUV2RCxlQUFlLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBJbmplY3Rpb25Ub2tlbixcbiAgSXRlcmFibGVDaGFuZ2VSZWNvcmQsXG4gIEl0ZXJhYmxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFRoZSBjb250ZXh0IGZvciBhbiBlbWJlZGRlZCB2aWV3IGluIHRoZSByZXBlYXRlcidzIHZpZXcgY29udGFpbmVyLlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0eXBlIGZvciB0aGUgZW1iZWRkZWQgdmlldydzICRpbXBsaWNpdCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBfVmlld1JlcGVhdGVySXRlbUNvbnRleHQ8VD4ge1xuICAkaW1wbGljaXQ/OiBUO1xufVxuXG4vKipcbiAqIFRoZSBhcmd1bWVudHMgbmVlZGVkIHRvIGNvbnN0cnVjdCBhbiBlbWJlZGRlZCB2aWV3IGZvciBhbiBpdGVtIGluIGEgdmlld1xuICogY29udGFpbmVyLlxuICpcbiAqIEB0ZW1wbGF0ZSBDIFRoZSB0eXBlIGZvciB0aGUgY29udGV4dCBwYXNzZWQgdG8gZWFjaCBlbWJlZGRlZCB2aWV3LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9WaWV3UmVwZWF0ZXJJdGVtSW5zZXJ0QXJnczxDPiB7XG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDPjtcbiAgY29udGV4dD86IEM7XG4gIGluZGV4PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgZmFjdG9yeSB0aGF0IGRlcml2ZXMgdGhlIGVtYmVkZGVkIHZpZXcgY29udGV4dCBmb3IgYW4gaXRlbSBpbiBhIHZpZXdcbiAqIGNvbnRhaW5lci5cbiAqXG4gKiBAdGVtcGxhdGUgVCBUaGUgdHlwZSBmb3IgdGhlIGVtYmVkZGVkIHZpZXcncyAkaW1wbGljaXQgcHJvcGVydHkuXG4gKiBAdGVtcGxhdGUgUiBUaGUgdHlwZSBmb3IgdGhlIGl0ZW0gaW4gZWFjaCBJdGVyYWJsZURpZmZlciBjaGFuZ2UgcmVjb3JkLlxuICogQHRlbXBsYXRlIEMgVGhlIHR5cGUgZm9yIHRoZSBjb250ZXh0IHBhc3NlZCB0byBlYWNoIGVtYmVkZGVkIHZpZXcuXG4gKi9cbmV4cG9ydCB0eXBlIF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dEZhY3Rvcnk8VCwgUiwgQyBleHRlbmRzIF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dDxUPj4gPSAoXG4gIHJlY29yZDogSXRlcmFibGVDaGFuZ2VSZWNvcmQ8Uj4sXG4gIGFkanVzdGVkUHJldmlvdXNJbmRleDogbnVtYmVyIHwgbnVsbCxcbiAgY3VycmVudEluZGV4OiBudW1iZXIgfCBudWxsLFxuKSA9PiBfVmlld1JlcGVhdGVySXRlbUluc2VydEFyZ3M8Qz47XG5cbi8qKlxuICogRXh0cmFjdHMgdGhlIHZhbHVlIG9mIGFuIGl0ZW0gZnJvbSBhbiB7QGxpbmsgSXRlcmFibGVDaGFuZ2VSZWNvcmR9LlxuICpcbiAqIEB0ZW1wbGF0ZSBUIFRoZSB0eXBlIGZvciB0aGUgZW1iZWRkZWQgdmlldydzICRpbXBsaWNpdCBwcm9wZXJ0eS5cbiAqIEB0ZW1wbGF0ZSBSIFRoZSB0eXBlIGZvciB0aGUgaXRlbSBpbiBlYWNoIEl0ZXJhYmxlRGlmZmVyIGNoYW5nZSByZWNvcmQuXG4gKi9cbmV4cG9ydCB0eXBlIF9WaWV3UmVwZWF0ZXJJdGVtVmFsdWVSZXNvbHZlcjxULCBSPiA9IChyZWNvcmQ6IEl0ZXJhYmxlQ2hhbmdlUmVjb3JkPFI+KSA9PiBUO1xuXG4vKiogSW5kaWNhdGVzIGhvdyBhIHZpZXcgd2FzIGNoYW5nZWQgYnkgYSB7QGxpbmsgX1ZpZXdSZXBlYXRlcn0uICovXG5leHBvcnQgZW51bSBfVmlld1JlcGVhdGVyT3BlcmF0aW9uIHtcbiAgLyoqIFRoZSBjb250ZW50IG9mIGFuIGV4aXN0aW5nIHZpZXcgd2FzIHJlcGxhY2VkIHdpdGggYW5vdGhlciBpdGVtLiAqL1xuICBSRVBMQUNFRCxcbiAgLyoqIEEgbmV3IHZpZXcgd2FzIGNyZWF0ZWQgd2l0aCBgY3JlYXRlRW1iZWRkZWRWaWV3YC4gKi9cbiAgSU5TRVJURUQsXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgYSB2aWV3IGNoYW5nZWQsIGJ1dCB0aGUgY29udGVudCByZW1haW5zIHRoZSBzYW1lLiAqL1xuICBNT1ZFRCxcbiAgLyoqIEEgdmlldyB3YXMgZGV0YWNoZWQgZnJvbSB0aGUgdmlldyBjb250YWluZXIuICovXG4gIFJFTU9WRUQsXG59XG5cbi8qKlxuICogTWV0YSBkYXRhIGRlc2NyaWJpbmcgdGhlIHN0YXRlIG9mIGEgdmlldyBhZnRlciBpdCB3YXMgdXBkYXRlZCBieSBhXG4gKiB7QGxpbmsgX1ZpZXdSZXBlYXRlcn0uXG4gKlxuICogQHRlbXBsYXRlIFIgVGhlIHR5cGUgZm9yIHRoZSBpdGVtIGluIGVhY2ggSXRlcmFibGVEaWZmZXIgY2hhbmdlIHJlY29yZC5cbiAqIEB0ZW1wbGF0ZSBDIFRoZSB0eXBlIGZvciB0aGUgY29udGV4dCBwYXNzZWQgdG8gZWFjaCBlbWJlZGRlZCB2aWV3LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9WaWV3UmVwZWF0ZXJJdGVtQ2hhbmdlPFIsIEM+IHtcbiAgLyoqIFRoZSB2aWV3J3MgY29udGV4dCBhZnRlciBpdCB3YXMgY2hhbmdlZC4gKi9cbiAgY29udGV4dD86IEM7XG4gIC8qKiBJbmRpY2F0ZXMgaG93IHRoZSB2aWV3IHdhcyBjaGFuZ2VkLiAqL1xuICBvcGVyYXRpb246IF9WaWV3UmVwZWF0ZXJPcGVyYXRpb247XG4gIC8qKiBUaGUgdmlldydzIGNvcnJlc3BvbmRpbmcgY2hhbmdlIHJlY29yZC4gKi9cbiAgcmVjb3JkOiBJdGVyYWJsZUNoYW5nZVJlY29yZDxSPjtcbn1cblxuLyoqXG4gKiBUeXBlIGZvciBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGEgdmlldyBoYXMgY2hhbmdlZC5cbiAqXG4gKiBAdGVtcGxhdGUgUiBUaGUgdHlwZSBmb3IgdGhlIGl0ZW0gaW4gZWFjaCBJdGVyYWJsZURpZmZlciBjaGFuZ2UgcmVjb3JkLlxuICogQHRlbXBsYXRlIEMgVGhlIHR5cGUgZm9yIHRoZSBjb250ZXh0IHBhc3NlZCB0byBlYWNoIGVtYmVkZGVkIHZpZXcuXG4gKi9cbmV4cG9ydCB0eXBlIF9WaWV3UmVwZWF0ZXJJdGVtQ2hhbmdlZDxSLCBDPiA9IChjaGFuZ2U6IF9WaWV3UmVwZWF0ZXJJdGVtQ2hhbmdlPFIsIEM+KSA9PiB2b2lkO1xuXG4vKipcbiAqIERlc2NyaWJlcyBhIHN0cmF0ZWd5IGZvciByZW5kZXJpbmcgaXRlbXMgaW4gYSB7QGxpbmsgVmlld0NvbnRhaW5lclJlZn0uXG4gKlxuICogQHRlbXBsYXRlIFQgVGhlIHR5cGUgZm9yIHRoZSBlbWJlZGRlZCB2aWV3J3MgJGltcGxpY2l0IHByb3BlcnR5LlxuICogQHRlbXBsYXRlIFIgVGhlIHR5cGUgZm9yIHRoZSBpdGVtIGluIGVhY2ggSXRlcmFibGVEaWZmZXIgY2hhbmdlIHJlY29yZC5cbiAqIEB0ZW1wbGF0ZSBDIFRoZSB0eXBlIGZvciB0aGUgY29udGV4dCBwYXNzZWQgdG8gZWFjaCBlbWJlZGRlZCB2aWV3LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIF9WaWV3UmVwZWF0ZXI8VCwgUiwgQyBleHRlbmRzIF9WaWV3UmVwZWF0ZXJJdGVtQ29udGV4dDxUPj4ge1xuICBhcHBseUNoYW5nZXMoXG4gICAgY2hhbmdlczogSXRlcmFibGVDaGFuZ2VzPFI+LFxuICAgIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgaXRlbUNvbnRleHRGYWN0b3J5OiBfVmlld1JlcGVhdGVySXRlbUNvbnRleHRGYWN0b3J5PFQsIFIsIEM+LFxuICAgIGl0ZW1WYWx1ZVJlc29sdmVyOiBfVmlld1JlcGVhdGVySXRlbVZhbHVlUmVzb2x2ZXI8VCwgUj4sXG4gICAgaXRlbVZpZXdDaGFuZ2VkPzogX1ZpZXdSZXBlYXRlckl0ZW1DaGFuZ2VkPFIsIEM+LFxuICApOiB2b2lkO1xuXG4gIGRldGFjaCgpOiB2b2lkO1xufVxuXG4vKipcbiAqIEluamVjdGlvbiB0b2tlbiBmb3Ige0BsaW5rIF9WaWV3UmVwZWF0ZXJ9LiBUaGlzIHRva2VuIGlzIGZvciB1c2UgYnkgQW5ndWxhciBNYXRlcmlhbCBvbmx5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48XG4gIF9WaWV3UmVwZWF0ZXI8dW5rbm93biwgdW5rbm93biwgX1ZpZXdSZXBlYXRlckl0ZW1Db250ZXh0PHVua25vd24+PlxuPignX1ZpZXdSZXBlYXRlcicpO1xuIl19