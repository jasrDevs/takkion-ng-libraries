/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Migration, ResolvedResource } from '@takkion/ng-cdk/schematics';
/**
 * Migration that walks through every inline or external template and reports if there
 * are outdated usages of the Angular Material API that needs to be updated manually.
 */
export declare class MiscTemplateMigration extends Migration<null> {
  enabled: boolean;
  visitTemplate(template: ResolvedResource): void;
}
