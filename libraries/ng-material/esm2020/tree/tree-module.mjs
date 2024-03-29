/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CdkTreeModule } from '@takkion/ng-cdk/tree';
import { TakCommonModule } from '@takkion/ng-material/core';
import { TakNestedTreeNode, TakTreeNodeDef, TakTreeNode } from './node';
import { TakTree } from './tree';
import { TakTreeNodeToggle } from './toggle';
import { TakTreeNodeOutlet } from './outlet';
import { TakTreeNodePadding } from './padding';
import * as i0 from '@angular/core';
const TAK_TREE_DIRECTIVES = [
  TakNestedTreeNode,
  TakTreeNodeDef,
  TakTreeNodePadding,
  TakTreeNodeToggle,
  TakTree,
  TakTreeNode,
  TakTreeNodeOutlet,
];
export class TakTreeModule {}
TakTreeModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTreeModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
TakTreeModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTreeModule,
  declarations: [
    TakNestedTreeNode,
    TakTreeNodeDef,
    TakTreeNodePadding,
    TakTreeNodeToggle,
    TakTree,
    TakTreeNode,
    TakTreeNodeOutlet,
  ],
  imports: [CdkTreeModule, TakCommonModule],
  exports: [
    TakCommonModule,
    TakNestedTreeNode,
    TakTreeNodeDef,
    TakTreeNodePadding,
    TakTreeNodeToggle,
    TakTree,
    TakTreeNode,
    TakTreeNodeOutlet,
  ],
});
TakTreeModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTreeModule,
  imports: [CdkTreeModule, TakCommonModule, TakCommonModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakTreeModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [CdkTreeModule, TakCommonModule],
          exports: [TakCommonModule, TAK_TREE_DIRECTIVES],
          declarations: TAK_TREE_DIRECTIVES,
        },
      ],
    },
  ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdHJlZS90cmVlLW1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDdEUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMvQixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7QUFFN0MsTUFBTSxtQkFBbUIsR0FBRztJQUMxQixpQkFBaUI7SUFDakIsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsT0FBTztJQUNQLFdBQVc7SUFDWCxpQkFBaUI7Q0FDbEIsQ0FBQztBQU9GLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBZHhCLGlCQUFpQjtRQUNqQixjQUFjO1FBQ2Qsa0JBQWtCO1FBQ2xCLGlCQUFpQjtRQUNqQixPQUFPO1FBQ1AsV0FBVztRQUNYLGlCQUFpQixhQUlQLGFBQWEsRUFBRSxlQUFlLGFBQzlCLGVBQWUsRUFYekIsaUJBQWlCO1FBQ2pCLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIsaUJBQWlCO1FBQ2pCLE9BQU87UUFDUCxXQUFXO1FBQ1gsaUJBQWlCOzJHQVFOLGFBQWEsWUFKZCxhQUFhLEVBQUUsZUFBZSxFQUM5QixlQUFlOzJGQUdkLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQztvQkFDekMsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLG1CQUFtQixDQUFDO29CQUMvQyxZQUFZLEVBQUUsbUJBQW1CO2lCQUNsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDZGtUcmVlTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge01hdENvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge01hdE5lc3RlZFRyZWVOb2RlLCBNYXRUcmVlTm9kZURlZiwgTWF0VHJlZU5vZGV9IGZyb20gJy4vbm9kZSc7XG5pbXBvcnQge01hdFRyZWV9IGZyb20gJy4vdHJlZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlVG9nZ2xlfSBmcm9tICcuL3RvZ2dsZSc7XG5pbXBvcnQge01hdFRyZWVOb2RlT3V0bGV0fSBmcm9tICcuL291dGxldCc7XG5pbXBvcnQge01hdFRyZWVOb2RlUGFkZGluZ30gZnJvbSAnLi9wYWRkaW5nJztcblxuY29uc3QgTUFUX1RSRUVfRElSRUNUSVZFUyA9IFtcbiAgTWF0TmVzdGVkVHJlZU5vZGUsXG4gIE1hdFRyZWVOb2RlRGVmLFxuICBNYXRUcmVlTm9kZVBhZGRpbmcsXG4gIE1hdFRyZWVOb2RlVG9nZ2xlLFxuICBNYXRUcmVlLFxuICBNYXRUcmVlTm9kZSxcbiAgTWF0VHJlZU5vZGVPdXRsZXQsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ2RrVHJlZU1vZHVsZSwgTWF0Q29tbW9uTW9kdWxlXSxcbiAgZXhwb3J0czogW01hdENvbW1vbk1vZHVsZSwgTUFUX1RSRUVfRElSRUNUSVZFU10sXG4gIGRlY2xhcmF0aW9uczogTUFUX1RSRUVfRElSRUNUSVZFUyxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VHJlZU1vZHVsZSB7fVxuIl19
