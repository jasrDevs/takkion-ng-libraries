/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject } from 'rxjs';
/** Subject used to dispatch and listen for changes to the auto change detection status . */
const autoChangeDetectionSubject = new BehaviorSubject({
    isDisabled: false,
});
/** The current subscription to `autoChangeDetectionSubject`. */
let autoChangeDetectionSubscription;
/**
 * The default handler for auto change detection status changes. This handler will be used if the
 * specific environment does not install its own.
 * @param status The new auto change detection status.
 */
function defaultAutoChangeDetectionHandler(status) {
    status.onDetectChangesNow?.();
}
/**
 * Allows a test `HarnessEnvironment` to install its own handler for auto change detection status
 * changes.
 * @param handler The handler for the auto change detection status.
 */
export function handleAutoChangeDetectionStatus(handler) {
    stopHandlingAutoChangeDetectionStatus();
    autoChangeDetectionSubscription = autoChangeDetectionSubject.subscribe(handler);
}
/** Allows a `HarnessEnvironment` to stop handling auto change detection status changes. */
export function stopHandlingAutoChangeDetectionStatus() {
    autoChangeDetectionSubscription?.unsubscribe();
    autoChangeDetectionSubscription = null;
}
/**
 * Batches together triggering of change detection over the duration of the given function.
 * @param fn The function to call with batched change detection.
 * @param triggerBeforeAndAfter Optionally trigger change detection once before and after the batch
 *   operation. If false, change detection will not be triggered.
 * @return The result of the given function.
 */
async function batchChangeDetection(fn, triggerBeforeAndAfter) {
    // If change detection batching is already in progress, just run the function.
    if (autoChangeDetectionSubject.getValue().isDisabled) {
        return await fn();
    }
    // If nothing is handling change detection batching, install the default handler.
    if (!autoChangeDetectionSubscription) {
        handleAutoChangeDetectionStatus(defaultAutoChangeDetectionHandler);
    }
    if (triggerBeforeAndAfter) {
        await new Promise(resolve => autoChangeDetectionSubject.next({
            isDisabled: true,
            onDetectChangesNow: resolve,
        }));
        // The function passed in may throw (e.g. if the user wants to make an expectation of an error
        // being thrown. If this happens, we need to make sure we still re-enable change detection, so
        // we wrap it in a `finally` block.
        try {
            return await fn();
        }
        finally {
            await new Promise(resolve => autoChangeDetectionSubject.next({
                isDisabled: false,
                onDetectChangesNow: resolve,
            }));
        }
    }
    else {
        autoChangeDetectionSubject.next({ isDisabled: true });
        // The function passed in may throw (e.g. if the user wants to make an expectation of an error
        // being thrown. If this happens, we need to make sure we still re-enable change detection, so
        // we wrap it in a `finally` block.
        try {
            return await fn();
        }
        finally {
            autoChangeDetectionSubject.next({ isDisabled: false });
        }
    }
}
/**
 * Disables the harness system's auto change detection for the duration of the given function.
 * @param fn The function to disable auto change detection for.
 * @return The result of the given function.
 */
export async function manualChangeDetection(fn) {
    return batchChangeDetection(fn, false);
}
/**
 * Resolves the given list of async values in parallel (i.e. via Promise.all) while batching change
 * detection over the entire operation such that change detection occurs exactly once before
 * resolving the values and once after.
 * @param values A getter for the async values to resolve in parallel with batched change detection.
 * @return The resolved values.
 */
