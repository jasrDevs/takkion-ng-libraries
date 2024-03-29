/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export * from './overlay-config';
export * from './position/connected-position';
export * from './scroll/index';
export * from './overlay-module';
export * from './dispatchers/index';
export { Overlay } from './overlay';
export { OverlayContainer } from './overlay-container';
export { CdkOverlayOrigin, CdkConnectedOverlay } from './overlay-directives';
export { FullscreenOverlayContainer } from './fullscreen-overlay-container';
export { OverlayRef } from './overlay-ref';
export { ViewportRuler } from '@takkion/ng-cdk/scrolling';
export { OverlayPositionBuilder } from './position/overlay-position-builder';
export { GlobalPositionStrategy } from './position/global-position-strategy';
export {
  FlexibleConnectedPositionStrategy,
  STANDARD_DROPDOWN_ADJACENT_POSITIONS,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
} from './position/flexible-connected-position-strategy';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvb3ZlcmxheS9wdWJsaWMtYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILGNBQWMsa0JBQWtCLENBQUM7QUFDakMsY0FBYywrQkFBK0IsQ0FBQztBQUM5QyxjQUFjLGdCQUFnQixDQUFDO0FBQy9CLGNBQWMsa0JBQWtCLENBQUM7QUFDakMsY0FBYyxxQkFBcUIsQ0FBQztBQUNwQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzNFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQzFFLE9BQU8sRUFBQyxVQUFVLEVBQW9CLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUVyRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUkzRSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRSxPQUFPLEVBRUwsaUNBQWlDLEVBRWpDLG9DQUFvQyxFQUNwQyxpQ0FBaUMsR0FDbEMsTUFBTSxpREFBaUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL292ZXJsYXktY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vcG9zaXRpb24vY29ubmVjdGVkLXBvc2l0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vc2Nyb2xsL2luZGV4JztcbmV4cG9ydCAqIGZyb20gJy4vb3ZlcmxheS1tb2R1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9kaXNwYXRjaGVycy9pbmRleCc7XG5leHBvcnQge092ZXJsYXl9IGZyb20gJy4vb3ZlcmxheSc7XG5leHBvcnQge092ZXJsYXlDb250YWluZXJ9IGZyb20gJy4vb3ZlcmxheS1jb250YWluZXInO1xuZXhwb3J0IHtDZGtPdmVybGF5T3JpZ2luLCBDZGtDb25uZWN0ZWRPdmVybGF5fSBmcm9tICcuL292ZXJsYXktZGlyZWN0aXZlcyc7XG5leHBvcnQge0Z1bGxzY3JlZW5PdmVybGF5Q29udGFpbmVyfSBmcm9tICcuL2Z1bGxzY3JlZW4tb3ZlcmxheS1jb250YWluZXInO1xuZXhwb3J0IHtPdmVybGF5UmVmLCBPdmVybGF5U2l6ZUNvbmZpZ30gZnJvbSAnLi9vdmVybGF5LXJlZic7XG5leHBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuZXhwb3J0IHtDb21wb25lbnRUeXBlfSBmcm9tICdAYW5ndWxhci9jZGsvcG9ydGFsJztcbmV4cG9ydCB7T3ZlcmxheVBvc2l0aW9uQnVpbGRlcn0gZnJvbSAnLi9wb3NpdGlvbi9vdmVybGF5LXBvc2l0aW9uLWJ1aWxkZXInO1xuXG4vLyBFeHBvcnQgcHJlLWRlZmluZWQgcG9zaXRpb24gc3RyYXRlZ2llcyBhbmQgaW50ZXJmYWNlIHRvIGJ1aWxkIGN1c3RvbSBvbmVzLlxuZXhwb3J0IHtQb3NpdGlvblN0cmF0ZWd5fSBmcm9tICcuL3Bvc2l0aW9uL3Bvc2l0aW9uLXN0cmF0ZWd5JztcbmV4cG9ydCB7R2xvYmFsUG9zaXRpb25TdHJhdGVneX0gZnJvbSAnLi9wb3NpdGlvbi9nbG9iYWwtcG9zaXRpb24tc3RyYXRlZ3knO1xuZXhwb3J0IHtcbiAgQ29ubmVjdGVkUG9zaXRpb24sXG4gIEZsZXhpYmxlQ29ubmVjdGVkUG9zaXRpb25TdHJhdGVneSxcbiAgRmxleGlibGVDb25uZWN0ZWRQb3NpdGlvblN0cmF0ZWd5T3JpZ2luLFxuICBTVEFOREFSRF9EUk9QRE9XTl9BREpBQ0VOVF9QT1NJVElPTlMsXG4gIFNUQU5EQVJEX0RST1BET1dOX0JFTE9XX1BPU0lUSU9OUyxcbn0gZnJvbSAnLi9wb3NpdGlvbi9mbGV4aWJsZS1jb25uZWN0ZWQtcG9zaXRpb24tc3RyYXRlZ3knO1xuIl19
