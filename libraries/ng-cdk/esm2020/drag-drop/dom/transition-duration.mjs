/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Parses a CSS time value to milliseconds. */
function parseCssTimeUnitsToMs(value) {
  // Some browsers will return it in seconds, whereas others will return milliseconds.
  const multiplier = value.toLowerCase().indexOf('ms') > -1 ? 1 : 1000;
  return parseFloat(value) * multiplier;
}
/** Gets the transform transition duration, including the delay, of an element in milliseconds. */
export function getTransformTransitionDurationInMs(element) {
  const computedStyle = getComputedStyle(element);
  const transitionedProperties = parseCssPropertyValue(computedStyle, 'transition-property');
  const property = transitionedProperties.find(prop => prop === 'transform' || prop === 'all');
  // If there's no transition for `all` or `transform`, we shouldn't do anything.
  if (!property) {
    return 0;
  }
  // Get the index of the property that we're interested in and match
  // it up to the same index in `transition-delay` and `transition-duration`.
  const propertyIndex = transitionedProperties.indexOf(property);
  const rawDurations = parseCssPropertyValue(computedStyle, 'transition-duration');
  const rawDelays = parseCssPropertyValue(computedStyle, 'transition-delay');
  return (
    parseCssTimeUnitsToMs(rawDurations[propertyIndex]) +
    parseCssTimeUnitsToMs(rawDelays[propertyIndex])
  );
}
/** Parses out multiple values from a computed style into an array. */
function parseCssPropertyValue(computedStyle, name) {
  const value = computedStyle.getPropertyValue(name);
  return value.split(',').map(part => part.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbi1kdXJhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2RvbS90cmFuc2l0aW9uLWR1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILCtDQUErQztBQUMvQyxTQUFTLHFCQUFxQixDQUFDLEtBQWE7SUFDMUMsb0ZBQW9GO0lBQ3BGLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3JFLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUN4QyxDQUFDO0FBRUQsa0dBQWtHO0FBQ2xHLE1BQU0sVUFBVSxrQ0FBa0MsQ0FBQyxPQUFvQjtJQUNyRSxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxNQUFNLHNCQUFzQixHQUFHLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQzNGLE1BQU0sUUFBUSxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBRTdGLCtFQUErRTtJQUMvRSxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2IsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELG1FQUFtRTtJQUNuRSwyRUFBMkU7SUFDM0UsTUFBTSxhQUFhLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sWUFBWSxHQUFHLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ2pGLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBRTNFLE9BQU8sQ0FDTCxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQscUJBQXFCLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ2hELENBQUM7QUFDSixDQUFDO0FBRUQsc0VBQXNFO0FBQ3RFLFNBQVMscUJBQXFCLENBQUMsYUFBa0MsRUFBRSxJQUFZO0lBQzdFLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiogUGFyc2VzIGEgQ1NTIHRpbWUgdmFsdWUgdG8gbWlsbGlzZWNvbmRzLiAqL1xuZnVuY3Rpb24gcGFyc2VDc3NUaW1lVW5pdHNUb01zKHZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICAvLyBTb21lIGJyb3dzZXJzIHdpbGwgcmV0dXJuIGl0IGluIHNlY29uZHMsIHdoZXJlYXMgb3RoZXJzIHdpbGwgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAgY29uc3QgbXVsdGlwbGllciA9IHZhbHVlLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignbXMnKSA+IC0xID8gMSA6IDEwMDA7XG4gIHJldHVybiBwYXJzZUZsb2F0KHZhbHVlKSAqIG11bHRpcGxpZXI7XG59XG5cbi8qKiBHZXRzIHRoZSB0cmFuc2Zvcm0gdHJhbnNpdGlvbiBkdXJhdGlvbiwgaW5jbHVkaW5nIHRoZSBkZWxheSwgb2YgYW4gZWxlbWVudCBpbiBtaWxsaXNlY29uZHMuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtVHJhbnNpdGlvbkR1cmF0aW9uSW5NcyhlbGVtZW50OiBIVE1MRWxlbWVudCk6IG51bWJlciB7XG4gIGNvbnN0IGNvbXB1dGVkU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICBjb25zdCB0cmFuc2l0aW9uZWRQcm9wZXJ0aWVzID0gcGFyc2VDc3NQcm9wZXJ0eVZhbHVlKGNvbXB1dGVkU3R5bGUsICd0cmFuc2l0aW9uLXByb3BlcnR5Jyk7XG4gIGNvbnN0IHByb3BlcnR5ID0gdHJhbnNpdGlvbmVkUHJvcGVydGllcy5maW5kKHByb3AgPT4gcHJvcCA9PT0gJ3RyYW5zZm9ybScgfHwgcHJvcCA9PT0gJ2FsbCcpO1xuXG4gIC8vIElmIHRoZXJlJ3Mgbm8gdHJhbnNpdGlvbiBmb3IgYGFsbGAgb3IgYHRyYW5zZm9ybWAsIHdlIHNob3VsZG4ndCBkbyBhbnl0aGluZy5cbiAgaWYgKCFwcm9wZXJ0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBpbmRleCBvZiB0aGUgcHJvcGVydHkgdGhhdCB3ZSdyZSBpbnRlcmVzdGVkIGluIGFuZCBtYXRjaFxuICAvLyBpdCB1cCB0byB0aGUgc2FtZSBpbmRleCBpbiBgdHJhbnNpdGlvbi1kZWxheWAgYW5kIGB0cmFuc2l0aW9uLWR1cmF0aW9uYC5cbiAgY29uc3QgcHJvcGVydHlJbmRleCA9IHRyYW5zaXRpb25lZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSk7XG4gIGNvbnN0IHJhd0R1cmF0aW9ucyA9IHBhcnNlQ3NzUHJvcGVydHlWYWx1ZShjb21wdXRlZFN0eWxlLCAndHJhbnNpdGlvbi1kdXJhdGlvbicpO1xuICBjb25zdCByYXdEZWxheXMgPSBwYXJzZUNzc1Byb3BlcnR5VmFsdWUoY29tcHV0ZWRTdHlsZSwgJ3RyYW5zaXRpb24tZGVsYXknKTtcblxuICByZXR1cm4gKFxuICAgIHBhcnNlQ3NzVGltZVVuaXRzVG9NcyhyYXdEdXJhdGlvbnNbcHJvcGVydHlJbmRleF0pICtcbiAgICBwYXJzZUNzc1RpbWVVbml0c1RvTXMocmF3RGVsYXlzW3Byb3BlcnR5SW5kZXhdKVxuICApO1xufVxuXG4vKiogUGFyc2VzIG91dCBtdWx0aXBsZSB2YWx1ZXMgZnJvbSBhIGNvbXB1dGVkIHN0eWxlIGludG8gYW4gYXJyYXkuICovXG5mdW5jdGlvbiBwYXJzZUNzc1Byb3BlcnR5VmFsdWUoY29tcHV0ZWRTdHlsZTogQ1NTU3R5bGVEZWNsYXJhdGlvbiwgbmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCB2YWx1ZSA9IGNvbXB1dGVkU3R5bGUuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KCcsJykubWFwKHBhcnQgPT4gcGFydC50cmltKCkpO1xufVxuIl19
