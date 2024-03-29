/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ESCAPE, hasModifierKey } from '@takkion/ng-cdk/keycodes';
import { Subject } from 'rxjs';
/**
 * Reference to a dialog opened via the Dialog service.
 */
export class DialogRef {
    constructor(overlayRef, config) {
        this.overlayRef = overlayRef;
        this.config = config;
        /** Emits when the dialog has been closed. */
        this.closed = new Subject();
        this.disableClose = config.disableClose;
        this.backdropClick = overlayRef.backdropClick();
        this.keydownEvents = overlayRef.keydownEvents();
        this.outsidePointerEvents = overlayRef.outsidePointerEvents();
        this.id = config.id; // By the time the dialog is created we are guaranteed to have an ID.
        this.keydownEvents.subscribe(event => {
            if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
                event.preventDefault();
                this.close(undefined, { focusOrigin: 'keyboard' });
            }
        });
        this.backdropClick.subscribe(() => {
            if (!this.disableClose) {
                this.close(undefined, { focusOrigin: 'mouse' });
            }
        });
        this._detachSubscription = overlayRef.detachments().subscribe(() => {
            // Check specifically for `false`, because we want `undefined` to be treated like `true`.
            if (config.closeOnOverlayDetachments !== false) {
                this.close();
            }
        });
    }
    /**
     * Close the dialog.
     * @param result Optional result to return to the dialog opener.
     * @param options Additional options to customize the closing behavior.
     */
    close(result, options) {
        if (this.containerInstance) {
            const closedSubject = this.closed;
            this.containerInstance._closeInteractionType = options?.focusOrigin || 'program';
            // Drop the detach subscription first since it can be triggered by the
            // `dispose` call and override the result of this closing sequence.
            this._detachSubscription.unsubscribe();
            this.overlayRef.dispose();
            closedSubject.next(result);
            closedSubject.complete();
            this.componentInstance = this.containerInstance = null;
        }
    }
    /** Updates the position of the dialog based on the current position strategy. */
    updatePosition() {
        this.overlayRef.updatePosition();
        return this;
    }
    /**
     * Updates the dialog's width and height.
     * @param width New width of the dialog.
     * @param height New height of the dialog.
     */
    updateSize(width = '', height = '') {
        this.overlayRef.updateSize({ width, height });
        return this;
    }
    /** Add a CSS class or an array of classes to the overlay pane. */
    addPanelClass(classes) {
        this.overlayRef.addPanelClass(classes);
        return this;
    }
    /** Remove a CSS class or an array of classes from the overlay pane. */
    removePanelClass(classes) {
        this.overlayRef.removePanelClass(classes);
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZGlhbG9nL2RpYWxvZy1yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RCxPQUFPLEVBQWEsT0FBTyxFQUFlLE1BQU0sTUFBTSxDQUFDO0FBWXZEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFxQ3BCLFlBQ1csVUFBc0IsRUFDdEIsTUFBNEQ7UUFENUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixXQUFNLEdBQU4sTUFBTSxDQUFzRDtRQXBCdkUsNkNBQTZDO1FBQ3BDLFdBQU0sR0FBOEIsSUFBSSxPQUFPLEVBQWlCLENBQUM7UUFxQnhFLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDOUQsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRyxDQUFDLENBQUMscUVBQXFFO1FBRTNGLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25DLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQzdFLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztZQUNuRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDakUseUZBQXlGO1lBQ3pGLElBQUksTUFBTSxDQUFDLHlCQUF5QixLQUFLLEtBQUssRUFBRSxDQUFDO2dCQUMvQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxNQUFVLEVBQUUsT0FBNEI7UUFDNUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBZ0MsQ0FBQztZQUM1RCxJQUFJLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLEdBQUcsT0FBTyxFQUFFLFdBQVcsSUFBSSxTQUFTLENBQUM7WUFDakYsc0VBQXNFO1lBQ3RFLG1FQUFtRTtZQUNuRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQixhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNCLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN4QixJQUErQixDQUFDLGlCQUFpQixHQUNoRCxJQUNELENBQUMsaUJBQWlCLEdBQUcsSUFBSyxDQUFDO1FBQzlCLENBQUM7SUFDSCxDQUFDO0lBRUQsaUZBQWlGO0lBQ2pGLGNBQWM7UUFDWixJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxVQUFVLENBQUMsUUFBeUIsRUFBRSxFQUFFLFNBQTBCLEVBQUU7UUFDbEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxrRUFBa0U7SUFDbEUsYUFBYSxDQUFDLE9BQTBCO1FBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHVFQUF1RTtJQUN2RSxnQkFBZ0IsQ0FBQyxPQUEwQjtRQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7T3ZlcmxheVJlZn0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHtFU0NBUEUsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtEaWFsb2dDb25maWd9IGZyb20gJy4vZGlhbG9nLWNvbmZpZyc7XG5pbXBvcnQge0ZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jhc2VQb3J0YWxPdXRsZXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKiogQWRkaXRpb25hbCBvcHRpb25zIHRoYXQgY2FuIGJlIHBhc3NlZCBpbiB3aGVuIGNsb3NpbmcgYSBkaWFsb2cuICovXG5leHBvcnQgaW50ZXJmYWNlIERpYWxvZ0Nsb3NlT3B0aW9ucyB7XG4gIC8qKiBGb2N1cyBvcmlnaW5hbCB0byB1c2Ugd2hlbiByZXN0b3JpbmcgZm9jdXMuICovXG4gIGZvY3VzT3JpZ2luPzogRm9jdXNPcmlnaW47XG59XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIGEgZGlhbG9nIG9wZW5lZCB2aWEgdGhlIERpYWxvZyBzZXJ2aWNlLlxuICovXG5leHBvcnQgY2xhc3MgRGlhbG9nUmVmPFIgPSB1bmtub3duLCBDID0gdW5rbm93bj4ge1xuICAvKipcbiAgICogSW5zdGFuY2Ugb2YgY29tcG9uZW50IG9wZW5lZCBpbnRvIHRoZSBkaWFsb2cuIFdpbGwgYmVcbiAgICogbnVsbCB3aGVuIHRoZSBkaWFsb2cgaXMgb3BlbmVkIHVzaW5nIGEgYFRlbXBsYXRlUmVmYC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbXBvbmVudEluc3RhbmNlOiBDIHwgbnVsbDtcblxuICAvKipcbiAgICogYENvbXBvbmVudFJlZmAgb2YgdGhlIGNvbXBvbmVudCBvcGVuZWQgaW50byB0aGUgZGlhbG9nLiBXaWxsIGJlXG4gICAqIG51bGwgd2hlbiB0aGUgZGlhbG9nIGlzIG9wZW5lZCB1c2luZyBhIGBUZW1wbGF0ZVJlZmAuXG4gICAqL1xuICByZWFkb25seSBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxDPiB8IG51bGw7XG5cbiAgLyoqIEluc3RhbmNlIG9mIHRoZSBjb250YWluZXIgdGhhdCBpcyByZW5kZXJpbmcgb3V0IHRoZSBkaWFsb2cgY29udGVudC4gKi9cbiAgcmVhZG9ubHkgY29udGFpbmVySW5zdGFuY2U6IEJhc2VQb3J0YWxPdXRsZXQgJiB7X2Nsb3NlSW50ZXJhY3Rpb25UeXBlPzogRm9jdXNPcmlnaW59O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB1c2VyIGlzIGFsbG93ZWQgdG8gY2xvc2UgdGhlIGRpYWxvZy4gKi9cbiAgZGlzYWJsZUNsb3NlOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBkaWFsb2cgaGFzIGJlZW4gY2xvc2VkLiAqL1xuICByZWFkb25seSBjbG9zZWQ6IE9ic2VydmFibGU8UiB8IHVuZGVmaW5lZD4gPSBuZXcgU3ViamVjdDxSIHwgdW5kZWZpbmVkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBiYWNrZHJvcCBvZiB0aGUgZGlhbG9nIGlzIGNsaWNrZWQuICovXG4gIHJlYWRvbmx5IGJhY2tkcm9wQ2xpY2s6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG5cbiAgLyoqIEVtaXRzIHdoZW4gb24ga2V5Ym9hcmQgZXZlbnRzIHdpdGhpbiB0aGUgZGlhbG9nLiAqL1xuICByZWFkb25seSBrZXlkb3duRXZlbnRzOiBPYnNlcnZhYmxlPEtleWJvYXJkRXZlbnQ+O1xuXG4gIC8qKiBFbWl0cyBvbiBwb2ludGVyIGV2ZW50cyB0aGF0IGhhcHBlbiBvdXRzaWRlIG9mIHRoZSBkaWFsb2cuICovXG4gIHJlYWRvbmx5IG91dHNpZGVQb2ludGVyRXZlbnRzOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xuXG4gIC8qKiBVbmlxdWUgSUQgZm9yIHRoZSBkaWFsb2cuICovXG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cbiAgLyoqIFN1YnNjcmlwdGlvbiB0byBleHRlcm5hbCBkZXRhY2htZW50cyBvZiB0aGUgZGlhbG9nLiAqL1xuICBwcml2YXRlIF9kZXRhY2hTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByZWFkb25seSBvdmVybGF5UmVmOiBPdmVybGF5UmVmLFxuICAgIHJlYWRvbmx5IGNvbmZpZzogRGlhbG9nQ29uZmlnPGFueSwgRGlhbG9nUmVmPFIsIEM+LCBCYXNlUG9ydGFsT3V0bGV0PixcbiAgKSB7XG4gICAgdGhpcy5kaXNhYmxlQ2xvc2UgPSBjb25maWcuZGlzYWJsZUNsb3NlO1xuICAgIHRoaXMuYmFja2Ryb3BDbGljayA9IG92ZXJsYXlSZWYuYmFja2Ryb3BDbGljaygpO1xuICAgIHRoaXMua2V5ZG93bkV2ZW50cyA9IG92ZXJsYXlSZWYua2V5ZG93bkV2ZW50cygpO1xuICAgIHRoaXMub3V0c2lkZVBvaW50ZXJFdmVudHMgPSBvdmVybGF5UmVmLm91dHNpZGVQb2ludGVyRXZlbnRzKCk7XG4gICAgdGhpcy5pZCA9IGNvbmZpZy5pZCE7IC8vIEJ5IHRoZSB0aW1lIHRoZSBkaWFsb2cgaXMgY3JlYXRlZCB3ZSBhcmUgZ3VhcmFudGVlZCB0byBoYXZlIGFuIElELlxuXG4gICAgdGhpcy5rZXlkb3duRXZlbnRzLnN1YnNjcmliZShldmVudCA9PiB7XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmICF0aGlzLmRpc2FibGVDbG9zZSAmJiAhaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuY2xvc2UodW5kZWZpbmVkLCB7Zm9jdXNPcmlnaW46ICdrZXlib2FyZCd9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYmFja2Ryb3BDbGljay5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVDbG9zZSkge1xuICAgICAgICB0aGlzLmNsb3NlKHVuZGVmaW5lZCwge2ZvY3VzT3JpZ2luOiAnbW91c2UnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9kZXRhY2hTdWJzY3JpcHRpb24gPSBvdmVybGF5UmVmLmRldGFjaG1lbnRzKCkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIENoZWNrIHNwZWNpZmljYWxseSBmb3IgYGZhbHNlYCwgYmVjYXVzZSB3ZSB3YW50IGB1bmRlZmluZWRgIHRvIGJlIHRyZWF0ZWQgbGlrZSBgdHJ1ZWAuXG4gICAgICBpZiAoY29uZmlnLmNsb3NlT25PdmVybGF5RGV0YWNobWVudHMgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZSB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gcmVzdWx0IE9wdGlvbmFsIHJlc3VsdCB0byByZXR1cm4gdG8gdGhlIGRpYWxvZyBvcGVuZXIuXG4gICAqIEBwYXJhbSBvcHRpb25zIEFkZGl0aW9uYWwgb3B0aW9ucyB0byBjdXN0b21pemUgdGhlIGNsb3NpbmcgYmVoYXZpb3IuXG4gICAqL1xuICBjbG9zZShyZXN1bHQ/OiBSLCBvcHRpb25zPzogRGlhbG9nQ2xvc2VPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udGFpbmVySW5zdGFuY2UpIHtcbiAgICAgIGNvbnN0IGNsb3NlZFN1YmplY3QgPSB0aGlzLmNsb3NlZCBhcyBTdWJqZWN0PFIgfCB1bmRlZmluZWQ+O1xuICAgICAgdGhpcy5jb250YWluZXJJbnN0YW5jZS5fY2xvc2VJbnRlcmFjdGlvblR5cGUgPSBvcHRpb25zPy5mb2N1c09yaWdpbiB8fCAncHJvZ3JhbSc7XG4gICAgICAvLyBEcm9wIHRoZSBkZXRhY2ggc3Vic2NyaXB0aW9uIGZpcnN0IHNpbmNlIGl0IGNhbiBiZSB0cmlnZ2VyZWQgYnkgdGhlXG4gICAgICAvLyBgZGlzcG9zZWAgY2FsbCBhbmQgb3ZlcnJpZGUgdGhlIHJlc3VsdCBvZiB0aGlzIGNsb3Npbmcgc2VxdWVuY2UuXG4gICAgICB0aGlzLl9kZXRhY2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMub3ZlcmxheVJlZi5kaXNwb3NlKCk7XG4gICAgICBjbG9zZWRTdWJqZWN0Lm5leHQocmVzdWx0KTtcbiAgICAgIGNsb3NlZFN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICh0aGlzIGFzIHtjb21wb25lbnRJbnN0YW5jZTogQ30pLmNvbXBvbmVudEluc3RhbmNlID0gKFxuICAgICAgICB0aGlzIGFzIHtjb250YWluZXJJbnN0YW5jZTogQmFzZVBvcnRhbE91dGxldH1cbiAgICAgICkuY29udGFpbmVySW5zdGFuY2UgPSBudWxsITtcbiAgICB9XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIGRpYWxvZyBiYXNlZCBvbiB0aGUgY3VycmVudCBwb3NpdGlvbiBzdHJhdGVneS4gKi9cbiAgdXBkYXRlUG9zaXRpb24oKTogdGhpcyB7XG4gICAgdGhpcy5vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgZGlhbG9nJ3Mgd2lkdGggYW5kIGhlaWdodC5cbiAgICogQHBhcmFtIHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgZGlhbG9nLlxuICAgKiBAcGFyYW0gaGVpZ2h0IE5ldyBoZWlnaHQgb2YgdGhlIGRpYWxvZy5cbiAgICovXG4gIHVwZGF0ZVNpemUod2lkdGg6IHN0cmluZyB8IG51bWJlciA9ICcnLCBoZWlnaHQ6IHN0cmluZyB8IG51bWJlciA9ICcnKTogdGhpcyB7XG4gICAgdGhpcy5vdmVybGF5UmVmLnVwZGF0ZVNpemUoe3dpZHRoLCBoZWlnaHR9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBBZGQgYSBDU1MgY2xhc3Mgb3IgYW4gYXJyYXkgb2YgY2xhc3NlcyB0byB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICBhZGRQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5vdmVybGF5UmVmLmFkZFBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmVtb3ZlIGEgQ1NTIGNsYXNzIG9yIGFuIGFycmF5IG9mIGNsYXNzZXMgZnJvbSB0aGUgb3ZlcmxheSBwYW5lLiAqL1xuICByZW1vdmVQYW5lbENsYXNzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdGhpcyB7XG4gICAgdGhpcy5vdmVybGF5UmVmLnJlbW92ZVBhbmVsQ2xhc3MoY2xhc3Nlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==