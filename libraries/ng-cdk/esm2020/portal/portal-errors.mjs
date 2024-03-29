/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Throws an exception when attempting to attach a null portal to a host.
 * @docs-private
 */
export function throwNullPortalError() {
  throw Error('Must provide a portal to attach');
}
/**
 * Throws an exception when attempting to attach a portal to a host that is already attached.
 * @docs-private
 */
export function throwPortalAlreadyAttachedError() {
  throw Error('Host already has a portal attached');
}
/**
 * Throws an exception when attempting to attach a portal to an already-disposed host.
 * @docs-private
 */
export function throwPortalOutletAlreadyDisposedError() {
  throw Error('This PortalOutlet has already been disposed');
}
/**
 * Throws an exception when attempting to attach an unknown portal type.
 * @docs-private
 */
export function throwUnknownPortalTypeError() {
  throw Error(
    'Attempting to attach an unknown Portal type. BasePortalOutlet accepts either ' +
      'a ComponentPortal or a TemplatePortal.'
  );
}
/**
 * Throws an exception when attempting to attach a portal to a null host.
 * @docs-private
 */
export function throwNullPortalOutletError() {
  throw Error('Attempting to attach a portal to a null PortalOutlet');
}
/**
 * Throws an exception when attempting to detach a portal that is not attached.
 * @docs-private
 */
export function throwNoPortalAttachedError() {
  throw Error('Attempting to detach a portal that is not attached to a host');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydGFsLWVycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvcG9ydGFsL3BvcnRhbC1lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLG9CQUFvQjtJQUNsQyxNQUFNLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsK0JBQStCO0lBQzdDLE1BQU0sS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVEOzs7R0FHRztBQUNILE1BQU0sVUFBVSxxQ0FBcUM7SUFDbkQsTUFBTSxLQUFLLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUM3RCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQjtJQUN6QyxNQUFNLEtBQUssQ0FDVCwrRUFBK0U7UUFDN0Usd0NBQXdDLENBQzNDLENBQUM7QUFDSixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLDBCQUEwQjtJQUN4QyxNQUFNLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsMEJBQTBCO0lBQ3hDLE1BQU0sS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7QUFDOUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIGF0dGFjaCBhIG51bGwgcG9ydGFsIHRvIGEgaG9zdC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TnVsbFBvcnRhbEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignTXVzdCBwcm92aWRlIGEgcG9ydGFsIHRvIGF0dGFjaCcpO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIGF0dGFjaCBhIHBvcnRhbCB0byBhIGhvc3QgdGhhdCBpcyBhbHJlYWR5IGF0dGFjaGVkLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dQb3J0YWxBbHJlYWR5QXR0YWNoZWRFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoJ0hvc3QgYWxyZWFkeSBoYXMgYSBwb3J0YWwgYXR0YWNoZWQnKTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gYXR0ZW1wdGluZyB0byBhdHRhY2ggYSBwb3J0YWwgdG8gYW4gYWxyZWFkeS1kaXNwb3NlZCBob3N0LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dQb3J0YWxPdXRsZXRBbHJlYWR5RGlzcG9zZWRFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoJ1RoaXMgUG9ydGFsT3V0bGV0IGhhcyBhbHJlYWR5IGJlZW4gZGlzcG9zZWQnKTtcbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gYXR0ZW1wdGluZyB0byBhdHRhY2ggYW4gdW5rbm93biBwb3J0YWwgdHlwZS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93VW5rbm93blBvcnRhbFR5cGVFcnJvcigpIHtcbiAgdGhyb3cgRXJyb3IoXG4gICAgJ0F0dGVtcHRpbmcgdG8gYXR0YWNoIGFuIHVua25vd24gUG9ydGFsIHR5cGUuIEJhc2VQb3J0YWxPdXRsZXQgYWNjZXB0cyBlaXRoZXIgJyArXG4gICAgICAnYSBDb21wb25lbnRQb3J0YWwgb3IgYSBUZW1wbGF0ZVBvcnRhbC4nLFxuICApO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIGF0dGFjaCBhIHBvcnRhbCB0byBhIG51bGwgaG9zdC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93TnVsbFBvcnRhbE91dGxldEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBhdHRhY2ggYSBwb3J0YWwgdG8gYSBudWxsIFBvcnRhbE91dGxldCcpO1xufVxuXG4vKipcbiAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBhdHRlbXB0aW5nIHRvIGRldGFjaCBhIHBvcnRhbCB0aGF0IGlzIG5vdCBhdHRhY2hlZC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93Tm9Qb3J0YWxBdHRhY2hlZEVycm9yKCkge1xuICB0aHJvdyBFcnJvcignQXR0ZW1wdGluZyB0byBkZXRhY2ggYSBwb3J0YWwgdGhhdCBpcyBub3QgYXR0YWNoZWQgdG8gYSBob3N0Jyk7XG59XG4iXX0=
