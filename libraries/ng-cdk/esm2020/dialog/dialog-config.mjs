/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Configuration for opening a modal dialog. */
export class DialogConfig {
  constructor() {
    /** The ARIA role of the dialog element. */
    this.role = 'dialog';
    /** Optional CSS class or classes applied to the overlay panel. */
    this.panelClass = '';
    /** Whether the dialog has a backdrop. */
    this.hasBackdrop = true;
    /** Optional CSS class or classes applied to the overlay backdrop. */
    this.backdropClass = '';
    /** Whether the dialog closes with the escape key or pointer events outside the panel element. */
    this.disableClose = false;
    /** Width of the dialog. */
    this.width = '';
    /** Height of the dialog. */
    this.height = '';
    /** Data being injected into the child component. */
    this.data = null;
    /** ID of the element that describes the dialog. */
    this.ariaDescribedBy = null;
    /** ID of the element that labels the dialog. */
    this.ariaLabelledBy = null;
    /** Dialog label applied via `aria-label` */
    this.ariaLabel = null;
    /** Whether this is a modal dialog. Used to set the `aria-modal` attribute. */
    this.ariaModal = true;
    /**
     * Where the dialog should focus on open.
     * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
     * AutoFocusTarget instead.
     */
    this.autoFocus = 'first-tabbable';
    /**
     * Whether the dialog should restore focus to the previously-focused element upon closing.
     * Has the following behavior based on the type that is passed in:
     * - `boolean` - when true, will return focus to the element that was focused before the dialog
     *    was opened, otherwise won't restore focus at all.
     * - `string` - focus will be restored to the first element that matches the CSS selector.
     * - `HTMLElement` - focus will be restored to the specific element.
     */
    this.restoreFocus = true;
    /**
     * Whether the dialog should close when the user navigates backwards or forwards through browser
     * history. This does not apply to navigation via anchor element unless using URL-hash based
     * routing (`HashLocationStrategy` in the Angular router).
     */
    this.closeOnNavigation = true;
    /**
     * Whether the dialog should close when the dialog service is destroyed. This is useful if
     * another service is wrapping the dialog and is managing the destruction instead.
     */
    this.closeOnDestroy = true;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZGlhbG9nL2RpYWxvZy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBbUJILGdEQUFnRDtBQUNoRCxNQUFNLE9BQU8sWUFBWTtJQUF6QjtRQWtCRSwyQ0FBMkM7UUFDM0MsU0FBSSxHQUFnQixRQUFRLENBQUM7UUFFN0Isa0VBQWtFO1FBQ2xFLGVBQVUsR0FBdUIsRUFBRSxDQUFDO1FBRXBDLHlDQUF5QztRQUN6QyxnQkFBVyxHQUFhLElBQUksQ0FBQztRQUU3QixxRUFBcUU7UUFDckUsa0JBQWEsR0FBdUIsRUFBRSxDQUFDO1FBRXZDLGlHQUFpRztRQUNqRyxpQkFBWSxHQUFhLEtBQUssQ0FBQztRQUUvQiwyQkFBMkI7UUFDM0IsVUFBSyxHQUFZLEVBQUUsQ0FBQztRQUVwQiw0QkFBNEI7UUFDNUIsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQWlCckIsb0RBQW9EO1FBQ3BELFNBQUksR0FBYyxJQUFJLENBQUM7UUFLdkIsbURBQW1EO1FBQ25ELG9CQUFlLEdBQW1CLElBQUksQ0FBQztRQUV2QyxnREFBZ0Q7UUFDaEQsbUJBQWMsR0FBbUIsSUFBSSxDQUFDO1FBRXRDLDRDQUE0QztRQUM1QyxjQUFTLEdBQW1CLElBQUksQ0FBQztRQUVqQyw4RUFBOEU7UUFDOUUsY0FBUyxHQUFhLElBQUksQ0FBQztRQUUzQjs7OztXQUlHO1FBQ0gsY0FBUyxHQUF3QyxnQkFBZ0IsQ0FBQztRQUVsRTs7Ozs7OztXQU9HO1FBQ0gsaUJBQVksR0FBb0MsSUFBSSxDQUFDO1FBUXJEOzs7O1dBSUc7UUFDSCxzQkFBaUIsR0FBYSxJQUFJLENBQUM7UUFFbkM7OztXQUdHO1FBQ0gsbUJBQWMsR0FBYSxJQUFJLENBQUM7SUE4QmxDLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIEluamVjdG9yLFxuICBTdGF0aWNQcm92aWRlcixcbiAgVHlwZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtQb3NpdGlvblN0cmF0ZWd5LCBTY3JvbGxTdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtCYXNlUG9ydGFsT3V0bGV0fSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcblxuLyoqIE9wdGlvbnMgZm9yIHdoZXJlIHRvIHNldCBmb2N1cyB0byBhdXRvbWF0aWNhbGx5IG9uIGRpYWxvZyBvcGVuICovXG5leHBvcnQgdHlwZSBBdXRvRm9jdXNUYXJnZXQgPSAnZGlhbG9nJyB8ICdmaXJzdC10YWJiYWJsZScgfCAnZmlyc3QtaGVhZGluZyc7XG5cbi8qKiBWYWxpZCBBUklBIHJvbGVzIGZvciBhIGRpYWxvZy4gKi9cbmV4cG9ydCB0eXBlIERpYWxvZ1JvbGUgPSAnZGlhbG9nJyB8ICdhbGVydGRpYWxvZyc7XG5cbi8qKiBDb25maWd1cmF0aW9uIGZvciBvcGVuaW5nIGEgbW9kYWwgZGlhbG9nLiAqL1xuZXhwb3J0IGNsYXNzIERpYWxvZ0NvbmZpZzxEID0gdW5rbm93biwgUiA9IHVua25vd24sIEMgZXh0ZW5kcyBCYXNlUG9ydGFsT3V0bGV0ID0gQmFzZVBvcnRhbE91dGxldD4ge1xuICAvKipcbiAgICogV2hlcmUgdGhlIGF0dGFjaGVkIGNvbXBvbmVudCBzaG91bGQgbGl2ZSBpbiBBbmd1bGFyJ3MgKmxvZ2ljYWwqIGNvbXBvbmVudCB0cmVlLlxuICAgKiBUaGlzIGFmZmVjdHMgd2hhdCBpcyBhdmFpbGFibGUgZm9yIGluamVjdGlvbiBhbmQgdGhlIGNoYW5nZSBkZXRlY3Rpb24gb3JkZXIgZm9yIHRoZVxuICAgKiBjb21wb25lbnQgaW5zdGFudGlhdGVkIGluc2lkZSBvZiB0aGUgZGlhbG9nLiBUaGlzIGRvZXMgbm90IGFmZmVjdCB3aGVyZSB0aGUgZGlhbG9nXG4gICAqIGNvbnRlbnQgd2lsbCBiZSByZW5kZXJlZC5cbiAgICovXG4gIHZpZXdDb250YWluZXJSZWY/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKlxuICAgKiBJbmplY3RvciB1c2VkIGZvciB0aGUgaW5zdGFudGlhdGlvbiBvZiB0aGUgY29tcG9uZW50IHRvIGJlIGF0dGFjaGVkLiBJZiBwcm92aWRlZCxcbiAgICogdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRoZSBpbmplY3RvciBpbmRpcmVjdGx5IHByb3ZpZGVkIGJ5IGBWaWV3Q29udGFpbmVyUmVmYC5cbiAgICovXG4gIGluamVjdG9yPzogSW5qZWN0b3I7XG5cbiAgLyoqIElEIGZvciB0aGUgZGlhbG9nLiBJZiBvbWl0dGVkLCBhIHVuaXF1ZSBvbmUgd2lsbCBiZSBnZW5lcmF0ZWQuICovXG4gIGlkPzogc3RyaW5nO1xuXG4gIC8qKiBUaGUgQVJJQSByb2xlIG9mIHRoZSBkaWFsb2cgZWxlbWVudC4gKi9cbiAgcm9sZT86IERpYWxvZ1JvbGUgPSAnZGlhbG9nJztcblxuICAvKiogT3B0aW9uYWwgQ1NTIGNsYXNzIG9yIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgb3ZlcmxheSBwYW5lbC4gKi9cbiAgcGFuZWxDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpYWxvZyBoYXMgYSBiYWNrZHJvcC4gKi9cbiAgaGFzQmFja2Ryb3A/OiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogT3B0aW9uYWwgQ1NTIGNsYXNzIG9yIGNsYXNzZXMgYXBwbGllZCB0byB0aGUgb3ZlcmxheSBiYWNrZHJvcC4gKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZyB8IHN0cmluZ1tdID0gJyc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGRpYWxvZyBjbG9zZXMgd2l0aCB0aGUgZXNjYXBlIGtleSBvciBwb2ludGVyIGV2ZW50cyBvdXRzaWRlIHRoZSBwYW5lbCBlbGVtZW50LiAqL1xuICBkaXNhYmxlQ2xvc2U/OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBkaWFsb2cuICovXG4gIHdpZHRoPzogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEhlaWdodCBvZiB0aGUgZGlhbG9nLiAqL1xuICBoZWlnaHQ/OiBzdHJpbmcgPSAnJztcblxuICAvKiogTWluLXdpZHRoIG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtaW5XaWR0aD86IG51bWJlciB8IHN0cmluZztcblxuICAvKiogTWluLWhlaWdodCBvZiB0aGUgZGlhbG9nLiBJZiBhIG51bWJlciBpcyBwcm92aWRlZCwgYXNzdW1lcyBwaXhlbCB1bml0cy4gKi9cbiAgbWluSGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtd2lkdGggb2YgdGhlIGRpYWxvZy4gSWYgYSBudW1iZXIgaXMgcHJvdmlkZWQsIGFzc3VtZXMgcGl4ZWwgdW5pdHMuIERlZmF1bHRzIHRvIDgwdncuICovXG4gIG1heFdpZHRoPzogbnVtYmVyIHwgc3RyaW5nO1xuXG4gIC8qKiBNYXgtaGVpZ2h0IG9mIHRoZSBkaWFsb2cuIElmIGEgbnVtYmVyIGlzIHByb3ZpZGVkLCBhc3N1bWVzIHBpeGVsIHVuaXRzLiAqL1xuICBtYXhIZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG5cbiAgLyoqIFN0cmF0ZWd5IHRvIHVzZSB3aGVuIHBvc2l0aW9uaW5nIHRoZSBkaWFsb2cuIERlZmF1bHRzIHRvIGNlbnRlcmluZyBpdCBvbiB0aGUgcGFnZS4gKi9cbiAgcG9zaXRpb25TdHJhdGVneT86IFBvc2l0aW9uU3RyYXRlZ3k7XG5cbiAgLyoqIERhdGEgYmVpbmcgaW5qZWN0ZWQgaW50byB0aGUgY2hpbGQgY29tcG9uZW50LiAqL1xuICBkYXRhPzogRCB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBMYXlvdXQgZGlyZWN0aW9uIGZvciB0aGUgZGlhbG9nJ3MgY29udGVudC4gKi9cbiAgZGlyZWN0aW9uPzogRGlyZWN0aW9uO1xuXG4gIC8qKiBJRCBvZiB0aGUgZWxlbWVudCB0aGF0IGRlc2NyaWJlcyB0aGUgZGlhbG9nLiAqL1xuICBhcmlhRGVzY3JpYmVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogSUQgb2YgdGhlIGVsZW1lbnQgdGhhdCBsYWJlbHMgdGhlIGRpYWxvZy4gKi9cbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogRGlhbG9nIGxhYmVsIGFwcGxpZWQgdmlhIGBhcmlhLWxhYmVsYCAqL1xuICBhcmlhTGFiZWw/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGlzIGlzIGEgbW9kYWwgZGlhbG9nLiBVc2VkIHRvIHNldCB0aGUgYGFyaWEtbW9kYWxgIGF0dHJpYnV0ZS4gKi9cbiAgYXJpYU1vZGFsPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXJlIHRoZSBkaWFsb2cgc2hvdWxkIGZvY3VzIG9uIG9wZW4uXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBib29sZWFuIG9wdGlvbiBmcm9tIGF1dG9Gb2N1cy4gVXNlIHN0cmluZyBvclxuICAgKiBBdXRvRm9jdXNUYXJnZXQgaW5zdGVhZC5cbiAgICovXG4gIGF1dG9Gb2N1cz86IEF1dG9Gb2N1c1RhcmdldCB8IHN0cmluZyB8IGJvb2xlYW4gPSAnZmlyc3QtdGFiYmFibGUnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBkaWFsb2cgc2hvdWxkIHJlc3RvcmUgZm9jdXMgdG8gdGhlIHByZXZpb3VzbHktZm9jdXNlZCBlbGVtZW50IHVwb24gY2xvc2luZy5cbiAgICogSGFzIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3IgYmFzZWQgb24gdGhlIHR5cGUgdGhhdCBpcyBwYXNzZWQgaW46XG4gICAqIC0gYGJvb2xlYW5gIC0gd2hlbiB0cnVlLCB3aWxsIHJldHVybiBmb2N1cyB0byB0aGUgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIGJlZm9yZSB0aGUgZGlhbG9nXG4gICAqICAgIHdhcyBvcGVuZWQsIG90aGVyd2lzZSB3b24ndCByZXN0b3JlIGZvY3VzIGF0IGFsbC5cbiAgICogLSBgc3RyaW5nYCAtIGZvY3VzIHdpbGwgYmUgcmVzdG9yZWQgdG8gdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBDU1Mgc2VsZWN0b3IuXG4gICAqIC0gYEhUTUxFbGVtZW50YCAtIGZvY3VzIHdpbGwgYmUgcmVzdG9yZWQgdG8gdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqL1xuICByZXN0b3JlRm9jdXM/OiBib29sZWFuIHwgc3RyaW5nIHwgSFRNTEVsZW1lbnQgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBTY3JvbGwgc3RyYXRlZ3kgdG8gYmUgdXNlZCBmb3IgdGhlIGRpYWxvZy4gVGhpcyBkZXRlcm1pbmVzIGhvd1xuICAgKiB0aGUgZGlhbG9nIHJlc3BvbmRzIHRvIHNjcm9sbGluZyB1bmRlcm5lYXRoIHRoZSBwYW5lbCBlbGVtZW50LlxuICAgKi9cbiAgc2Nyb2xsU3RyYXRlZ3k/OiBTY3JvbGxTdHJhdGVneTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGlhbG9nIHNob3VsZCBjbG9zZSB3aGVuIHRoZSB1c2VyIG5hdmlnYXRlcyBiYWNrd2FyZHMgb3IgZm9yd2FyZHMgdGhyb3VnaCBicm93c2VyXG4gICAqIGhpc3RvcnkuIFRoaXMgZG9lcyBub3QgYXBwbHkgdG8gbmF2aWdhdGlvbiB2aWEgYW5jaG9yIGVsZW1lbnQgdW5sZXNzIHVzaW5nIFVSTC1oYXNoIGJhc2VkXG4gICAqIHJvdXRpbmcgKGBIYXNoTG9jYXRpb25TdHJhdGVneWAgaW4gdGhlIEFuZ3VsYXIgcm91dGVyKS5cbiAgICovXG4gIGNsb3NlT25OYXZpZ2F0aW9uPzogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRpYWxvZyBzaG91bGQgY2xvc2Ugd2hlbiB0aGUgZGlhbG9nIHNlcnZpY2UgaXMgZGVzdHJveWVkLiBUaGlzIGlzIHVzZWZ1bCBpZlxuICAgKiBhbm90aGVyIHNlcnZpY2UgaXMgd3JhcHBpbmcgdGhlIGRpYWxvZyBhbmQgaXMgbWFuYWdpbmcgdGhlIGRlc3RydWN0aW9uIGluc3RlYWQuXG4gICAqL1xuICBjbG9zZU9uRGVzdHJveT86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBBbHRlcm5hdGUgYENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcmAgdG8gdXNlIHdoZW4gcmVzb2x2aW5nIHRoZSBhc3NvY2lhdGVkIGNvbXBvbmVudC4gKi9cbiAgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyPzogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuXG4gIC8qKlxuICAgKiBQcm92aWRlcnMgdGhhdCB3aWxsIGJlIGV4cG9zZWQgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWFsb2cuIENhbiBhbHNvXG4gICAqIGJlIHByb3ZpZGVkIGFzIGEgZnVuY3Rpb24gaW4gb3JkZXIgdG8gZ2VuZXJhdGUgdGhlIHByb3ZpZGVycyBsYXppbHkuXG4gICAqL1xuICBwcm92aWRlcnM/OlxuICAgIHwgU3RhdGljUHJvdmlkZXJbXVxuICAgIHwgKChkaWFsb2dSZWY6IFIsIGNvbmZpZzogRGlhbG9nQ29uZmlnPEQsIFIsIEM+LCBjb250YWluZXI6IEMpID0+IFN0YXRpY1Byb3ZpZGVyW10pO1xuXG4gIC8qKlxuICAgKiBDb21wb25lbnQgaW50byB3aGljaCB0aGUgZGlhbG9nIGNvbnRlbnQgd2lsbCBiZSByZW5kZXJlZC4gRGVmYXVsdHMgdG8gYENka0RpYWxvZ0NvbnRhaW5lcmAuXG4gICAqIEEgY29uZmlndXJhdGlvbiBvYmplY3QgY2FuIGJlIHBhc3NlZCBpbiB0byBjdXN0b21pemUgdGhlIHByb3ZpZGVycyB0aGF0IHdpbGwgYmUgZXhwb3NlZFxuICAgKiB0byB0aGUgZGlhbG9nIGNvbnRhaW5lci5cbiAgICovXG4gIGNvbnRhaW5lcj86XG4gICAgfCBUeXBlPEM+XG4gICAgfCB7XG4gICAgICAgIHR5cGU6IFR5cGU8Qz47XG4gICAgICAgIHByb3ZpZGVyczogKGNvbmZpZzogRGlhbG9nQ29uZmlnPEQsIFIsIEM+KSA9PiBTdGF0aWNQcm92aWRlcltdO1xuICAgICAgfTtcblxuICAvKipcbiAgICogQ29udGV4dCB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIHRlbXBsYXRlLWJhc2VkIGRpYWxvZ3MuXG4gICAqIEEgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCBpbiB0byByZXNvbHZlIHRoZSBjb250ZXh0IGxhemlseS5cbiAgICovXG4gIHRlbXBsYXRlQ29udGV4dD86IFJlY29yZDxzdHJpbmcsIGFueT4gfCAoKCkgPT4gUmVjb3JkPHN0cmluZywgYW55Pik7XG59XG4iXX0=
