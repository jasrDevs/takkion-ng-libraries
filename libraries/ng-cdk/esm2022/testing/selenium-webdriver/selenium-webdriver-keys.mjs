/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TestKey } from '@takkion/ng-cdk/testing';
import * as webdriver from 'selenium-webdriver';
/**
 * Maps the `TestKey` constants to WebDriver's `webdriver.Key` constants.
 * See https://github.com/SeleniumHQ/selenium/blob/trunk/javascript/webdriver/key.js#L29
 */
export const seleniumWebDriverKeyMap = {
    [TestKey.BACKSPACE]: webdriver.Key.BACK_SPACE,
    [TestKey.TAB]: webdriver.Key.TAB,
    [TestKey.ENTER]: webdriver.Key.ENTER,
    [TestKey.SHIFT]: webdriver.Key.SHIFT,
    [TestKey.CONTROL]: webdriver.Key.CONTROL,
    [TestKey.ALT]: webdriver.Key.ALT,
    [TestKey.ESCAPE]: webdriver.Key.ESCAPE,
    [TestKey.PAGE_UP]: webdriver.Key.PAGE_UP,
    [TestKey.PAGE_DOWN]: webdriver.Key.PAGE_DOWN,
    [TestKey.END]: webdriver.Key.END,
    [TestKey.HOME]: webdriver.Key.HOME,
    [TestKey.LEFT_ARROW]: webdriver.Key.ARROW_LEFT,
    [TestKey.UP_ARROW]: webdriver.Key.ARROW_UP,
    [TestKey.RIGHT_ARROW]: webdriver.Key.ARROW_RIGHT,
    [TestKey.DOWN_ARROW]: webdriver.Key.ARROW_DOWN,
    [TestKey.INSERT]: webdriver.Key.INSERT,
    [TestKey.DELETE]: webdriver.Key.DELETE,
    [TestKey.F1]: webdriver.Key.F1,
    [TestKey.F2]: webdriver.Key.F2,
    [TestKey.F3]: webdriver.Key.F3,
    [TestKey.F4]: webdriver.Key.F4,
    [TestKey.F5]: webdriver.Key.F5,
    [TestKey.F6]: webdriver.Key.F6,
    [TestKey.F7]: webdriver.Key.F7,
    [TestKey.F8]: webdriver.Key.F8,
    [TestKey.F9]: webdriver.Key.F9,
    [TestKey.F10]: webdriver.Key.F10,
    [TestKey.F11]: webdriver.Key.F11,
    [TestKey.F12]: webdriver.Key.F12,
    [TestKey.META]: webdriver.Key.META,
    [TestKey.COMMA]: ',',
};
/** Gets a list of WebDriver `Key`s for the given `ModifierKeys`. */
export function getSeleniumWebDriverModifierKeys(modifiers) {
    const result = [];
    if (modifiers.control) {
        result.push(webdriver.Key.CONTROL);
    }
    if (modifiers.alt) {
        result.push(webdriver.Key.ALT);
    }
    if (modifiers.shift) {
        result.push(webdriver.Key.SHIFT);
    }
    if (modifiers.meta) {
        result.push(webdriver.Key.META);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW0td2ViZHJpdmVyLWtleXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3Rlc3Rpbmcvc2VsZW5pdW0td2ViZHJpdmVyL3NlbGVuaXVtLXdlYmRyaXZlci1rZXlzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxPQUFPLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRCxPQUFPLEtBQUssU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBRWhEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHVCQUF1QixHQUFHO0lBQ3JDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVTtJQUM3QyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUc7SUFDaEMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLO0lBQ3BDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSztJQUNwQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU87SUFDeEMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHO0lBQ2hDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTTtJQUN0QyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU87SUFDeEMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTO0lBQzVDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRztJQUNoQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUk7SUFDbEMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVO0lBQzlDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUTtJQUMxQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVc7SUFDaEQsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVO0lBQzlDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTTtJQUN0QyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU07SUFDdEMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQzlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUM5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQzlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUM5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQzlCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUM5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDOUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHO0lBQ2hDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRztJQUNoQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUc7SUFDaEMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJO0lBQ2xDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUc7Q0FDckIsQ0FBQztBQUVGLG9FQUFvRTtBQUNwRSxNQUFNLFVBQVUsZ0NBQWdDLENBQUMsU0FBdUI7SUFDdEUsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ0QsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vZGlmaWVyS2V5cywgVGVzdEtleX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0ICogYXMgd2ViZHJpdmVyIGZyb20gJ3NlbGVuaXVtLXdlYmRyaXZlcic7XG5cbi8qKlxuICogTWFwcyB0aGUgYFRlc3RLZXlgIGNvbnN0YW50cyB0byBXZWJEcml2ZXIncyBgd2ViZHJpdmVyLktleWAgY29uc3RhbnRzLlxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9TZWxlbml1bUhRL3NlbGVuaXVtL2Jsb2IvdHJ1bmsvamF2YXNjcmlwdC93ZWJkcml2ZXIva2V5LmpzI0wyOVxuICovXG5leHBvcnQgY29uc3Qgc2VsZW5pdW1XZWJEcml2ZXJLZXlNYXAgPSB7XG4gIFtUZXN0S2V5LkJBQ0tTUEFDRV06IHdlYmRyaXZlci5LZXkuQkFDS19TUEFDRSxcbiAgW1Rlc3RLZXkuVEFCXTogd2ViZHJpdmVyLktleS5UQUIsXG4gIFtUZXN0S2V5LkVOVEVSXTogd2ViZHJpdmVyLktleS5FTlRFUixcbiAgW1Rlc3RLZXkuU0hJRlRdOiB3ZWJkcml2ZXIuS2V5LlNISUZULFxuICBbVGVzdEtleS5DT05UUk9MXTogd2ViZHJpdmVyLktleS5DT05UUk9MLFxuICBbVGVzdEtleS5BTFRdOiB3ZWJkcml2ZXIuS2V5LkFMVCxcbiAgW1Rlc3RLZXkuRVNDQVBFXTogd2ViZHJpdmVyLktleS5FU0NBUEUsXG4gIFtUZXN0S2V5LlBBR0VfVVBdOiB3ZWJkcml2ZXIuS2V5LlBBR0VfVVAsXG4gIFtUZXN0S2V5LlBBR0VfRE9XTl06IHdlYmRyaXZlci5LZXkuUEFHRV9ET1dOLFxuICBbVGVzdEtleS5FTkRdOiB3ZWJkcml2ZXIuS2V5LkVORCxcbiAgW1Rlc3RLZXkuSE9NRV06IHdlYmRyaXZlci5LZXkuSE9NRSxcbiAgW1Rlc3RLZXkuTEVGVF9BUlJPV106IHdlYmRyaXZlci5LZXkuQVJST1dfTEVGVCxcbiAgW1Rlc3RLZXkuVVBfQVJST1ddOiB3ZWJkcml2ZXIuS2V5LkFSUk9XX1VQLFxuICBbVGVzdEtleS5SSUdIVF9BUlJPV106IHdlYmRyaXZlci5LZXkuQVJST1dfUklHSFQsXG4gIFtUZXN0S2V5LkRPV05fQVJST1ddOiB3ZWJkcml2ZXIuS2V5LkFSUk9XX0RPV04sXG4gIFtUZXN0S2V5LklOU0VSVF06IHdlYmRyaXZlci5LZXkuSU5TRVJULFxuICBbVGVzdEtleS5ERUxFVEVdOiB3ZWJkcml2ZXIuS2V5LkRFTEVURSxcbiAgW1Rlc3RLZXkuRjFdOiB3ZWJkcml2ZXIuS2V5LkYxLFxuICBbVGVzdEtleS5GMl06IHdlYmRyaXZlci5LZXkuRjIsXG4gIFtUZXN0S2V5LkYzXTogd2ViZHJpdmVyLktleS5GMyxcbiAgW1Rlc3RLZXkuRjRdOiB3ZWJkcml2ZXIuS2V5LkY0LFxuICBbVGVzdEtleS5GNV06IHdlYmRyaXZlci5LZXkuRjUsXG4gIFtUZXN0S2V5LkY2XTogd2ViZHJpdmVyLktleS5GNixcbiAgW1Rlc3RLZXkuRjddOiB3ZWJkcml2ZXIuS2V5LkY3LFxuICBbVGVzdEtleS5GOF06IHdlYmRyaXZlci5LZXkuRjgsXG4gIFtUZXN0S2V5LkY5XTogd2ViZHJpdmVyLktleS5GOSxcbiAgW1Rlc3RLZXkuRjEwXTogd2ViZHJpdmVyLktleS5GMTAsXG4gIFtUZXN0S2V5LkYxMV06IHdlYmRyaXZlci5LZXkuRjExLFxuICBbVGVzdEtleS5GMTJdOiB3ZWJkcml2ZXIuS2V5LkYxMixcbiAgW1Rlc3RLZXkuTUVUQV06IHdlYmRyaXZlci5LZXkuTUVUQSxcbiAgW1Rlc3RLZXkuQ09NTUFdOiAnLCcsXG59O1xuXG4vKiogR2V0cyBhIGxpc3Qgb2YgV2ViRHJpdmVyIGBLZXlgcyBmb3IgdGhlIGdpdmVuIGBNb2RpZmllcktleXNgLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVuaXVtV2ViRHJpdmVyTW9kaWZpZXJLZXlzKG1vZGlmaWVyczogTW9kaWZpZXJLZXlzKTogc3RyaW5nW10ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gIGlmIChtb2RpZmllcnMuY29udHJvbCkge1xuICAgIHJlc3VsdC5wdXNoKHdlYmRyaXZlci5LZXkuQ09OVFJPTCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5hbHQpIHtcbiAgICByZXN1bHQucHVzaCh3ZWJkcml2ZXIuS2V5LkFMVCk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5zaGlmdCkge1xuICAgIHJlc3VsdC5wdXNoKHdlYmRyaXZlci5LZXkuU0hJRlQpO1xuICB9XG4gIGlmIChtb2RpZmllcnMubWV0YSkge1xuICAgIHJlc3VsdC5wdXNoKHdlYmRyaXZlci5LZXkuTUVUQSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==