/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { VersionChanges } from '../../update-tool/version-changes';
export interface ElementSelectorUpgradeData {
  /** The element name to replace. */
  replace: string;
  /** The new name for the element. */
  replaceWith: string;
}
export declare const elementSelectors: VersionChanges<ElementSelectorUpgradeData>;
