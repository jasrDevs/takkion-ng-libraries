/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { defer, fromEvent, Subject } from 'rxjs';
import { mapTo, mergeAll, mergeMap, startWith, takeUntil } from 'rxjs/operators';
/**
 * PointerFocusTracker keeps track of the currently active item under mouse focus. It also has
 * observables which emit when the users mouse enters and leaves a tracked element.
 */
export class PointerFocusTracker {
  constructor(
    /** The list of items being tracked. */
    _items
  ) {
    this._items = _items;
    /** Emits when an element is moused into. */
    this.entered = this._getItemPointerEntries();
    /** Emits when an element is moused out. */
    this.exited = this._getItemPointerExits();
    /** Emits when this is destroyed. */
    this._destroyed = new Subject();
    this.entered.subscribe(element => (this.activeElement = element));
    this.exited.subscribe(() => {
      this.previousElement = this.activeElement;
      this.activeElement = undefined;
    });
  }
  /** Stop the managers listeners. */
  destroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Gets a stream of pointer (mouse) entries into the given items.
   * This should typically run outside the Angular zone.
   */
  _getItemPointerEntries() {
    return defer(() =>
      this._items.changes.pipe(
        startWith(this._items),
        mergeMap(list =>
          list.map(element =>
            fromEvent(element._elementRef.nativeElement, 'mouseenter').pipe(
              mapTo(element),
              takeUntil(this._items.changes)
            )
          )
        ),
        mergeAll()
      )
    );
  }
  /**
   * Gets a stream of pointer (mouse) exits out of the given items.
   * This should typically run outside the Angular zone.
   */
  _getItemPointerExits() {
    return defer(() =>
      this._items.changes.pipe(
        startWith(this._items),
        mergeMap(list =>
          list.map(element =>
            fromEvent(element._elementRef.nativeElement, 'mouseout').pipe(
              mapTo(element),
              takeUntil(this._items.changes)
            )
          )
        ),
        mergeAll()
      )
    );
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnRlci1mb2N1cy10cmFja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9tZW51L3BvaW50ZXItZm9jdXMtdHJhY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBYyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVEvRTs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sbUJBQW1CO0lBZ0I5QjtJQUNFLHVDQUF1QztJQUN0QixNQUFvQjtRQUFwQixXQUFNLEdBQU4sTUFBTSxDQUFjO1FBakJ2Qyw0Q0FBNEM7UUFDbkMsWUFBTyxHQUFrQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUVoRSwyQ0FBMkM7UUFDbEMsV0FBTSxHQUFrQixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQVE3RCxvQ0FBb0M7UUFDbkIsZUFBVSxHQUFrQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBTXpELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxtQ0FBbUM7SUFDbkMsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssc0JBQXNCO1FBQzVCLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQ3RCLFFBQVEsQ0FBQyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUM5QixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQ2pCLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQzdELEtBQUssQ0FBQyxPQUFPLENBQUMsRUFDZCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FDL0IsQ0FDRixDQUNGLEVBQ0QsUUFBUSxFQUFFLENBQ1gsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7T0FHRztJQUNLLG9CQUFvQjtRQUMxQixPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUN0QixTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUN0QixRQUFRLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUNqQixTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUMzRCxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQ2QsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQy9CLENBQ0YsQ0FDRixFQUNELFFBQVEsRUFBRSxDQUNYLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0VsZW1lbnRSZWYsIFF1ZXJ5TGlzdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2RlZmVyLCBmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXBUbywgbWVyZ2VBbGwsIG1lcmdlTWFwLCBzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKiogSXRlbSB0byB0cmFjayBmb3IgbW91c2UgZm9jdXMgZXZlbnRzLiAqL1xuZXhwb3J0IGludGVyZmFjZSBGb2N1c2FibGVFbGVtZW50IHtcbiAgLyoqIEEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHRvIGJlIHRyYWNrZWQuICovXG4gIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pjtcbn1cblxuLyoqXG4gKiBQb2ludGVyRm9jdXNUcmFja2VyIGtlZXBzIHRyYWNrIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIGl0ZW0gdW5kZXIgbW91c2UgZm9jdXMuIEl0IGFsc28gaGFzXG4gKiBvYnNlcnZhYmxlcyB3aGljaCBlbWl0IHdoZW4gdGhlIHVzZXJzIG1vdXNlIGVudGVycyBhbmQgbGVhdmVzIGEgdHJhY2tlZCBlbGVtZW50LlxuICovXG5leHBvcnQgY2xhc3MgUG9pbnRlckZvY3VzVHJhY2tlcjxUIGV4dGVuZHMgRm9jdXNhYmxlRWxlbWVudD4ge1xuICAvKiogRW1pdHMgd2hlbiBhbiBlbGVtZW50IGlzIG1vdXNlZCBpbnRvLiAqL1xuICByZWFkb25seSBlbnRlcmVkOiBPYnNlcnZhYmxlPFQ+ID0gdGhpcy5fZ2V0SXRlbVBvaW50ZXJFbnRyaWVzKCk7XG5cbiAgLyoqIEVtaXRzIHdoZW4gYW4gZWxlbWVudCBpcyBtb3VzZWQgb3V0LiAqL1xuICByZWFkb25seSBleGl0ZWQ6IE9ic2VydmFibGU8VD4gPSB0aGlzLl9nZXRJdGVtUG9pbnRlckV4aXRzKCk7XG5cbiAgLyoqIFRoZSBlbGVtZW50IGN1cnJlbnRseSB1bmRlciBtb3VzZSBmb2N1cy4gKi9cbiAgYWN0aXZlRWxlbWVudD86IFQ7XG5cbiAgLyoqIFRoZSBlbGVtZW50IHByZXZpb3VzbHkgdW5kZXIgbW91c2UgZm9jdXMuICovXG4gIHByZXZpb3VzRWxlbWVudD86IFQ7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhpcyBpcyBkZXN0cm95ZWQuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3llZDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFRoZSBsaXN0IG9mIGl0ZW1zIGJlaW5nIHRyYWNrZWQuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBfaXRlbXM6IFF1ZXJ5TGlzdDxUPixcbiAgKSB7XG4gICAgdGhpcy5lbnRlcmVkLnN1YnNjcmliZShlbGVtZW50ID0+ICh0aGlzLmFjdGl2ZUVsZW1lbnQgPSBlbGVtZW50KSk7XG4gICAgdGhpcy5leGl0ZWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMucHJldmlvdXNFbGVtZW50ID0gdGhpcy5hY3RpdmVFbGVtZW50O1xuICAgICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdW5kZWZpbmVkO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIFN0b3AgdGhlIG1hbmFnZXJzIGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95ZWQubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzdHJlYW0gb2YgcG9pbnRlciAobW91c2UpIGVudHJpZXMgaW50byB0aGUgZ2l2ZW4gaXRlbXMuXG4gICAqIFRoaXMgc2hvdWxkIHR5cGljYWxseSBydW4gb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lLlxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0SXRlbVBvaW50ZXJFbnRyaWVzKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBkZWZlcigoKSA9PlxuICAgICAgdGhpcy5faXRlbXMuY2hhbmdlcy5waXBlKFxuICAgICAgICBzdGFydFdpdGgodGhpcy5faXRlbXMpLFxuICAgICAgICBtZXJnZU1hcCgobGlzdDogUXVlcnlMaXN0PFQ+KSA9PlxuICAgICAgICAgIGxpc3QubWFwKGVsZW1lbnQgPT5cbiAgICAgICAgICAgIGZyb21FdmVudChlbGVtZW50Ll9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWVudGVyJykucGlwZShcbiAgICAgICAgICAgICAgbWFwVG8oZWxlbWVudCksXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9pdGVtcy5jaGFuZ2VzKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgICAgbWVyZ2VBbGwoKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3RyZWFtIG9mIHBvaW50ZXIgKG1vdXNlKSBleGl0cyBvdXQgb2YgdGhlIGdpdmVuIGl0ZW1zLlxuICAgKiBUaGlzIHNob3VsZCB0eXBpY2FsbHkgcnVuIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICovXG4gIHByaXZhdGUgX2dldEl0ZW1Qb2ludGVyRXhpdHMoKSB7XG4gICAgcmV0dXJuIGRlZmVyKCgpID0+XG4gICAgICB0aGlzLl9pdGVtcy5jaGFuZ2VzLnBpcGUoXG4gICAgICAgIHN0YXJ0V2l0aCh0aGlzLl9pdGVtcyksXG4gICAgICAgIG1lcmdlTWFwKChsaXN0OiBRdWVyeUxpc3Q8VD4pID0+XG4gICAgICAgICAgbGlzdC5tYXAoZWxlbWVudCA9PlxuICAgICAgICAgICAgZnJvbUV2ZW50KGVsZW1lbnQuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21vdXNlb3V0JykucGlwZShcbiAgICAgICAgICAgICAgbWFwVG8oZWxlbWVudCksXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9pdGVtcy5jaGFuZ2VzKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgICAgbWVyZ2VBbGwoKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxufVxuIl19
