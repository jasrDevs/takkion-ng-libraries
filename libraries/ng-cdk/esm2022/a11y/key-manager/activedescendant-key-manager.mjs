/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ListKeyManager } from './list-key-manager';
export class ActiveDescendantKeyManager extends ListKeyManager {
    setActiveItem(index) {
        if (this.activeItem) {
            this.activeItem.setInactiveStyles();
        }
        super.setActiveItem(index);
        if (this.activeItem) {
            this.activeItem.setActiveStyles();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZlZGVzY2VuZGFudC1rZXktbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvYTExeS9rZXktbWFuYWdlci9hY3RpdmVkZXNjZW5kYW50LWtleS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQXVCLE1BQU0sb0JBQW9CLENBQUM7QUFleEUsTUFBTSxPQUFPLDBCQUE4QixTQUFRLGNBQWlDO0lBaUJ6RSxhQUFhLENBQUMsS0FBVTtRQUMvQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUNELEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TGlzdEtleU1hbmFnZXIsIExpc3RLZXlNYW5hZ2VyT3B0aW9ufSBmcm9tICcuL2xpc3Qta2V5LW1hbmFnZXInO1xuXG4vKipcbiAqIFRoaXMgaXMgdGhlIGludGVyZmFjZSBmb3IgaGlnaGxpZ2h0YWJsZSBpdGVtcyAodXNlZCBieSB0aGUgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXIpLlxuICogRWFjaCBpdGVtIG11c3Qga25vdyBob3cgdG8gc3R5bGUgaXRzZWxmIGFzIGFjdGl2ZSBvciBpbmFjdGl2ZSBhbmQgd2hldGhlciBvciBub3QgaXQgaXNcbiAqIGN1cnJlbnRseSBkaXNhYmxlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIaWdobGlnaHRhYmxlIGV4dGVuZHMgTGlzdEtleU1hbmFnZXJPcHRpb24ge1xuICAvKiogQXBwbGllcyB0aGUgc3R5bGVzIGZvciBhbiBhY3RpdmUgaXRlbSB0byB0aGlzIGl0ZW0uICovXG4gIHNldEFjdGl2ZVN0eWxlcygpOiB2b2lkO1xuXG4gIC8qKiBBcHBsaWVzIHRoZSBzdHlsZXMgZm9yIGFuIGluYWN0aXZlIGl0ZW0gdG8gdGhpcyBpdGVtLiAqL1xuICBzZXRJbmFjdGl2ZVN0eWxlcygpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8VD4gZXh0ZW5kcyBMaXN0S2V5TWFuYWdlcjxIaWdobGlnaHRhYmxlICYgVD4ge1xuICAvKipcbiAgICogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gdGhlIGl0ZW0gYXQgdGhlIHNwZWNpZmllZCBpbmRleCBhbmQgYWRkcyB0aGVcbiAgICogYWN0aXZlIHN0eWxlcyB0byB0aGUgbmV3bHkgYWN0aXZlIGl0ZW0uIEFsc28gcmVtb3ZlcyBhY3RpdmUgc3R5bGVzXG4gICAqIGZyb20gdGhlIHByZXZpb3VzbHkgYWN0aXZlIGl0ZW0uXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBvZiB0aGUgaXRlbSB0byBiZSBzZXQgYXMgYWN0aXZlLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0QWN0aXZlSXRlbShpbmRleDogbnVtYmVyKTogdm9pZDtcblxuICAvKipcbiAgICogU2V0cyB0aGUgYWN0aXZlIGl0ZW0gdG8gdGhlIGl0ZW0gdG8gdGhlIHNwZWNpZmllZCBvbmUgYW5kIGFkZHMgdGhlXG4gICAqIGFjdGl2ZSBzdHlsZXMgdG8gdGhlIGl0LiBBbHNvIHJlbW92ZXMgYWN0aXZlIHN0eWxlcyBmcm9tIHRoZVxuICAgKiBwcmV2aW91c2x5IGFjdGl2ZSBpdGVtLlxuICAgKiBAcGFyYW0gaXRlbSBJdGVtIHRvIGJlIHNldCBhcyBhY3RpdmUuXG4gICAqL1xuICBvdmVycmlkZSBzZXRBY3RpdmVJdGVtKGl0ZW06IFQpOiB2b2lkO1xuXG4gIG92ZXJyaWRlIHNldEFjdGl2ZUl0ZW0oaW5kZXg6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0pIHtcbiAgICAgIHRoaXMuYWN0aXZlSXRlbS5zZXRJbmFjdGl2ZVN0eWxlcygpO1xuICAgIH1cbiAgICBzdXBlci5zZXRBY3RpdmVJdGVtKGluZGV4KTtcbiAgICBpZiAodGhpcy5hY3RpdmVJdGVtKSB7XG4gICAgICB0aGlzLmFjdGl2ZUl0ZW0uc2V0QWN0aXZlU3R5bGVzKCk7XG4gICAgfVxuICB9XG59XG4iXX0=