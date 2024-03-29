/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { VersionChanges } from '../../update-tool/version-changes';
export interface ClassNameUpgradeData {
  /** The Class name to replace. */
  replace: string;
  /** The new name for the Class. */
  replaceWith: string;
}
export declare const classNames: VersionChanges<ClassNameUpgradeData>;
