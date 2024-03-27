/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { handleAutoChangeDetectionStatus, HarnessEnvironment, stopHandlingAutoChangeDetectionStatus, } from '@takkion/ng-cdk/testing';
import { flush } from '@angular/core/testing';
import { takeWhile } from 'rxjs/operators';
import { TaskStateZoneInterceptor } from './task-state-zone-interceptor';
import { UnitTestElement } from './unit-test-element';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: (selector, root) => root.querySelectorAll(selector),
};
/** Whether auto change detection is currently disabled. */
let disableAutoChangeDetection = false;
/**
 * The set of non-destroyed fixtures currently being used by `TestbedHarnessEnvironment` instances.
 */
const activeFixtures = new Set();
/**
 * Installs a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to handle change detection batching for.
 */
function installAutoChangeDetectionStatusHandler(fixture) {
    if (!activeFixtures.size) {
        handleAutoChangeDetectionStatus(({ isDisabled, onDetectChangesNow }) => {
            disableAutoChangeDetection = isDisabled;
            if (onDetectChangesNow) {
                Promise.all(Array.from(activeFixtures).map(detectChanges)).then(onDetectChangesNow);
            }
        });
    }
    activeFixtures.add(fixture);
}
/**
 * Uninstalls a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to stop handling change detection batching for.
 */
function uninstallAutoChangeDetectionStatusHandler(fixture) {
    activeFixtures.delete(fixture);
    if (!activeFixtures.size) {
        stopHandlingAutoChangeDetectionStatus();
    }
}
/** Whether we are currently in the fake async zone. */
function isInFakeAsyncZone() {
    return Zone.current.get('FakeAsyncTestZoneSpec') != null;
}
/**
 * Triggers change detection for a specific fixture.
 * @param fixture The fixture to trigger change detection for.
 */