export async function parallel(values) {
    return batchChangeDetection(() => Promise.all(values()), true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLWRldGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvdGVzdGluZy9jaGFuZ2UtZGV0ZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFjbkQsNEZBQTRGO0FBQzVGLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxlQUFlLENBQTRCO0lBQ2hGLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQztBQUVILGdFQUFnRTtBQUNoRSxJQUFJLCtCQUFvRCxDQUFDO0FBRXpEOzs7O0dBSUc7QUFDSCxTQUFTLGlDQUFpQyxDQUFDLE1BQWlDO0lBQzFFLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxFQUFFLENBQUM7QUFDaEMsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsK0JBQStCLENBQzdDLE9BQW9EO0lBRXBELHFDQUFxQyxFQUFFLENBQUM7SUFDeEMsK0JBQStCLEdBQUcsMEJBQTBCLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCwyRkFBMkY7QUFDM0YsTUFBTSxVQUFVLHFDQUFxQztJQUNuRCwrQkFBK0IsRUFBRSxXQUFXLEVBQUUsQ0FBQztJQUMvQywrQkFBK0IsR0FBRyxJQUFJLENBQUM7QUFDekMsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILEtBQUssVUFBVSxvQkFBb0IsQ0FBSSxFQUFvQixFQUFFLHFCQUE4QjtJQUN6Riw4RUFBOEU7SUFDOUUsSUFBSSwwQkFBMEIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyRCxPQUFPLE1BQU0sRUFBRSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGlGQUFpRjtJQUNqRixJQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztRQUNyQywrQkFBK0IsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxJQUFJLHFCQUFxQixFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUMxQiwwQkFBMEIsQ0FBQyxJQUFJLENBQUM7WUFDOUIsVUFBVSxFQUFFLElBQUk7WUFDaEIsa0JBQWtCLEVBQUUsT0FBcUI7U0FDMUMsQ0FBQyxDQUNILENBQUM7UUFDRiw4RkFBOEY7UUFDOUYsOEZBQThGO1FBQzlGLG1DQUFtQztRQUNuQyxJQUFJLENBQUM7WUFDSCxPQUFPLE1BQU0sRUFBRSxFQUFFLENBQUM7UUFDcEIsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUMxQiwwQkFBMEIsQ0FBQyxJQUFJLENBQUM7Z0JBQzlCLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRSxPQUFxQjthQUMxQyxDQUFDLENBQ0gsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDO1NBQU0sQ0FBQztRQUNOLDBCQUEwQixDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ3BELDhGQUE4RjtRQUM5Riw4RkFBOEY7UUFDOUYsbUNBQW1DO1FBQ25DLElBQUksQ0FBQztZQUNILE9BQU8sTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUNwQixDQUFDO2dCQUFTLENBQUM7WUFDVCwwQkFBMEIsQ0FBQyxJQUFJLENBQUMsRUFBQyxVQUFVLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxxQkFBcUIsQ0FBSSxFQUFvQjtJQUNqRSxPQUFPLG9CQUFvQixDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBa0VEOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsUUFBUSxDQUFJLE1BQTBDO0lBQzFFLE9BQU8sb0JBQW9CLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5cbi8qKiBSZXByZXNlbnRzIHRoZSBzdGF0dXMgb2YgYXV0byBjaGFuZ2UgZGV0ZWN0aW9uLiAqL1xuZXhwb3J0IGludGVyZmFjZSBBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzIHtcbiAgLyoqIFdoZXRoZXIgYXV0byBjaGFuZ2UgZGV0ZWN0aW9uIGlzIGRpc2FibGVkLiAqL1xuICBpc0Rpc2FibGVkOiBib29sZWFuO1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgY2FsbGJhY2ssIGlmIHByZXNlbnQgaXQgaW5kaWNhdGVzIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBzaG91bGQgYmUgcnVuIGltbWVkaWF0ZWx5LFxuICAgKiB3aGlsZSBoYW5kbGluZyB0aGUgc3RhdHVzIGNoYW5nZS4gVGhlIGNhbGxiYWNrIHNob3VsZCB0aGVuIGJlIGNhbGxlZCBhcyBzb29uIGFzIGNoYW5nZVxuICAgKiBkZXRlY3Rpb24gaXMgZG9uZS5cbiAgICovXG4gIG9uRGV0ZWN0Q2hhbmdlc05vdz86ICgpID0+IHZvaWQ7XG59XG5cbi8qKiBTdWJqZWN0IHVzZWQgdG8gZGlzcGF0Y2ggYW5kIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgYXV0byBjaGFuZ2UgZGV0ZWN0aW9uIHN0YXR1cyAuICovXG5jb25zdCBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QXV0b0NoYW5nZURldGVjdGlvblN0YXR1cz4oe1xuICBpc0Rpc2FibGVkOiBmYWxzZSxcbn0pO1xuXG4vKiogVGhlIGN1cnJlbnQgc3Vic2NyaXB0aW9uIHRvIGBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3ViamVjdGAuICovXG5sZXQgYXV0b0NoYW5nZURldGVjdGlvblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbDtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBoYW5kbGVyIGZvciBhdXRvIGNoYW5nZSBkZXRlY3Rpb24gc3RhdHVzIGNoYW5nZXMuIFRoaXMgaGFuZGxlciB3aWxsIGJlIHVzZWQgaWYgdGhlXG4gKiBzcGVjaWZpYyBlbnZpcm9ubWVudCBkb2VzIG5vdCBpbnN0YWxsIGl0cyBvd24uXG4gKiBAcGFyYW0gc3RhdHVzIFRoZSBuZXcgYXV0byBjaGFuZ2UgZGV0ZWN0aW9uIHN0YXR1cy5cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdEF1dG9DaGFuZ2VEZXRlY3Rpb25IYW5kbGVyKHN0YXR1czogQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cykge1xuICBzdGF0dXMub25EZXRlY3RDaGFuZ2VzTm93Py4oKTtcbn1cblxuLyoqXG4gKiBBbGxvd3MgYSB0ZXN0IGBIYXJuZXNzRW52aXJvbm1lbnRgIHRvIGluc3RhbGwgaXRzIG93biBoYW5kbGVyIGZvciBhdXRvIGNoYW5nZSBkZXRlY3Rpb24gc3RhdHVzXG4gKiBjaGFuZ2VzLlxuICogQHBhcmFtIGhhbmRsZXIgVGhlIGhhbmRsZXIgZm9yIHRoZSBhdXRvIGNoYW5nZSBkZXRlY3Rpb24gc3RhdHVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cyhcbiAgaGFuZGxlcjogKHN0YXR1czogQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cykgPT4gdm9pZCxcbikge1xuICBzdG9wSGFuZGxpbmdBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzKCk7XG4gIGF1dG9DaGFuZ2VEZXRlY3Rpb25TdWJzY3JpcHRpb24gPSBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3ViamVjdC5zdWJzY3JpYmUoaGFuZGxlcik7XG59XG5cbi8qKiBBbGxvd3MgYSBgSGFybmVzc0Vudmlyb25tZW50YCB0byBzdG9wIGhhbmRsaW5nIGF1dG8gY2hhbmdlIGRldGVjdGlvbiBzdGF0dXMgY2hhbmdlcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdG9wSGFuZGxpbmdBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzKCkge1xuICBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3Vic2NyaXB0aW9uID0gbnVsbDtcbn1cblxuLyoqXG4gKiBCYXRjaGVzIHRvZ2V0aGVyIHRyaWdnZXJpbmcgb2YgY2hhbmdlIGRldGVjdGlvbiBvdmVyIHRoZSBkdXJhdGlvbiBvZiB0aGUgZ2l2ZW4gZnVuY3Rpb24uXG4gKiBAcGFyYW0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcGFyYW0gdHJpZ2dlckJlZm9yZUFuZEFmdGVyIE9wdGlvbmFsbHkgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uIG9uY2UgYmVmb3JlIGFuZCBhZnRlciB0aGUgYmF0Y2hcbiAqICAgb3BlcmF0aW9uLiBJZiBmYWxzZSwgY2hhbmdlIGRldGVjdGlvbiB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQuXG4gKiBAcmV0dXJuIFRoZSByZXN1bHQgb2YgdGhlIGdpdmVuIGZ1bmN0aW9uLlxuICovXG5hc3luYyBmdW5jdGlvbiBiYXRjaENoYW5nZURldGVjdGlvbjxUPihmbjogKCkgPT4gUHJvbWlzZTxUPiwgdHJpZ2dlckJlZm9yZUFuZEFmdGVyOiBib29sZWFuKSB7XG4gIC8vIElmIGNoYW5nZSBkZXRlY3Rpb24gYmF0Y2hpbmcgaXMgYWxyZWFkeSBpbiBwcm9ncmVzcywganVzdCBydW4gdGhlIGZ1bmN0aW9uLlxuICBpZiAoYXV0b0NoYW5nZURldGVjdGlvblN1YmplY3QuZ2V0VmFsdWUoKS5pc0Rpc2FibGVkKSB7XG4gICAgcmV0dXJuIGF3YWl0IGZuKCk7XG4gIH1cblxuICAvLyBJZiBub3RoaW5nIGlzIGhhbmRsaW5nIGNoYW5nZSBkZXRlY3Rpb24gYmF0Y2hpbmcsIGluc3RhbGwgdGhlIGRlZmF1bHQgaGFuZGxlci5cbiAgaWYgKCFhdXRvQ2hhbmdlRGV0ZWN0aW9uU3Vic2NyaXB0aW9uKSB7XG4gICAgaGFuZGxlQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cyhkZWZhdWx0QXV0b0NoYW5nZURldGVjdGlvbkhhbmRsZXIpO1xuICB9XG5cbiAgaWYgKHRyaWdnZXJCZWZvcmVBbmRBZnRlcikge1xuICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT5cbiAgICAgIGF1dG9DaGFuZ2VEZXRlY3Rpb25TdWJqZWN0Lm5leHQoe1xuICAgICAgICBpc0Rpc2FibGVkOiB0cnVlLFxuICAgICAgICBvbkRldGVjdENoYW5nZXNOb3c6IHJlc29sdmUgYXMgKCkgPT4gdm9pZCxcbiAgICAgIH0pLFxuICAgICk7XG4gICAgLy8gVGhlIGZ1bmN0aW9uIHBhc3NlZCBpbiBtYXkgdGhyb3cgKGUuZy4gaWYgdGhlIHVzZXIgd2FudHMgdG8gbWFrZSBhbiBleHBlY3RhdGlvbiBvZiBhbiBlcnJvclxuICAgIC8vIGJlaW5nIHRocm93bi4gSWYgdGhpcyBoYXBwZW5zLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBzdGlsbCByZS1lbmFibGUgY2hhbmdlIGRldGVjdGlvbiwgc29cbiAgICAvLyB3ZSB3cmFwIGl0IGluIGEgYGZpbmFsbHlgIGJsb2NrLlxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PlxuICAgICAgICBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3ViamVjdC5uZXh0KHtcbiAgICAgICAgICBpc0Rpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgICBvbkRldGVjdENoYW5nZXNOb3c6IHJlc29sdmUgYXMgKCkgPT4gdm9pZCxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhdXRvQ2hhbmdlRGV0ZWN0aW9uU3ViamVjdC5uZXh0KHtpc0Rpc2FibGVkOiB0cnVlfSk7XG4gICAgLy8gVGhlIGZ1bmN0aW9uIHBhc3NlZCBpbiBtYXkgdGhyb3cgKGUuZy4gaWYgdGhlIHVzZXIgd2FudHMgdG8gbWFrZSBhbiBleHBlY3RhdGlvbiBvZiBhbiBlcnJvclxuICAgIC8vIGJlaW5nIHRocm93bi4gSWYgdGhpcyBoYXBwZW5zLCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB3ZSBzdGlsbCByZS1lbmFibGUgY2hhbmdlIGRldGVjdGlvbiwgc29cbiAgICAvLyB3ZSB3cmFwIGl0IGluIGEgYGZpbmFsbHlgIGJsb2NrLlxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZm4oKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXV0b0NoYW5nZURldGVjdGlvblN1YmplY3QubmV4dCh7aXNEaXNhYmxlZDogZmFsc2V9KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlcyB0aGUgaGFybmVzcyBzeXN0ZW0ncyBhdXRvIGNoYW5nZSBkZXRlY3Rpb24gZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgZ2l2ZW4gZnVuY3Rpb24uXG4gKiBAcGFyYW0gZm4gVGhlIGZ1bmN0aW9uIHRvIGRpc2FibGUgYXV0byBjaGFuZ2UgZGV0ZWN0aW9uIGZvci5cbiAqIEByZXR1cm4gVGhlIHJlc3VsdCBvZiB0aGUgZ2l2ZW4gZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYW51YWxDaGFuZ2VEZXRlY3Rpb248VD4oZm46ICgpID0+IFByb21pc2U8VD4pIHtcbiAgcmV0dXJuIGJhdGNoQ2hhbmdlRGV0ZWN0aW9uKGZuLCBmYWxzZSk7XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgYXN5bmMgdmFsdWVzIGluIHBhcmFsbGVsIChpLmUuIHZpYSBQcm9taXNlLmFsbCkgd2hpbGUgYmF0Y2hpbmcgY2hhbmdlXG4gKiBkZXRlY3Rpb24gb3ZlciB0aGUgZW50aXJlIG9wZXJhdGlvbiBzdWNoIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBvY2N1cnMgZXhhY3RseSBvbmNlIGJlZm9yZVxuICogcmVzb2x2aW5nIHRoZSB2YWx1ZXMgYW5kIG9uY2UgYWZ0ZXIuXG4gKiBAcGFyYW0gdmFsdWVzIEEgZ2V0dGVyIGZvciB0aGUgYXN5bmMgdmFsdWVzIHRvIHJlc29sdmUgaW4gcGFyYWxsZWwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcmV0dXJuIFRoZSByZXNvbHZlZCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbDxUMSwgVDIsIFQzLCBUNCwgVDU+KFxuICB2YWx1ZXM6ICgpID0+IFtcbiAgICBUMSB8IFByb21pc2VMaWtlPFQxPixcbiAgICBUMiB8IFByb21pc2VMaWtlPFQyPixcbiAgICBUMyB8IFByb21pc2VMaWtlPFQzPixcbiAgICBUNCB8IFByb21pc2VMaWtlPFQ0PixcbiAgICBUNSB8IFByb21pc2VMaWtlPFQ1PixcbiAgXSxcbik6IFByb21pc2U8W1QxLCBUMiwgVDMsIFQ0LCBUNV0+O1xuXG4vKipcbiAqIFJlc29sdmVzIHRoZSBnaXZlbiBsaXN0IG9mIGFzeW5jIHZhbHVlcyBpbiBwYXJhbGxlbCAoaS5lLiB2aWEgUHJvbWlzZS5hbGwpIHdoaWxlIGJhdGNoaW5nIGNoYW5nZVxuICogZGV0ZWN0aW9uIG92ZXIgdGhlIGVudGlyZSBvcGVyYXRpb24gc3VjaCB0aGF0IGNoYW5nZSBkZXRlY3Rpb24gb2NjdXJzIGV4YWN0bHkgb25jZSBiZWZvcmVcbiAqIHJlc29sdmluZyB0aGUgdmFsdWVzIGFuZCBvbmNlIGFmdGVyLlxuICogQHBhcmFtIHZhbHVlcyBBIGdldHRlciBmb3IgdGhlIGFzeW5jIHZhbHVlcyB0byByZXNvbHZlIGluIHBhcmFsbGVsIHdpdGggYmF0Y2hlZCBjaGFuZ2UgZGV0ZWN0aW9uLlxuICogQHJldHVybiBUaGUgcmVzb2x2ZWQgdmFsdWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWw8VDEsIFQyLCBUMywgVDQ+KFxuICB2YWx1ZXM6ICgpID0+IFtcbiAgICBUMSB8IFByb21pc2VMaWtlPFQxPixcbiAgICBUMiB8IFByb21pc2VMaWtlPFQyPixcbiAgICBUMyB8IFByb21pc2VMaWtlPFQzPixcbiAgICBUNCB8IFByb21pc2VMaWtlPFQ0PixcbiAgXSxcbik6IFByb21pc2U8W1QxLCBUMiwgVDMsIFQ0XT47XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgYXN5bmMgdmFsdWVzIGluIHBhcmFsbGVsIChpLmUuIHZpYSBQcm9taXNlLmFsbCkgd2hpbGUgYmF0Y2hpbmcgY2hhbmdlXG4gKiBkZXRlY3Rpb24gb3ZlciB0aGUgZW50aXJlIG9wZXJhdGlvbiBzdWNoIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBvY2N1cnMgZXhhY3RseSBvbmNlIGJlZm9yZVxuICogcmVzb2x2aW5nIHRoZSB2YWx1ZXMgYW5kIG9uY2UgYWZ0ZXIuXG4gKiBAcGFyYW0gdmFsdWVzIEEgZ2V0dGVyIGZvciB0aGUgYXN5bmMgdmFsdWVzIHRvIHJlc29sdmUgaW4gcGFyYWxsZWwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcmV0dXJuIFRoZSByZXNvbHZlZCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbDxUMSwgVDIsIFQzPihcbiAgdmFsdWVzOiAoKSA9PiBbVDEgfCBQcm9taXNlTGlrZTxUMT4sIFQyIHwgUHJvbWlzZUxpa2U8VDI+LCBUMyB8IFByb21pc2VMaWtlPFQzPl0sXG4pOiBQcm9taXNlPFtUMSwgVDIsIFQzXT47XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgYXN5bmMgdmFsdWVzIGluIHBhcmFsbGVsIChpLmUuIHZpYSBQcm9taXNlLmFsbCkgd2hpbGUgYmF0Y2hpbmcgY2hhbmdlXG4gKiBkZXRlY3Rpb24gb3ZlciB0aGUgZW50aXJlIG9wZXJhdGlvbiBzdWNoIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBvY2N1cnMgZXhhY3RseSBvbmNlIGJlZm9yZVxuICogcmVzb2x2aW5nIHRoZSB2YWx1ZXMgYW5kIG9uY2UgYWZ0ZXIuXG4gKiBAcGFyYW0gdmFsdWVzIEEgZ2V0dGVyIGZvciB0aGUgYXN5bmMgdmFsdWVzIHRvIHJlc29sdmUgaW4gcGFyYWxsZWwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcmV0dXJuIFRoZSByZXNvbHZlZCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbDxUMSwgVDI+KFxuICB2YWx1ZXM6ICgpID0+IFtUMSB8IFByb21pc2VMaWtlPFQxPiwgVDIgfCBQcm9taXNlTGlrZTxUMj5dLFxuKTogUHJvbWlzZTxbVDEsIFQyXT47XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgYXN5bmMgdmFsdWVzIGluIHBhcmFsbGVsIChpLmUuIHZpYSBQcm9taXNlLmFsbCkgd2hpbGUgYmF0Y2hpbmcgY2hhbmdlXG4gKiBkZXRlY3Rpb24gb3ZlciB0aGUgZW50aXJlIG9wZXJhdGlvbiBzdWNoIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBvY2N1cnMgZXhhY3RseSBvbmNlIGJlZm9yZVxuICogcmVzb2x2aW5nIHRoZSB2YWx1ZXMgYW5kIG9uY2UgYWZ0ZXIuXG4gKiBAcGFyYW0gdmFsdWVzIEEgZ2V0dGVyIGZvciB0aGUgYXN5bmMgdmFsdWVzIHRvIHJlc29sdmUgaW4gcGFyYWxsZWwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcmV0dXJuIFRoZSByZXNvbHZlZCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbDxUPih2YWx1ZXM6ICgpID0+IChUIHwgUHJvbWlzZUxpa2U8VD4pW10pOiBQcm9taXNlPFRbXT47XG5cbi8qKlxuICogUmVzb2x2ZXMgdGhlIGdpdmVuIGxpc3Qgb2YgYXN5bmMgdmFsdWVzIGluIHBhcmFsbGVsIChpLmUuIHZpYSBQcm9taXNlLmFsbCkgd2hpbGUgYmF0Y2hpbmcgY2hhbmdlXG4gKiBkZXRlY3Rpb24gb3ZlciB0aGUgZW50aXJlIG9wZXJhdGlvbiBzdWNoIHRoYXQgY2hhbmdlIGRldGVjdGlvbiBvY2N1cnMgZXhhY3RseSBvbmNlIGJlZm9yZVxuICogcmVzb2x2aW5nIHRoZSB2YWx1ZXMgYW5kIG9uY2UgYWZ0ZXIuXG4gKiBAcGFyYW0gdmFsdWVzIEEgZ2V0dGVyIGZvciB0aGUgYXN5bmMgdmFsdWVzIHRvIHJlc29sdmUgaW4gcGFyYWxsZWwgd2l0aCBiYXRjaGVkIGNoYW5nZSBkZXRlY3Rpb24uXG4gKiBAcmV0dXJuIFRoZSByZXNvbHZlZCB2YWx1ZXMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXJhbGxlbDxUPih2YWx1ZXM6ICgpID0+IEl0ZXJhYmxlPFQgfCBQcm9taXNlTGlrZTxUPj4pOiBQcm9taXNlPFRbXT4ge1xuICByZXR1cm4gYmF0Y2hDaGFuZ2VEZXRlY3Rpb24oKCkgPT4gUHJvbWlzZS5hbGwodmFsdWVzKCkpLCB0cnVlKTtcbn1cbiJdfQ==