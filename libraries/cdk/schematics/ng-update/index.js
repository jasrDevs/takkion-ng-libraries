'use strict';
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.updateToV15 =
  exports.updateToV14 =
  exports.updateToV13 =
  exports.updateToV12 =
  exports.updateToV11 =
  exports.updateToV10 =
  exports.updateToV9 =
  exports.updateToV8 =
  exports.updateToV7 =
  exports.updateToV6 =
    void 0;
const target_version_1 = require('../update-tool/target-version');
const upgrade_data_1 = require('./upgrade-data');
const devkit_migration_rule_1 = require('./devkit-migration-rule');
const tilde_import_migration_1 = require('./migrations/tilde-import-v13/tilde-import-migration');
const cdkMigrations = [tilde_import_migration_1.TildeImportMigration];
/** Entry point for the migration schematics with target of Angular CDK 6.0.0 */
function updateToV6() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V6,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV6 = updateToV6;
/** Entry point for the migration schematics with target of Angular CDK 7.0.0 */
function updateToV7() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V7,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV7 = updateToV7;
/** Entry point for the migration schematics with target of Angular CDK 8.0.0 */
function updateToV8() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V8,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV8 = updateToV8;
/** Entry point for the migration schematics with target of Angular CDK 9.0.0 */
function updateToV9() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V9,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV9 = updateToV9;
/** Entry point for the migration schematics with target of Angular CDK 10.0.0 */
function updateToV10() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V10,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV10 = updateToV10;
/** Entry point for the migration schematics with target of Angular CDK 11.0.0 */
function updateToV11() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V11,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV11 = updateToV11;
/** Entry point for the migration schematics with target of Angular CDK 12.0.0 */
function updateToV12() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V12,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV12 = updateToV12;
/** Entry point for the migration schematics with target of Angular CDK 13.0.0 */
function updateToV13() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V13,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV13 = updateToV13;
/** Entry point for the migration schematics with target of Angular CDK 14.0.0 */
function updateToV14() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V14,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV14 = updateToV14;
/** Entry point for the migration schematics with target of Angular CDK 15.0.0 */
function updateToV15() {
  return (0, devkit_migration_rule_1.createMigrationSchematicRule)(
    target_version_1.TargetVersion.V15,
    cdkMigrations,
    upgrade_data_1.cdkUpgradeData,
    onMigrationComplete
  );
}
exports.updateToV15 = updateToV15;
/** Function that will be called when the migration completed. */
function onMigrationComplete(context, targetVersion, hasFailures) {
  context.logger.info('');
  context.logger.info(`  ✓  Updated Angular CDK to ${targetVersion}`);
  context.logger.info('');
  if (hasFailures) {
    context.logger.warn(
      '  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
        'output above and fix these issues manually.'
    );
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvbmctdXBkYXRlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUdILGtFQUE0RDtBQUM1RCxpREFBOEM7QUFDOUMsbUVBQThGO0FBQzlGLGlHQUEwRjtBQUUxRixNQUFNLGFBQWEsR0FBOEIsQ0FBQyw2Q0FBb0IsQ0FBQyxDQUFDO0FBRXhFLGdGQUFnRjtBQUNoRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sSUFBQSxvREFBNEIsRUFDakMsOEJBQWEsQ0FBQyxFQUFFLEVBQ2hCLGFBQWEsRUFDYiw2QkFBYyxFQUNkLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGdDQU9DO0FBRUQsZ0ZBQWdGO0FBQ2hGLFNBQWdCLFVBQVU7SUFDeEIsT0FBTyxJQUFBLG9EQUE0QixFQUNqQyw4QkFBYSxDQUFDLEVBQUUsRUFDaEIsYUFBYSxFQUNiLDZCQUFjLEVBQ2QsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsZ0NBT0M7QUFFRCxnRkFBZ0Y7QUFDaEYsU0FBZ0IsVUFBVTtJQUN4QixPQUFPLElBQUEsb0RBQTRCLEVBQ2pDLDhCQUFhLENBQUMsRUFBRSxFQUNoQixhQUFhLEVBQ2IsNkJBQWMsRUFDZCxtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxnQ0FPQztBQUVELGdGQUFnRjtBQUNoRixTQUFnQixVQUFVO0lBQ3hCLE9BQU8sSUFBQSxvREFBNEIsRUFDakMsOEJBQWEsQ0FBQyxFQUFFLEVBQ2hCLGFBQWEsRUFDYiw2QkFBYyxFQUNkLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGdDQU9DO0FBRUQsaUZBQWlGO0FBQ2pGLFNBQWdCLFdBQVc7SUFDekIsT0FBTyxJQUFBLG9EQUE0QixFQUNqQyw4QkFBYSxDQUFDLEdBQUcsRUFDakIsYUFBYSxFQUNiLDZCQUFjLEVBQ2QsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsa0NBT0M7QUFFRCxpRkFBaUY7QUFDakYsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUEsb0RBQTRCLEVBQ2pDLDhCQUFhLENBQUMsR0FBRyxFQUNqQixhQUFhLEVBQ2IsNkJBQWMsRUFDZCxtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxrQ0FPQztBQUVELGlGQUFpRjtBQUNqRixTQUFnQixXQUFXO0lBQ3pCLE9BQU8sSUFBQSxvREFBNEIsRUFDakMsOEJBQWEsQ0FBQyxHQUFHLEVBQ2pCLGFBQWEsRUFDYiw2QkFBYyxFQUNkLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGtDQU9DO0FBRUQsaUZBQWlGO0FBQ2pGLFNBQWdCLFdBQVc7SUFDekIsT0FBTyxJQUFBLG9EQUE0QixFQUNqQyw4QkFBYSxDQUFDLEdBQUcsRUFDakIsYUFBYSxFQUNiLDZCQUFjLEVBQ2QsbUJBQW1CLENBQ3BCLENBQUM7QUFDSixDQUFDO0FBUEQsa0NBT0M7QUFFRCxpRkFBaUY7QUFDakYsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUEsb0RBQTRCLEVBQ2pDLDhCQUFhLENBQUMsR0FBRyxFQUNqQixhQUFhLEVBQ2IsNkJBQWMsRUFDZCxtQkFBbUIsQ0FDcEIsQ0FBQztBQUNKLENBQUM7QUFQRCxrQ0FPQztBQUVELGlGQUFpRjtBQUNqRixTQUFnQixXQUFXO0lBQ3pCLE9BQU8sSUFBQSxvREFBNEIsRUFDakMsOEJBQWEsQ0FBQyxHQUFHLEVBQ2pCLGFBQWEsRUFDYiw2QkFBYyxFQUNkLG1CQUFtQixDQUNwQixDQUFDO0FBQ0osQ0FBQztBQVBELGtDQU9DO0FBRUQsaUVBQWlFO0FBQ2pFLFNBQVMsbUJBQW1CLENBQzFCLE9BQXlCLEVBQ3pCLGFBQTRCLEVBQzVCLFdBQW9CO0lBRXBCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixhQUFhLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXhCLElBQUksV0FBVyxFQUFFO1FBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ2pCLHdGQUF3RjtZQUN0Riw2Q0FBNkMsQ0FDaEQsQ0FBQztLQUNIO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1J1bGUsIFNjaGVtYXRpY0NvbnRleHR9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7VGFyZ2V0VmVyc2lvbn0gZnJvbSAnLi4vdXBkYXRlLXRvb2wvdGFyZ2V0LXZlcnNpb24nO1xuaW1wb3J0IHtjZGtVcGdyYWRlRGF0YX0gZnJvbSAnLi91cGdyYWRlLWRhdGEnO1xuaW1wb3J0IHtjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlLCBOdWxsYWJsZURldmtpdE1pZ3JhdGlvbn0gZnJvbSAnLi9kZXZraXQtbWlncmF0aW9uLXJ1bGUnO1xuaW1wb3J0IHtUaWxkZUltcG9ydE1pZ3JhdGlvbn0gZnJvbSAnLi9taWdyYXRpb25zL3RpbGRlLWltcG9ydC12MTMvdGlsZGUtaW1wb3J0LW1pZ3JhdGlvbic7XG5cbmNvbnN0IGNka01pZ3JhdGlvbnM6IE51bGxhYmxlRGV2a2l0TWlncmF0aW9uW10gPSBbVGlsZGVJbXBvcnRNaWdyYXRpb25dO1xuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyA2LjAuMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjYoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgIFRhcmdldFZlcnNpb24uVjYsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyA3LjAuMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjcoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgIFRhcmdldFZlcnNpb24uVjcsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyA4LjAuMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjgoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgIFRhcmdldFZlcnNpb24uVjgsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyA5LjAuMCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvVjkoKTogUnVsZSB7XG4gIHJldHVybiBjcmVhdGVNaWdyYXRpb25TY2hlbWF0aWNSdWxlKFxuICAgIFRhcmdldFZlcnNpb24uVjksXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxMC4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxMCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTAsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxMS4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxMSgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTEsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxMi4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxMigpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTIsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxMy4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxMygpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTMsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxNC4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxNCgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTQsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRW50cnkgcG9pbnQgZm9yIHRoZSBtaWdyYXRpb24gc2NoZW1hdGljcyB3aXRoIHRhcmdldCBvZiBBbmd1bGFyIENESyAxNS4wLjAgKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUb1YxNSgpOiBSdWxlIHtcbiAgcmV0dXJuIGNyZWF0ZU1pZ3JhdGlvblNjaGVtYXRpY1J1bGUoXG4gICAgVGFyZ2V0VmVyc2lvbi5WMTUsXG4gICAgY2RrTWlncmF0aW9ucyxcbiAgICBjZGtVcGdyYWRlRGF0YSxcbiAgICBvbk1pZ3JhdGlvbkNvbXBsZXRlLFxuICApO1xufVxuXG4vKiogRnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBtaWdyYXRpb24gY29tcGxldGVkLiAqL1xuZnVuY3Rpb24gb25NaWdyYXRpb25Db21wbGV0ZShcbiAgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCxcbiAgdGFyZ2V0VmVyc2lvbjogVGFyZ2V0VmVyc2lvbixcbiAgaGFzRmFpbHVyZXM6IGJvb2xlYW4sXG4pIHtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG4gIGNvbnRleHQubG9nZ2VyLmluZm8oYCAg4pyTICBVcGRhdGVkIEFuZ3VsYXIgQ0RLIHRvICR7dGFyZ2V0VmVyc2lvbn1gKTtcbiAgY29udGV4dC5sb2dnZXIuaW5mbygnJyk7XG5cbiAgaWYgKGhhc0ZhaWx1cmVzKSB7XG4gICAgY29udGV4dC5sb2dnZXIud2FybihcbiAgICAgICcgIOKaoCAgU29tZSBpc3N1ZXMgd2VyZSBkZXRlY3RlZCBidXQgY291bGQgbm90IGJlIGZpeGVkIGF1dG9tYXRpY2FsbHkuIFBsZWFzZSBjaGVjayB0aGUgJyArXG4gICAgICAgICdvdXRwdXQgYWJvdmUgYW5kIGZpeCB0aGVzZSBpc3N1ZXMgbWFudWFsbHkuJyxcbiAgICApO1xuICB9XG59XG4iXX0=
