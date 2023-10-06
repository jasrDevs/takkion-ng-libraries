/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ConstructorChecksUpgradeData, VersionChanges } from '@takkion/ng-cdk/schematics';
/**
 * List of class names for which the constructor signature has been changed. The new constructor
 * signature types don't need to be stored here because the signature will be determined
 * automatically through type checking.
 */
export declare const constructorChecks: VersionChanges<ConstructorChecksUpgradeData>;
