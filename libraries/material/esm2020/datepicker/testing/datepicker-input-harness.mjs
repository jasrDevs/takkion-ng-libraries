/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { parallel, TestKey } from '@takkion/ng-cdk/testing';
import { MatDatepickerInputHarnessBase, getInputPredicate } from './datepicker-input-harness-base';
import { closeCalendar, getCalendarId, getCalendar, } from './datepicker-trigger-harness-base';
/** Harness for interacting with a standard Material datepicker inputs in tests. */
export class MatDatepickerInputHarness extends MatDatepickerInputHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDatepickerInputHarness`
     * that meets certain criteria.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getInputPredicate(MatDatepickerInputHarness, options);
    }
    /** Gets whether the calendar associated with the input is open. */
    async isCalendarOpen() {
        // `aria-owns` is set only if there's an open datepicker so we can use it as an indicator.
        const host = await this.host();
        return (await host.getAttribute('aria-owns')) != null;
    }
    /** Opens the calendar associated with the input. */
    async openCalendar() {
        const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
        if (!isDisabled && hasCalendar) {
            // Alt + down arrow is the combination for opening the calendar with the keyboard.
            const host = await this.host();
            return host.sendKeys({ alt: true }, TestKey.DOWN_ARROW);
        }
    }
    /** Closes the calendar associated with the input. */
    async closeCalendar() {
        if (await this.isCalendarOpen()) {
            await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
            // This is necessary so that we wait for the closing animation to finish in touch UI mode.
            await this.forceStabilize();
        }
    }
    /** Whether a calendar is associated with the input. */
    async hasCalendar() {
        return (await getCalendarId(this.host())) != null;
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    async getCalendar(filter = {}) {
        return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
    }
}
MatDatepickerInputHarness.hostSelector = '.mat-datepicker-input';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2RhdGVwaWNrZXIvdGVzdGluZy9kYXRlcGlja2VyLWlucHV0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFtQixRQUFRLEVBQUUsT0FBTyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFekUsT0FBTyxFQUFDLDZCQUE2QixFQUFFLGlCQUFpQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFakcsT0FBTyxFQUVMLGFBQWEsRUFDYixhQUFhLEVBQ2IsV0FBVyxHQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsbUZBQW1GO0FBQ25GLE1BQU0sT0FBTyx5QkFDWCxTQUFRLDZCQUE2QjtJQUtyQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQ1QsVUFBeUMsRUFBRTtRQUUzQyxPQUFPLGlCQUFpQixDQUFDLHlCQUF5QixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsS0FBSyxDQUFDLGNBQWM7UUFDbEIsMEZBQTBGO1FBQzFGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDeEQsQ0FBQztJQUVELG9EQUFvRDtJQUNwRCxLQUFLLENBQUMsWUFBWTtRQUNoQixNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxDQUFDLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDOUIsa0ZBQWtGO1lBQ2xGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDdkQ7SUFDSCxDQUFDO0lBRUQscURBQXFEO0lBQ3JELEtBQUssQ0FBQyxhQUFhO1FBQ2pCLElBQUksTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7WUFDL0IsTUFBTSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7WUFDbkYsMEZBQTBGO1lBQzFGLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxLQUFLLENBQUMsV0FBVztRQUNmLE9BQU8sQ0FBQyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUNwRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFpQyxFQUFFO1FBQ25ELE9BQU8sV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDOztBQXBETSxzQ0FBWSxHQUFHLHVCQUF1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SGFybmVzc1ByZWRpY2F0ZSwgcGFyYWxsZWwsIFRlc3RLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RGF0ZXBpY2tlcklucHV0SGFybmVzc0ZpbHRlcnMsIENhbGVuZGFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzQmFzZSwgZ2V0SW5wdXRQcmVkaWNhdGV9IGZyb20gJy4vZGF0ZXBpY2tlci1pbnB1dC1oYXJuZXNzLWJhc2UnO1xuaW1wb3J0IHtNYXRDYWxlbmRhckhhcm5lc3N9IGZyb20gJy4vY2FsZW5kYXItaGFybmVzcyc7XG5pbXBvcnQge1xuICBEYXRlcGlja2VyVHJpZ2dlcixcbiAgY2xvc2VDYWxlbmRhcixcbiAgZ2V0Q2FsZW5kYXJJZCxcbiAgZ2V0Q2FsZW5kYXIsXG59IGZyb20gJy4vZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZSc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgZGF0ZXBpY2tlciBpbnB1dHMgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzc1xuICBleHRlbmRzIE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3NCYXNlXG4gIGltcGxlbWVudHMgRGF0ZXBpY2tlclRyaWdnZXJcbntcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWRhdGVwaWNrZXItaW5wdXQnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXREYXRlcGlja2VySW5wdXRIYXJuZXNzYFxuICAgKiB0aGF0IG1lZXRzIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBpbnB1dCBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChcbiAgICBvcHRpb25zOiBEYXRlcGlja2VySW5wdXRIYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPE1hdERhdGVwaWNrZXJJbnB1dEhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0SW5wdXRQcmVkaWNhdGUoTWF0RGF0ZXBpY2tlcklucHV0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0IGlzIG9wZW4uICovXG4gIGFzeW5jIGlzQ2FsZW5kYXJPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIC8vIGBhcmlhLW93bnNgIGlzIHNldCBvbmx5IGlmIHRoZXJlJ3MgYW4gb3BlbiBkYXRlcGlja2VyIHNvIHdlIGNhbiB1c2UgaXQgYXMgYW4gaW5kaWNhdG9yLlxuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICByZXR1cm4gKGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdhcmlhLW93bnMnKSkgIT0gbnVsbDtcbiAgfVxuXG4gIC8qKiBPcGVucyB0aGUgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4gKi9cbiAgYXN5bmMgb3BlbkNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IFtpc0Rpc2FibGVkLCBoYXNDYWxlbmRhcl0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbdGhpcy5pc0Rpc2FibGVkKCksIHRoaXMuaGFzQ2FsZW5kYXIoKV0pO1xuXG4gICAgaWYgKCFpc0Rpc2FibGVkICYmIGhhc0NhbGVuZGFyKSB7XG4gICAgICAvLyBBbHQgKyBkb3duIGFycm93IGlzIHRoZSBjb21iaW5hdGlvbiBmb3Igb3BlbmluZyB0aGUgY2FsZW5kYXIgd2l0aCB0aGUga2V5Ym9hcmQuXG4gICAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgICByZXR1cm4gaG9zdC5zZW5kS2V5cyh7YWx0OiB0cnVlfSwgVGVzdEtleS5ET1dOX0FSUk9XKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggdGhlIGlucHV0LiAqL1xuICBhc3luYyBjbG9zZUNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2FsZW5kYXJPcGVuKCkpIHtcbiAgICAgIGF3YWl0IGNsb3NlQ2FsZW5kYXIoZ2V0Q2FsZW5kYXJJZCh0aGlzLmhvc3QoKSksIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKSk7XG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB0aGF0IHdlIHdhaXQgZm9yIHRoZSBjbG9zaW5nIGFuaW1hdGlvbiB0byBmaW5pc2ggaW4gdG91Y2ggVUkgbW9kZS5cbiAgICAgIGF3YWl0IHRoaXMuZm9yY2VTdGFiaWxpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciBhIGNhbGVuZGFyIGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQuICovXG4gIGFzeW5jIGhhc0NhbGVuZGFyKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgZ2V0Q2FsZW5kYXJJZCh0aGlzLmhvc3QoKSkpICE9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgYE1hdENhbGVuZGFySGFybmVzc2AgdGhhdCBpcyBhc3NvY2lhdGVkIHdpdGggdGhlIHRyaWdnZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIGNhbGVuZGFyIGlzIGluY2x1ZGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0Q2FsZW5kYXIoZmlsdGVyOiBDYWxlbmRhckhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdENhbGVuZGFySGFybmVzcz4ge1xuICAgIHJldHVybiBnZXRDYWxlbmRhcihmaWx0ZXIsIHRoaXMuaG9zdCgpLCB0aGlzLmRvY3VtZW50Um9vdExvY2F0b3JGYWN0b3J5KCkpO1xuICB9XG59XG4iXX0=