/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { parse5 } from '@takkion/ng-cdk/schematics';
/**
 * Parses the specified HTML content and looks for "script" elements which
 * potentially import HammerJS. These elements will be returned.
 */
export declare function findHammerScriptImportElements(htmlContent: string): parse5.Element[];
