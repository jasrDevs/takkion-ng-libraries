/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessEnvironment } from '@takkion/ng-cdk/testing';
import * as webdriver from 'selenium-webdriver';
import { SeleniumWebDriverElement } from './selenium-web-driver-element';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: async (selector, root) => root().findElements(webdriver.By.css(selector)),
};
/**
 * This function is meant to be executed in the browser. It taps into the hooks exposed by Angular
 * and invokes the specified `callback` when the application is stable (no more pending tasks).
 */
function whenStable(callback) {
    Promise.all(window.frameworkStabilizers.map(stabilizer => new Promise(stabilizer))).then(callback);
}
/**
 * This function is meant to be executed in the browser. It checks whether the Angular framework has
 * bootstrapped yet.
 */
function isBootstrapped() {
    return !!window.frameworkStabilizers;
}
/** Waits for angular to be ready after the page load. */
export async function waitForAngularReady(wd) {
    await wd.wait(() => wd.executeScript(isBootstrapped));
    await wd.executeAsyncScript(whenStable);
}
/** A `HarnessEnvironment` implementation for WebDriver. */
export class SeleniumWebDriverHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, options) {
        super(rawRootElement);
        this._options = { ...defaultEnvironmentOptions, ...options };
        this._stabilizeCallback = () => this.forceStabilize();
    }
    /** Gets the ElementFinder corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof SeleniumWebDriverElement) {
            return el.element();
        }
        throw Error('This TestElement was not created by the WebDriverHarnessEnvironment');
    }
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(driver, options) {
        return new SeleniumWebDriverHarnessEnvironment(() => driver.findElement(webdriver.By.css('body')), options);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        await this.rawRootElement().getDriver().executeAsyncScript(whenStable);
    }
    /** @docs-private */
    async waitForTasksOutsideAngular() {
        // TODO: figure out how we can do this for the webdriver environment.
        //  https://github.com/angular/components/issues/17412
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return () => this.rawRootElement().getDriver().findElement(webdriver.By.css('body'));
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new SeleniumWebDriverElement(element, this._stabilizeCallback);
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new SeleniumWebDriverHarnessEnvironment(element, this._options);
    }
    // Note: This seems to be working, though we may need to re-evaluate if we encounter issues with
    // stale element references. `() => Promise<webdriver.WebElement[]>` seems like a more correct
    // return type, though supporting it would require changes to the public harness API.
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        const els = await this._options.queryFn(selector, this.rawRootElement);
        return els.map((x) => () => x);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW0td2ViLWRyaXZlci1oYXJuZXNzLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3NlbGVuaXVtLXdlYmRyaXZlci9zZWxlbml1bS13ZWItZHJpdmVyLWhhcm5lc3MtZW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUE2QixNQUFNLHNCQUFzQixDQUFDO0FBQ3BGLE9BQU8sS0FBSyxTQUFTLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUE2QnZFLHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUF1QztJQUNwRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQWdCLEVBQUUsSUFBZ0MsRUFBRSxFQUFFLENBQ3BFLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUNsRCxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBUyxVQUFVLENBQUMsUUFBc0M7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEYsUUFBUSxDQUNULENBQUM7QUFDSixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxjQUFjO0lBQ3JCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztBQUN2QyxDQUFDO0FBRUQseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBdUI7SUFDL0QsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN0RCxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsMkRBQTJEO0FBQzNELE1BQU0sT0FBTyxtQ0FBb0MsU0FBUSxrQkFFeEQ7SUFPQyxZQUNFLGNBQTBDLEVBQzFDLE9BQTRDO1FBRTVDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUMsR0FBRyx5QkFBeUIsRUFBRSxHQUFHLE9BQU8sRUFBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBZTtRQUNyQyxJQUFJLEVBQUUsWUFBWSx3QkFBd0IsRUFBRTtZQUMxQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNyQjtRQUNELE1BQU0sS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxNQUFNLENBQUMsTUFBTSxDQUNYLE1BQTJCLEVBQzNCLE9BQTRDO1FBRTVDLE9BQU8sSUFBSSxtQ0FBbUMsQ0FDNUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUNsRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELG9CQUFvQjtJQUNwQixLQUFLLENBQUMsMEJBQTBCO1FBQzlCLHFFQUFxRTtRQUNyRSxzREFBc0Q7SUFDeEQsQ0FBQztJQUVELDhDQUE4QztJQUNwQyxlQUFlO1FBQ3ZCLE9BQU8sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxrREFBa0Q7SUFDeEMsaUJBQWlCLENBQUMsT0FBbUM7UUFDN0QsT0FBTyxJQUFJLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsaUVBQWlFO0lBQ3ZELGlCQUFpQixDQUN6QixPQUFtQztRQUVuQyxPQUFPLElBQUksbUNBQW1DLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLDhGQUE4RjtJQUM5RixxRkFBcUY7SUFDckY7O09BRUc7SUFDTyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBZ0I7UUFDaEQsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQXVCLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0hhcm5lc3NFbnZpcm9ubWVudCwgSGFybmVzc0xvYWRlciwgVGVzdEVsZW1lbnR9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCAqIGFzIHdlYmRyaXZlciBmcm9tICdzZWxlbml1bS13ZWJkcml2ZXInO1xuaW1wb3J0IHtTZWxlbml1bVdlYkRyaXZlckVsZW1lbnR9IGZyb20gJy4vc2VsZW5pdW0td2ViLWRyaXZlci1lbGVtZW50JztcblxuLyoqXG4gKiBBbiBBbmd1bGFyIGZyYW1ld29yayBzdGFiaWxpemVyIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBjYWxsYmFjayBhbmQgY2FsbHMgaXQgd2hlbiB0aGUgYXBwbGljYXRpb25cbiAqIGlzIHN0YWJsZSwgcGFzc2luZyBhIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBhbnkgd29yayB3YXMgZG9uZS5cbiAqL1xuZGVjbGFyZSBpbnRlcmZhY2UgRnJhbWV3b3JrU3RhYmlsaXplciB7XG4gIChjYWxsYmFjazogKGRpZFdvcms6IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkO1xufVxuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIGludGVyZmFjZSBXaW5kb3cge1xuICAgIC8qKlxuICAgICAqIFRoZXNlIGhvb2tzIGFyZSBleHBvc2VkIGJ5IEFuZ3VsYXIgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayBmb3Igd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgc3RhYmxlXG4gICAgICogKG5vIG1vcmUgcGVuZGluZyB0YXNrcykuXG4gICAgICpcbiAgICAgKiBGb3IgdGhlIGltcGxlbWVudGF0aW9uLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9cbiAgICAgKiAgYW5ndWxhci9hbmd1bGFyL2Jsb2IvbWFpbi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rlc3RhYmlsaXR5LnRzI0wzMC1MNDlcbiAgICAgKi9cbiAgICBmcmFtZXdvcmtTdGFiaWxpemVyczogRnJhbWV3b3JrU3RhYmlsaXplcltdO1xuICB9XG59XG5cbi8qKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgZW52aXJvbm1lbnQuICovXG5leHBvcnQgaW50ZXJmYWNlIFdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMge1xuICAvKiogVGhlIHF1ZXJ5IGZ1bmN0aW9uIHVzZWQgdG8gZmluZCBET00gZWxlbWVudHMuICovXG4gIHF1ZXJ5Rm46IChzZWxlY3Rvcjogc3RyaW5nLCByb290OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCkgPT4gUHJvbWlzZTx3ZWJkcml2ZXIuV2ViRWxlbWVudFtdPjtcbn1cblxuLyoqIFRoZSBkZWZhdWx0IGVudmlyb25tZW50IG9wdGlvbnMuICovXG5jb25zdCBkZWZhdWx0RW52aXJvbm1lbnRPcHRpb25zOiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zID0ge1xuICBxdWVyeUZuOiBhc3luYyAoc2VsZWN0b3I6IHN0cmluZywgcm9vdDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQpID0+XG4gICAgcm9vdCgpLmZpbmRFbGVtZW50cyh3ZWJkcml2ZXIuQnkuY3NzKHNlbGVjdG9yKSksXG59O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgaW4gdGhlIGJyb3dzZXIuIEl0IHRhcHMgaW50byB0aGUgaG9va3MgZXhwb3NlZCBieSBBbmd1bGFyXG4gKiBhbmQgaW52b2tlcyB0aGUgc3BlY2lmaWVkIGBjYWxsYmFja2Agd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgc3RhYmxlIChubyBtb3JlIHBlbmRpbmcgdGFza3MpLlxuICovXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGNhbGxiYWNrOiAoZGlkV29yazogYm9vbGVhbltdKSA9PiB2b2lkKTogdm9pZCB7XG4gIFByb21pc2UuYWxsKHdpbmRvdy5mcmFtZXdvcmtTdGFiaWxpemVycy5tYXAoc3RhYmlsaXplciA9PiBuZXcgUHJvbWlzZShzdGFiaWxpemVyKSkpLnRoZW4oXG4gICAgY2FsbGJhY2ssXG4gICk7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBpbiB0aGUgYnJvd3Nlci4gSXQgY2hlY2tzIHdoZXRoZXIgdGhlIEFuZ3VsYXIgZnJhbWV3b3JrIGhhc1xuICogYm9vdHN0cmFwcGVkIHlldC5cbiAqL1xuZnVuY3Rpb24gaXNCb290c3RyYXBwZWQoKSB7XG4gIHJldHVybiAhIXdpbmRvdy5mcmFtZXdvcmtTdGFiaWxpemVycztcbn1cblxuLyoqIFdhaXRzIGZvciBhbmd1bGFyIHRvIGJlIHJlYWR5IGFmdGVyIHRoZSBwYWdlIGxvYWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvckFuZ3VsYXJSZWFkeSh3ZDogd2ViZHJpdmVyLldlYkRyaXZlcikge1xuICBhd2FpdCB3ZC53YWl0KCgpID0+IHdkLmV4ZWN1dGVTY3JpcHQoaXNCb290c3RyYXBwZWQpKTtcbiAgYXdhaXQgd2QuZXhlY3V0ZUFzeW5jU2NyaXB0KHdoZW5TdGFibGUpO1xufVxuXG4vKiogQSBgSGFybmVzc0Vudmlyb25tZW50YCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViRHJpdmVyLiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVuaXVtV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50IGV4dGVuZHMgSGFybmVzc0Vudmlyb25tZW50PFxuICAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudFxuPiB7XG4gIC8qKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBlbnZpcm9ubWVudC4gKi9cbiAgcHJpdmF0ZSBfb3B0aW9uczogV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50T3B0aW9ucztcblxuICAvKiogRW52aXJvbm1lbnQgc3RhYmlsaXphdGlvbiBjYWxsYmFjayBwYXNzZWQgdG8gdGhlIGNyZWF0ZWQgdGVzdCBlbGVtZW50cy4gKi9cbiAgcHJpdmF0ZSBfc3RhYmlsaXplQ2FsbGJhY2s6ICgpID0+IFByb21pc2U8dm9pZD47XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIHJhd1Jvb3RFbGVtZW50OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCxcbiAgICBvcHRpb25zPzogV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKSB7XG4gICAgc3VwZXIocmF3Um9vdEVsZW1lbnQpO1xuICAgIHRoaXMuX29wdGlvbnMgPSB7Li4uZGVmYXVsdEVudmlyb25tZW50T3B0aW9ucywgLi4ub3B0aW9uc307XG4gICAgdGhpcy5fc3RhYmlsaXplQ2FsbGJhY2sgPSAoKSA9PiB0aGlzLmZvcmNlU3RhYmlsaXplKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgRWxlbWVudEZpbmRlciBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBUZXN0RWxlbWVudC4gKi9cbiAgc3RhdGljIGdldE5hdGl2ZUVsZW1lbnQoZWw6IFRlc3RFbGVtZW50KTogd2ViZHJpdmVyLldlYkVsZW1lbnQge1xuICAgIGlmIChlbCBpbnN0YW5jZW9mIFNlbGVuaXVtV2ViRHJpdmVyRWxlbWVudCkge1xuICAgICAgcmV0dXJuIGVsLmVsZW1lbnQoKTtcbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoJ1RoaXMgVGVzdEVsZW1lbnQgd2FzIG5vdCBjcmVhdGVkIGJ5IHRoZSBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnQnKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYEhhcm5lc3NMb2FkZXJgIHJvb3RlZCBhdCB0aGUgZG9jdW1lbnQgcm9vdC4gKi9cbiAgc3RhdGljIGxvYWRlcihcbiAgICBkcml2ZXI6IHdlYmRyaXZlci5XZWJEcml2ZXIsXG4gICAgb3B0aW9ucz86IFdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMsXG4gICk6IEhhcm5lc3NMb2FkZXIge1xuICAgIHJldHVybiBuZXcgU2VsZW5pdW1XZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnQoXG4gICAgICAoKSA9PiBkcml2ZXIuZmluZEVsZW1lbnQod2ViZHJpdmVyLkJ5LmNzcygnYm9keScpKSxcbiAgICAgIG9wdGlvbnMsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGbHVzaGVzIGNoYW5nZSBkZXRlY3Rpb24gYW5kIGFzeW5jIHRhc2tzIGNhcHR1cmVkIGluIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqIEluIG1vc3QgY2FzZXMgaXQgc2hvdWxkIG5vdCBiZSBuZWNlc3NhcnkgdG8gY2FsbCB0aGlzIG1hbnVhbGx5LiBIb3dldmVyLCB0aGVyZSBtYXkgYmUgc29tZSBlZGdlXG4gICAqIGNhc2VzIHdoZXJlIGl0IGlzIG5lZWRlZCB0byBmdWxseSBmbHVzaCBhbmltYXRpb24gZXZlbnRzLlxuICAgKi9cbiAgYXN5bmMgZm9yY2VTdGFiaWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5yYXdSb290RWxlbWVudCgpLmdldERyaXZlcigpLmV4ZWN1dGVBc3luY1NjcmlwdCh3aGVuU3RhYmxlKTtcbiAgfVxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIGFzeW5jIHdhaXRGb3JUYXNrc091dHNpZGVBbmd1bGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgaG93IHdlIGNhbiBkbyB0aGlzIGZvciB0aGUgd2ViZHJpdmVyIGVudmlyb25tZW50LlxuICAgIC8vICBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xNzQxMlxuICB9XG5cbiAgLyoqIEdldHMgdGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIGRvY3VtZW50LiAqL1xuICBwcm90ZWN0ZWQgZ2V0RG9jdW1lbnRSb290KCk6ICgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50IHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5yYXdSb290RWxlbWVudCgpLmdldERyaXZlcigpLmZpbmRFbGVtZW50KHdlYmRyaXZlci5CeS5jc3MoJ2JvZHknKSk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBUZXN0RWxlbWVudGAgZnJvbSBhIHJhdyBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlVGVzdEVsZW1lbnQoZWxlbWVudDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQpOiBUZXN0RWxlbWVudCB7XG4gICAgcmV0dXJuIG5ldyBTZWxlbml1bVdlYkRyaXZlckVsZW1lbnQoZWxlbWVudCwgdGhpcy5fc3RhYmlsaXplQ2FsbGJhY2spO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBgSGFybmVzc0xvYWRlcmAgcm9vdGVkIGF0IHRoZSBnaXZlbiByYXcgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUVudmlyb25tZW50KFxuICAgIGVsZW1lbnQ6ICgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50LFxuICApOiBIYXJuZXNzRW52aXJvbm1lbnQ8KCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQ+IHtcbiAgICByZXR1cm4gbmV3IFNlbGVuaXVtV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50KGVsZW1lbnQsIHRoaXMuX29wdGlvbnMpO1xuICB9XG5cbiAgLy8gTm90ZTogVGhpcyBzZWVtcyB0byBiZSB3b3JraW5nLCB0aG91Z2ggd2UgbWF5IG5lZWQgdG8gcmUtZXZhbHVhdGUgaWYgd2UgZW5jb3VudGVyIGlzc3VlcyB3aXRoXG4gIC8vIHN0YWxlIGVsZW1lbnQgcmVmZXJlbmNlcy4gYCgpID0+IFByb21pc2U8d2ViZHJpdmVyLldlYkVsZW1lbnRbXT5gIHNlZW1zIGxpa2UgYSBtb3JlIGNvcnJlY3RcbiAgLy8gcmV0dXJuIHR5cGUsIHRob3VnaCBzdXBwb3J0aW5nIGl0IHdvdWxkIHJlcXVpcmUgY2hhbmdlcyB0byB0aGUgcHVibGljIGhhcm5lc3MgQVBJLlxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvciB1bmRlciB0aGlzIGVudmlyb25tZW50J3Mgcm9vdCBlbGVtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIGdldEFsbFJhd0VsZW1lbnRzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPCgoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudClbXT4ge1xuICAgIGNvbnN0IGVscyA9IGF3YWl0IHRoaXMuX29wdGlvbnMucXVlcnlGbihzZWxlY3RvciwgdGhpcy5yYXdSb290RWxlbWVudCk7XG4gICAgcmV0dXJuIGVscy5tYXAoKHg6IHdlYmRyaXZlci5XZWJFbGVtZW50KSA9PiAoKSA9PiB4KTtcbiAgfVxufVxuIl19