/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/** The injection token used to specify the virtual scrolling strategy. */
export const VIRTUAL_SCROLL_STRATEGY = new InjectionToken('VIRTUAL_SCROLL_STRATEGY');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1zY3JvbGwtc3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3Njcm9sbGluZy92aXJ0dWFsLXNjcm9sbC1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSTdDLDBFQUEwRTtBQUMxRSxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGNBQWMsQ0FDdkQseUJBQXlCLENBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUge0Nka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydH0gZnJvbSAnLi92aXJ0dWFsLXNjcm9sbC12aWV3cG9ydCc7XG5cbi8qKiBUaGUgaW5qZWN0aW9uIHRva2VuIHVzZWQgdG8gc3BlY2lmeSB0aGUgdmlydHVhbCBzY3JvbGxpbmcgc3RyYXRlZ3kuICovXG5leHBvcnQgY29uc3QgVklSVFVBTF9TQ1JPTExfU1RSQVRFR1kgPSBuZXcgSW5qZWN0aW9uVG9rZW48VmlydHVhbFNjcm9sbFN0cmF0ZWd5PihcbiAgJ1ZJUlRVQUxfU0NST0xMX1NUUkFURUdZJyxcbik7XG5cbi8qKiBBIHN0cmF0ZWd5IHRoYXQgZGljdGF0ZXMgd2hpY2ggaXRlbXMgc2hvdWxkIGJlIHJlbmRlcmVkIGluIHRoZSB2aWV3cG9ydC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmlydHVhbFNjcm9sbFN0cmF0ZWd5IHtcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IHZpc2libGUgaW4gdGhlIHZpZXdwb3J0IGNoYW5nZXMuICovXG4gIHNjcm9sbGVkSW5kZXhDaGFuZ2U6IE9ic2VydmFibGU8bnVtYmVyPjtcblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBzY3JvbGwgc3RyYXRlZ3kgdG8gYSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHZpZXdwb3J0IFRoZSB2aWV3cG9ydCB0byBhdHRhY2ggdGhpcyBzdHJhdGVneSB0by5cbiAgICovXG4gIGF0dGFjaCh2aWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KTogdm9pZDtcblxuICAvKiogRGV0YWNoZXMgdGhpcyBzY3JvbGwgc3RyYXRlZ3kgZnJvbSB0aGUgY3VycmVudGx5IGF0dGFjaGVkIHZpZXdwb3J0LiAqL1xuICBkZXRhY2goKTogdm9pZDtcblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHZpZXdwb3J0IGlzIHNjcm9sbGVkIChkZWJvdW5jZWQgdXNpbmcgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKS4gKi9cbiAgb25Db250ZW50U2Nyb2xsZWQoKTogdm9pZDtcblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIGxlbmd0aCBvZiB0aGUgZGF0YSBjaGFuZ2VzLiAqL1xuICBvbkRhdGFMZW5ndGhDaGFuZ2VkKCk6IHZvaWQ7XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSByYW5nZSBvZiBpdGVtcyByZW5kZXJlZCBpbiB0aGUgRE9NIGhhcyBjaGFuZ2VkLiAqL1xuICBvbkNvbnRlbnRSZW5kZXJlZCgpOiB2b2lkO1xuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgb2Zmc2V0IG9mIHRoZSByZW5kZXJlZCBpdGVtcyBjaGFuZ2VkLiAqL1xuICBvblJlbmRlcmVkT2Zmc2V0Q2hhbmdlZCgpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBTY3JvbGwgdG8gdGhlIG9mZnNldCBmb3IgdGhlIGdpdmVuIGluZGV4LlxuICAgKiBAcGFyYW0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHRvIHNjcm9sbCB0by5cbiAgICogQHBhcmFtIGJlaGF2aW9yIFRoZSBTY3JvbGxCZWhhdmlvciB0byB1c2Ugd2hlbiBzY3JvbGxpbmcuXG4gICAqL1xuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvcik6IHZvaWQ7XG59XG4iXX0=