async function detectChanges(fixture) {
    fixture.detectChanges();
    if (isInFakeAsyncZone()) {
        flush();
    }
    else {
        await fixture.whenStable();
    }
}
/** A `HarnessEnvironment` implementation for Angular's Testbed. */
export class TestbedHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, _fixture, options) {
        super(rawRootElement);
        this._fixture = _fixture;
        /** Whether the environment has been destroyed. */
        this._destroyed = false;
        this._options = { ...defaultEnvironmentOptions, ...options };
        this._taskState = TaskStateZoneInterceptor.setup();
        this._stabilizeCallback = () => this.forceStabilize();
        installAutoChangeDetectionStatusHandler(_fixture);
        _fixture.componentRef.onDestroy(() => {
            uninstallAutoChangeDetectionStatusHandler(_fixture);
            this._destroyed = true;
        });
    }
    /** Creates a `HarnessLoader` rooted at the given fixture's root element. */
    static loader(fixture, options) {
        return new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
    }
    /**
     * Creates a `HarnessLoader` at the document root. This can be used if harnesses are
     * located outside of a fixture (e.g. overlays appended to the document body).
     */
    static documentRootLoader(fixture, options) {
        return new TestbedHarnessEnvironment(document.body, fixture, options);
    }
    /** Gets the native DOM element corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof UnitTestElement) {
            return el.element;
        }
        throw Error('This TestElement was not created by the TestbedHarnessEnvironment');
    }
    /**
     * Creates an instance of the given harness type, using the fixture's root element as the
     * harness's host element. This method should be used when creating a harness for the root element
     * of a fixture, as components do not have the correct selector when they are created as the root
     * of the fixture.
     */
    static async harnessForFixture(fixture, harnessType, options) {
        const environment = new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
        await environment.forceStabilize();
        return environment.createComponentHarness(harnessType, fixture.nativeElement);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        if (!disableAutoChangeDetection) {
            if (this._destroyed) {
                throw Error('Harness is attempting to use a fixture that has already been destroyed.');
            }
            await detectChanges(this._fixture);
        }
    }
    /**
     * Waits for all scheduled or running async tasks to complete. This allows harness
     * authors to wait for async tasks outside of the Angular zone.
     */
    async waitForTasksOutsideAngular() {
        // If we run in the fake async zone, we run "flush" to run any scheduled tasks. This
        // ensures that the harnesses behave inside of the FakeAsyncTestZone similar to the
        // "AsyncTestZone" and the root zone (i.e. neither fakeAsync or async). Note that we
        // cannot just rely on the task state observable to become stable because the state will
        // never change. This is because the task queue will be only drained if the fake async
        // zone is being flushed.
        if (isInFakeAsyncZone()) {
            flush();
        }
        // Wait until the task queue has been drained and the zone is stable. Note that
        // we cannot rely on "fixture.whenStable" since it does not catch tasks scheduled
        // outside of the Angular zone. For test harnesses, we want to ensure that the
        // app is fully stabilized and therefore need to use our own zone interceptor.
        await this._taskState.pipe(takeWhile(state => !state.stable)).toPromise();
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return document.body;
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new UnitTestElement(element, this._stabilizeCallback);
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new TestbedHarnessEnvironment(element, this._fixture, this._options);
    }
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        await this.forceStabilize();
        return Array.from(this._options.queryFn(selector, this.rawRootElement));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGJlZC1oYXJuZXNzLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3Rlc3RiZWQvdGVzdGJlZC1oYXJuZXNzLWVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHTCwrQkFBK0IsRUFDL0Isa0JBQWtCLEVBRWxCLHFDQUFxQyxHQUV0QyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBbUIsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFOUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBWSx3QkFBd0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQVFwRCx1Q0FBdUM7QUFDdkMsTUFBTSx5QkFBeUIsR0FBcUM7SUFDbEUsT0FBTyxFQUFFLENBQUMsUUFBZ0IsRUFBRSxJQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Q0FDOUUsQ0FBQztBQUVGLDJEQUEyRDtBQUMzRCxJQUFJLDBCQUEwQixHQUFHLEtBQUssQ0FBQztBQUV2Qzs7R0FFRztBQUNILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO0FBRTVEOzs7R0FHRztBQUNILFNBQVMsdUNBQXVDLENBQUMsT0FBa0M7SUFDakYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6QiwrQkFBK0IsQ0FBQyxDQUFDLEVBQUMsVUFBVSxFQUFFLGtCQUFrQixFQUFDLEVBQUUsRUFBRTtZQUNuRSwwQkFBMEIsR0FBRyxVQUFVLENBQUM7WUFDeEMsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEtB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RUQsaUVBQWlFO0lBQ3ZELGlCQUFpQixDQUFDLE9BQWdCO1FBQzFDLE9BQU8sSUFBSSx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVEOztPQUVHO0lBQ08sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQWdCO1FBQ2hELE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgaGFuZGxlQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cyxcbiAgSGFybmVzc0Vudmlyb25tZW50LFxuICBIYXJuZXNzTG9hZGVyLFxuICBzdG9wSGFuZGxpbmdBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzLFxuICBUZXN0RWxlbWVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDb21wb25lbnRGaXh0dXJlLCBmbHVzaH0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VXaGlsZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtUYXNrU3RhdGUsIFRhc2tTdGF0ZVpvbmVJbnRlcmNlcHRvcn0gZnJvbSAnLi90YXNrLXN0YXRlLXpvbmUtaW50ZXJjZXB0b3InO1xuaW1wb3J0IHtVbml0VGVzdEVsZW1lbnR9IGZyb20gJy4vdW5pdC10ZXN0LWVsZW1lbnQnO1xuXG4vKiogT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIGVudmlyb25tZW50LiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyB7XG4gIC8qKiBUaGUgcXVlcnkgZnVuY3Rpb24gdXNlZCB0byBmaW5kIERPTSBlbGVtZW50cy4gKi9cbiAgcXVlcnlGbjogKHNlbGVjdG9yOiBzdHJpbmcsIHJvb3Q6IEVsZW1lbnQpID0+IEl0ZXJhYmxlPEVsZW1lbnQ+IHwgQXJyYXlMaWtlPEVsZW1lbnQ+O1xufVxuXG4vKiogVGhlIGRlZmF1bHQgZW52aXJvbm1lbnQgb3B0aW9ucy4gKi9cbmNvbnN0IGRlZmF1bHRFbnZpcm9ubWVudE9wdGlvbnM6IFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zID0ge1xuICBxdWVyeUZuOiAoc2VsZWN0b3I6IHN0cmluZywgcm9vdDogRWxlbWVudCkgPT4gcm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSxcbn07XG5cbi8qKiBXaGV0aGVyIGF1dG8gY2hhbmdlIGRldGVjdGlvbiBpcyBjdXJyZW50bHkgZGlzYWJsZWQuICovXG5sZXQgZGlzYWJsZUF1dG9DaGFuZ2VEZXRlY3Rpb24gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgc2V0IG9mIG5vbi1kZXN0cm95ZWQgZml4dHVyZXMgY3VycmVudGx5IGJlaW5nIHVzZWQgYnkgYFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnRgIGluc3RhbmNlcy5cbiAqL1xuY29uc3QgYWN0aXZlRml4dHVyZXMgPSBuZXcgU2V0PENvbXBvbmVudEZpeHR1cmU8dW5rbm93bj4+KCk7XG5cbi8qKlxuICogSW5zdGFsbHMgYSBoYW5kbGVyIGZvciBjaGFuZ2UgZGV0ZWN0aW9uIGJhdGNoaW5nIHN0YXR1cyBjaGFuZ2VzIGZvciBhIHNwZWNpZmljIGZpeHR1cmUuXG4gKiBAcGFyYW0gZml4dHVyZSBUaGUgZml4dHVyZSB0byBoYW5kbGUgY2hhbmdlIGRldGVjdGlvbiBiYXRjaGluZyBmb3IuXG4gKi9cbmZ1bmN0aW9uIGluc3RhbGxBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzSGFuZGxlcihmaXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPHVua25vd24+KSB7XG4gIGlmICghYWN0aXZlRml4dHVyZXMuc2l6ZSkge1xuICAgIGhhbmRsZUF1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXMoKHtpc0Rpc2FibGVkLCBvbkRldGVjdENoYW5nZXNOb3d9KSA9PiB7XG4gICAgICBkaXNhYmxlQXV0b0NoYW5nZURldGVjdGlvbiA9IGlzRGlzYWJsZWQ7XG4gICAgICBpZiAob25EZXRlY3RDaGFuZ2VzTm93KSB7XG4gICAgICAgIFByb21pc2UuYWxsKEFycmF5LmZyb20oYWN0aXZlRml4dHVyZXMpLm1hcChkZXRlY3RDaGFuZ2VzKSkudGhlbihvbkRldGVjdENoYW5nZXNOb3cpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGFjdGl2ZUZpeHR1cmVzLmFkZChmaXh0dXJlKTtcbn1cblxuLyoqXG4gKiBVbmluc3RhbGxzIGEgaGFuZGxlciBmb3IgY2hhbmdlIGRldGVjdGlvbiBiYXRjaGluZyBzdGF0dXMgY2hhbmdlcyBmb3IgYSBzcGVjaWZpYyBmaXh0dXJlLlxuICogQHBhcmFtIGZpeHR1cmUgVGhlIGZpeHR1cmUgdG8gc3RvcCBoYW5kbGluZyBjaGFuZ2UgZGV0ZWN0aW9uIGJhdGNoaW5nIGZvci5cbiAqL1xuZnVuY3Rpb24gdW5pbnN0YWxsQXV0b0NoYW5nZURldGVjdGlvblN0YXR1c0hhbmRsZXIoZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPikge1xuICBhY3RpdmVGaXh0dXJlcy5kZWxldGUoZml4dHVyZSk7XG4gIGlmICghYWN0aXZlRml4dHVyZXMuc2l6ZSkge1xuICAgIHN0b3BIYW5kbGluZ0F1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXMoKTtcbiAgfVxufVxuXG4vKiogV2hldGhlciB3ZSBhcmUgY3VycmVudGx5IGluIHRoZSBmYWtlIGFzeW5jIHpvbmUuICovXG5mdW5jdGlvbiBpc0luRmFrZUFzeW5jWm9uZSgpIHtcbiAgcmV0dXJuIFpvbmUhLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKSAhPSBudWxsO1xufVxuXG4vKipcbiAqIFRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24gZm9yIGEgc3BlY2lmaWMgZml4dHVyZS5cbiAqIEBwYXJhbSBmaXh0dXJlIFRoZSBmaXh0dXJlIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBmb3IuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdENoYW5nZXMoZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPikge1xuICBmaXh0dXJlLmRldGVjdENoYW5nZXMoKTtcbiAgaWYgKGlzSW5GYWtlQXN5bmNab25lKCkpIHtcbiAgICBmbHVzaCgpO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGZpeHR1cmUud2hlblN0YWJsZSgpO1xuICB9XG59XG5cbi8qKiBBIGBIYXJuZXNzRW52aXJvbm1lbnRgIGltcGxlbWVudGF0aW9uIGZvciBBbmd1bGFyJ3MgVGVzdGJlZC4gKi9cbmV4cG9ydCBjbGFzcyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50IGV4dGVuZHMgSGFybmVzc0Vudmlyb25tZW50PEVsZW1lbnQ+IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGVudmlyb25tZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqIE9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgdGVzdCB0YXNrIHN0YXRlIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3Rhc2tTdGF0ZTogT2JzZXJ2YWJsZTxUYXNrU3RhdGU+O1xuXG4gIC8qKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBlbnZpcm9ubWVudC4gKi9cbiAgcHJpdmF0ZSBfb3B0aW9uczogVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnM7XG5cbiAgLyoqIEVudmlyb25tZW50IHN0YWJpbGl6YXRpb24gY2FsbGJhY2sgcGFzc2VkIHRvIHRoZSBjcmVhdGVkIHRlc3QgZWxlbWVudHMuICovXG4gIHByaXZhdGUgX3N0YWJpbGl6ZUNhbGxiYWNrOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICByYXdSb290RWxlbWVudDogRWxlbWVudCxcbiAgICBwcml2YXRlIF9maXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPHVua25vd24+LFxuICAgIG9wdGlvbnM/OiBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIocmF3Um9vdEVsZW1lbnQpO1xuICAgIHRoaXMuX29wdGlvbnMgPSB7Li4uZGVmYXVsdEVudmlyb25tZW50T3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgdGhpcy5fdGFza1N0YXRlID0gVGFza1N0YXRlWm9uZUludGVyY2VwdG9yLnNldHVwKCk7XG4gICAgdGhpcy5fc3RhYmlsaXplQ2FsbGJhY2sgPSAoKSA9PiB0aGlzLmZvcmNlU3RhYmlsaXplKCk7XG4gICAgaW5zdGFsbEF1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXNIYW5kbGVyKF9maXh0dXJlKTtcbiAgICBfZml4dHVyZS5jb21wb25lbnRSZWYub25EZXN0cm95KCgpID0+IHtcbiAgICAgIHVuaW5zdGFsbEF1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXNIYW5kbGVyKF9maXh0dXJlKTtcbiAgICAgIHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIGdpdmVuIGZpeHR1cmUncyByb290IGVsZW1lbnQuICovXG4gIHN0YXRpYyBsb2FkZXIoXG4gICAgZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPixcbiAgICBvcHRpb25zPzogVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMsXG4gICk6IEhhcm5lc3NMb2FkZXIge1xuICAgIHJldHVybiBuZXcgVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudChmaXh0dXJlLm5hdGl2ZUVsZW1lbnQsIGZpeHR1cmUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBgSGFybmVzc0xvYWRlcmAgYXQgdGhlIGRvY3VtZW50IHJvb3QuIFRoaXMgY2FuIGJlIHVzZWQgaWYgaGFybmVzc2VzIGFyZVxuICAgKiBsb2NhdGVkIG91dHNpZGUgb2YgYSBmaXh0dXJlIChlLmcuIG92ZXJsYXlzIGFwcGVuZGVkIHRvIHRoZSBkb2N1bWVudCBib2R5KS5cbiAgICovXG4gIHN0YXRpYyBkb2N1bWVudFJvb3RMb2FkZXIoXG4gICAgZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPixcbiAgICBvcHRpb25zPzogVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMsXG4gICk6IEhhcm5lc3NMb2FkZXIge1xuICAgIHJldHVybiBuZXcgVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudChkb2N1bWVudC5ib2R5LCBmaXh0dXJlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYXRpdmUgRE9NIGVsZW1lbnQgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gVGVzdEVsZW1lbnQuICovXG4gIHN0YXRpYyBnZXROYXRpdmVFbGVtZW50KGVsOiBUZXN0RWxlbWVudCk6IEVsZW1lbnQge1xuICAgIGlmIChlbCBpbnN0YW5jZW9mIFVuaXRUZXN0RWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsLmVsZW1lbnQ7XG4gICAgfVxuICAgIHRocm93IEVycm9yKCdUaGlzIFRlc3RFbGVtZW50IHdhcyBub3QgY3JlYXRlZCBieSB0aGUgVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIGhhcm5lc3MgdHlwZSwgdXNpbmcgdGhlIGZpeHR1cmUncyByb290IGVsZW1lbnQgYXMgdGhlXG4gICAqIGhhcm5lc3MncyBob3N0IGVsZW1lbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSB1c2VkIHdoZW4gY3JlYXRpbmcgYSBoYXJuZXNzIGZvciB0aGUgcm9vdCBlbGVtZW50XG4gICAqIG9mIGEgZml4dHVyZSwgYXMgY29tcG9uZW50cyBkbyBub3QgaGF2ZSB0aGUgY29ycmVjdCBzZWxlY3RvciB3aGVuIHRoZXkgYXJlIGNyZWF0ZWQgYXMgdGhlIHJvb3RcbiAgICogb2YgdGhlIGZpeHR1cmUuXG4gICAqL1xuICBzdGF0aWMgYXN5bmMgaGFybmVzc0ZvckZpeHR1cmU8VCBleHRlbmRzIENvbXBvbmVudEhhcm5lc3M+KFxuICAgIGZpeHR1cmU6IENvbXBvbmVudEZpeHR1cmU8dW5rbm93bj4sXG4gICAgaGFybmVzc1R5cGU6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zPzogVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMsXG4gICk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gbmV3IFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnQoZml4dHVyZS5uYXRpdmVFbGVtZW50LCBmaXh0dXJlLCBvcHRpb25zKTtcbiAgICBhd2FpdCBlbnZpcm9ubWVudC5mb3JjZVN0YWJpbGl6ZSgpO1xuICAgIHJldHVybiBlbnZpcm9ubWVudC5jcmVhdGVDb21wb25lbnRIYXJuZXNzKGhhcm5lc3NUeXBlLCBmaXh0dXJlLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsdXNoZXMgY2hhbmdlIGRldGVjdGlvbiBhbmQgYXN5bmMgdGFza3MgY2FwdHVyZWQgaW4gdGhlIEFuZ3VsYXIgem9uZS5cbiAgICogSW4gbW9zdCBjYXNlcyBpdCBzaG91bGQgbm90IGJlIG5lY2Vzc2FyeSB0byBjYWxsIHRoaXMgbWFudWFsbHkuIEhvd2V2ZXIsIHRoZXJlIG1heSBiZSBzb21lIGVkZ2VcbiAgICogY2FzZXMgd2hlcmUgaXQgaXMgbmVlZGVkIHRvIGZ1bGx5IGZsdXNoIGFuaW1hdGlvbiBldmVudHMuXG4gICAqL1xuICBhc3luYyBmb3JjZVN0YWJpbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWRpc2FibGVBdXRvQ2hhbmdlRGV0ZWN0aW9uKSB7XG4gICAgICBpZiAodGhpcy5fZGVzdHJveWVkKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdIYXJuZXNzIGlzIGF0dGVtcHRpbmcgdG8gdXNlIGEgZml4dHVyZSB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gZGVzdHJveWVkLicpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBkZXRlY3RDaGFuZ2VzKHRoaXMuX2ZpeHR1cmUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXYWl0cyBmb3IgYWxsIHNjaGVkdWxlZCBvciBydW5uaW5nIGFzeW5jIHRhc2tzIHRvIGNvbXBsZXRlLiBUaGlzIGFsbG93cyBoYXJuZXNzXG4gICAqIGF1dGhvcnMgdG8gd2FpdCBmb3IgYXN5bmMgdGFza3Mgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICAgKi9cbiAgYXN5bmMgd2FpdEZvclRhc2tzT3V0c2lkZUFuZ3VsYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gSWYgd2UgcnVuIGluIHRoZSBmYWtlIGFzeW5jIHpvbmUsIHdlIHJ1biBcImZsdXNoXCIgdG8gcnVuIGFueSBzY2hlZHVsZWQgdGFza3MuIFRoaXNcbiAgICAvLyBlbnN1cmVzIHRoYXQgdGhlIGhhcm5lc3NlcyBiZWhhdmUgaW5zaWRlIG9mIHRoZSBGYWtlQXN5bmNUZXN0Wm9uZSBzaW1pbGFyIHRvIHRoZVxuICAgIC8vIFwiQXN5bmNUZXN0Wm9uZVwiIGFuZCB0aGUgcm9vdCB6b25lIChpLmUuIG5laXRoZXIgZmFrZUFzeW5jIG9yIGFzeW5jKS4gTm90ZSB0aGF0IHdlXG4gICAgLy8gY2Fubm90IGp1c3QgcmVseSBvbiB0aGUgdGFzayBzdGF0ZSBvYnNlcnZhYmxlIHRvIGJlY29tZSBzdGFibGUgYmVjYXVzZSB0aGUgc3RhdGUgd2lsbFxuICAgIC8vIG5ldmVyIGNoYW5nZS4gVGhpcyBpcyBiZWNhdXNlIHRoZSB0YXNrIHF1ZXVlIHdpbGwgYmUgb25seSBkcmFpbmVkIGlmIHRoZSBmYWtlIGFzeW5jXG4gICAgLy8gem9uZSBpcyBiZWluZyBmbHVzaGVkLlxuICAgIGlmIChpc0luRmFrZUFzeW5jWm9uZSgpKSB7XG4gICAgICBmbHVzaCgpO1xuICAgIH1cblxuICAgIC8vIFdhaXQgdW50aWwgdGhlIHRhc2sgcXVldWUgaGFzIGJlZW4gZHJhaW5lZCBhbmQgdGhlIHpvbmUgaXMgc3RhYmxlLiBOb3RlIHRoYXRcbiAgICAvLyB3ZSBjYW5ub3QgcmVseSBvbiBcImZpeHR1cmUud2hlblN0YWJsZVwiIHNpbmNlIGl0IGRvZXMgbm90IGNhdGNoIHRhc2tzIHNjaGVkdWxlZFxuICAgIC8vIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS4gRm9yIHRlc3QgaGFybmVzc2VzLCB3ZSB3YW50IHRvIGVuc3VyZSB0aGF0IHRoZVxuICAgIC8vIGFwcCBpcyBmdWxseSBzdGFiaWxpemVkIGFuZCB0aGVyZWZvcmUgbmVlZCB0byB1c2Ugb3VyIG93biB6b25lIGludGVyY2VwdG9yLlxuICAgIGF3YWl0IHRoaXMuX3Rhc2tTdGF0ZS5waXBlKHRha2VXaGlsZShzdGF0ZSA9PiAhc3RhdGUuc3RhYmxlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcm9vdCBlbGVtZW50IGZvciB0aGUgZG9jdW1lbnQuICovXG4gIHByb3RlY3RlZCBnZXREb2N1bWVudFJvb3QoKTogRWxlbWVudCB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmJvZHk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBUZXN0RWxlbWVudGAgZnJvbSBhIHJhdyBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlVGVzdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCk6IFRlc3RFbGVtZW50IHtcbiAgICByZXR1cm4gbmV3IFVuaXRUZXN0RWxlbWVudChlbGVtZW50LCB0aGlzLl9zdGFiaWxpemVDYWxsYmFjayk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIGdpdmVuIHJhdyBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRW52aXJvbm1lbnQoZWxlbWVudDogRWxlbWVudCk6IEhhcm5lc3NFbnZpcm9ubWVudDxFbGVtZW50PiB7XG4gICAgcmV0dXJuIG5ldyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50KGVsZW1lbnQsIHRoaXMuX2ZpeHR1cmUsIHRoaXMuX29wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGFsbCBlbGVtZW50cyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3IgdW5kZXIgdGhpcyBlbnZpcm9ubWVudCdzIHJvb3QgZWxlbWVudC5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBnZXRBbGxSYXdFbGVtZW50cyhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxFbGVtZW50W10+IHtcbiAgICBhd2FpdCB0aGlzLmZvcmNlU3RhYmlsaXplKCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fb3B0aW9ucy5xdWVyeUZuKHNlbGVjdG9yLCB0aGlzLnJhd1Jvb3RFbGVtZW50KSk7XG4gIH1cbn1cbiJdfQ==