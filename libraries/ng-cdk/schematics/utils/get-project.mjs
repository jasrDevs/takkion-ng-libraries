"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFromWorkspace = void 0;
const schematics_1 = require("@angular-devkit/schematics");
/**
 * Finds the specified project configuration in the workspace. Throws an error if the project
 * couldn't be found.
 */
function getProjectFromWorkspace(workspace, projectName) {
    if (!projectName) {
        // TODO(crisbeto): some schematics APIs have the project name as optional so for now it's
        // simpler to allow undefined and checking it at runtime. Eventually we should clean this up.
        throw new schematics_1.SchematicsException('Project name is required.');
    }
    const project = workspace.projects.get(projectName);
    if (!project) {
        throw new schematics_1.SchematicsException(`Could not find project in workspace: ${projectName}`);
    }
    return project;
}
exports.getProjectFromWorkspace = getProjectFromWorkspace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXByb2plY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvZ2V0LXByb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBR0gsMkRBQStEO0FBRS9EOzs7R0FHRztBQUNILFNBQWdCLHVCQUF1QixDQUNyQyxTQUF5QyxFQUN6QyxXQUErQjtJQUUvQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDakIseUZBQXlGO1FBQ3pGLDZGQUE2RjtRQUM3RixNQUFNLElBQUksZ0NBQW1CLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFcEQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxJQUFJLGdDQUFtQixDQUFDLHdDQUF3QyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBakJELDBEQWlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3dvcmtzcGFjZXN9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7U2NoZW1hdGljc0V4Y2VwdGlvbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuXG4vKipcbiAqIEZpbmRzIHRoZSBzcGVjaWZpZWQgcHJvamVjdCBjb25maWd1cmF0aW9uIGluIHRoZSB3b3Jrc3BhY2UuIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcHJvamVjdFxuICogY291bGRuJ3QgYmUgZm91bmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZShcbiAgd29ya3NwYWNlOiB3b3Jrc3BhY2VzLldvcmtzcGFjZURlZmluaXRpb24sXG4gIHByb2plY3ROYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pOiB3b3Jrc3BhY2VzLlByb2plY3REZWZpbml0aW9uIHtcbiAgaWYgKCFwcm9qZWN0TmFtZSkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiBzb21lIHNjaGVtYXRpY3MgQVBJcyBoYXZlIHRoZSBwcm9qZWN0IG5hbWUgYXMgb3B0aW9uYWwgc28gZm9yIG5vdyBpdCdzXG4gICAgLy8gc2ltcGxlciB0byBhbGxvdyB1bmRlZmluZWQgYW5kIGNoZWNraW5nIGl0IGF0IHJ1bnRpbWUuIEV2ZW50dWFsbHkgd2Ugc2hvdWxkIGNsZWFuIHRoaXMgdXAuXG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ1Byb2plY3QgbmFtZSBpcyByZXF1aXJlZC4nKTtcbiAgfVxuXG4gIGNvbnN0IHByb2plY3QgPSB3b3Jrc3BhY2UucHJvamVjdHMuZ2V0KHByb2plY3ROYW1lKTtcblxuICBpZiAoIXByb2plY3QpIHtcbiAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbihgQ291bGQgbm90IGZpbmQgcHJvamVjdCBpbiB3b3Jrc3BhY2U6ICR7cHJvamVjdE5hbWV9YCk7XG4gIH1cblxuICByZXR1cm4gcHJvamVjdDtcbn1cbiJdfQ==