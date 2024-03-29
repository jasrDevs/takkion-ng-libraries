/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Migration } from '@takkion/ng-cdk/schematics';
import * as ts from 'typescript';
/**
 * Migration that checks for classes that extend Angular Material classes which
 * have changed their API.
 */
export declare class MiscClassInheritanceMigration extends Migration<null> {
  enabled: boolean;
  visitNode(node: ts.Node): void;
  private _visitClassDeclaration;
}
