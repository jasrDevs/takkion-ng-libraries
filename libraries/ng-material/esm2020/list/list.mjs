/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Optional,
  QueryList,
  ViewEncapsulation,
  ChangeDetectorRef,
  Input,
  InjectionToken,
  Inject,
} from '@angular/core';
import { TakLine, setLines, mixinDisableRipple, mixinDisabled } from '@takkion/ng-material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-material/core';
// Boilerplate for applying mixins to TakList.
/** @docs-private */
const _TakListBase = mixinDisabled(mixinDisableRipple(class {}));
// Boilerplate for applying mixins to TakListItem.
/** @docs-private */
const _TakListItemMixinBase = mixinDisableRipple(class {});
/**
 * Injection token that can be used to inject instances of `TakList`. It serves as
 * alternative token to the actual `TakList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const TAK_LIST = new InjectionToken('TakList');
/**
 * Injection token that can be used to inject instances of `TakNavList`. It serves as
 * alternative token to the actual `TakNavList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const TAK_NAV_LIST = new InjectionToken('TakNavList');
export class TakNavList extends _TakListBase {
  constructor() {
    super(...arguments);
    /** Emits when the state of the list changes. */
    this._stateChanges = new Subject();
  }
  ngOnChanges() {
    this._stateChanges.next();
  }
  ngOnDestroy() {
    this._stateChanges.complete();
  }
}
TakNavList.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakNavList,
  deps: null,
  target: i0.ɵɵFactoryTarget.Component,
});
TakNavList.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakNavList,
  selector: 'tak-nav-list',
  inputs: { disableRipple: 'disableRipple', disabled: 'disabled' },
  host: { attributes: { role: 'navigation' }, classAttribute: 'tak-nav-list tak-list-base' },
  providers: [{ provide: TAK_NAV_LIST, useExisting: TakNavList }],
  exportAs: ['takNavList'],
  usesInheritance: true,
  usesOnChanges: true,
  ngImport: i0,
  template: '<ng-content></ng-content>\n\n',
  styles: [
    '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakNavList,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-nav-list',
          exportAs: 'takNavList',
          host: {
            role: 'navigation',
            class: 'tak-nav-list tak-list-base',
          },
          inputs: ['disableRipple', 'disabled'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [{ provide: TAK_NAV_LIST, useExisting: TakNavList }],
          template: '<ng-content></ng-content>\n\n',
          styles: [
            '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
          ],
        },
      ],
    },
  ],
});
export class TakList extends _TakListBase {
  constructor(_elementRef) {
    super();
    this._elementRef = _elementRef;
    /** Emits when the state of the list changes. */
    this._stateChanges = new Subject();
    if (this._getListType() === 'action-list') {
      _elementRef.nativeElement.classList.add('tak-action-list');
      _elementRef.nativeElement.setAttribute('role', 'group');
    }
  }
  _getListType() {
    const nodeName = this._elementRef.nativeElement.nodeName.toLowerCase();
    if (nodeName === 'tak-list') {
      return 'list';
    }
    if (nodeName === 'tak-action-list') {
      return 'action-list';
    }
    return null;
  }
  ngOnChanges() {
    this._stateChanges.next();
  }
  ngOnDestroy() {
    this._stateChanges.complete();
  }
}
TakList.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakList,
  deps: [{ token: i0.ElementRef }],
  target: i0.ɵɵFactoryTarget.Component,
});
TakList.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakList,
  selector: 'tak-list, tak-action-list',
  inputs: { disableRipple: 'disableRipple', disabled: 'disabled' },
  host: { classAttribute: 'tak-list tak-list-base' },
  providers: [{ provide: TAK_LIST, useExisting: TakList }],
  exportAs: ['takList'],
  usesInheritance: true,
  usesOnChanges: true,
  ngImport: i0,
  template: '<ng-content></ng-content>\n\n',
  styles: [
    '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakList,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-list, tak-action-list',
          exportAs: 'takList',
          host: {
            class: 'tak-list tak-list-base',
          },
          inputs: ['disableRipple', 'disabled'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          providers: [{ provide: TAK_LIST, useExisting: TakList }],
          template: '<ng-content></ng-content>\n\n',
          styles: [
            '.tak-subheader{display:flex;box-sizing:border-box;padding:16px;align-items:center}.tak-list-base .tak-subheader{margin:0}button.tak-list-item,button.tak-list-option{padding:0;width:100%;background:none;color:inherit;border:none;outline:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);text-align:left}[dir=rtl] button.tak-list-item,[dir=rtl] button.tak-list-option{text-align:right}button.tak-list-item::-moz-focus-inner,button.tak-list-option::-moz-focus-inner{border:0}.tak-list-base{padding-top:8px;display:block;-webkit-tap-highlight-color:rgba(0,0,0,0)}.tak-list-base .tak-subheader{height:48px;line-height:16px}.tak-list-base .tak-subheader:first-child{margin-top:-8px}.tak-list-base .tak-list-item,.tak-list-base .tak-list-option{display:block;height:48px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base .tak-list-item .tak-list-item-content,.tak-list-base .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base .tak-list-item .tak-list-item-content-reverse,.tak-list-base .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base .tak-list-item .tak-list-item-ripple,.tak-list-base .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar,.tak-list-base .tak-list-option.tak-list-item-with-avatar{height:56px}.tak-list-base .tak-list-item.tak-2-line,.tak-list-base .tak-list-option.tak-2-line{height:72px}.tak-list-base .tak-list-item.tak-3-line,.tak-list-base .tak-list-option.tak-3-line{height:88px}.tak-list-base .tak-list-item.tak-multi-line,.tak-list-base .tak-list-option.tak-multi-line{height:auto}.tak-list-base .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base .tak-list-item .tak-list-text,.tak-list-base .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base .tak-list-item .tak-list-text>*,.tak-list-base .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base .tak-list-item .tak-list-text:empty,.tak-list-base .tak-list-option .tak-list-text:empty{display:none}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base .tak-list-item .tak-list-avatar,.tak-list-base .tak-list-option .tak-list-avatar{flex-shrink:0;width:40px;height:40px;border-radius:50%;object-fit:cover}.tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:72px;width:calc(100% - 72px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:72px}.tak-list-base .tak-list-item .tak-list-icon,.tak-list-base .tak-list-option .tak-list-icon{flex-shrink:0;width:24px;height:24px;font-size:24px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:64px;width:calc(100% - 64px)}[dir=rtl] .tak-list-base .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:64px}.tak-list-base .tak-list-item .tak-divider,.tak-list-base .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base .tak-list-item .tak-divider,[dir=rtl] .tak-list-base .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-list-base[dense]{padding-top:4px;display:block}.tak-list-base[dense] .tak-subheader{height:40px;line-height:8px}.tak-list-base[dense] .tak-subheader:first-child{margin-top:-4px}.tak-list-base[dense] .tak-list-item,.tak-list-base[dense] .tak-list-option{display:block;height:40px;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-item-content,.tak-list-base[dense] .tak-list-option .tak-list-item-content{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;padding:0 16px;position:relative;height:inherit}.tak-list-base[dense] .tak-list-item .tak-list-item-content-reverse,.tak-list-base[dense] .tak-list-option .tak-list-item-content-reverse{display:flex;align-items:center;padding:0 16px;flex-direction:row-reverse;justify-content:space-around}.tak-list-base[dense] .tak-list-item .tak-list-item-ripple,.tak-list-base[dense] .tak-list-option .tak-list-item-ripple{display:block;top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar{height:48px}.tak-list-base[dense] .tak-list-item.tak-2-line,.tak-list-base[dense] .tak-list-option.tak-2-line{height:60px}.tak-list-base[dense] .tak-list-item.tak-3-line,.tak-list-base[dense] .tak-list-option.tak-3-line{height:76px}.tak-list-base[dense] .tak-list-item.tak-multi-line,.tak-list-base[dense] .tak-list-option.tak-multi-line{height:auto}.tak-list-base[dense] .tak-list-item.tak-multi-line .tak-list-item-content,.tak-list-base[dense] .tak-list-option.tak-multi-line .tak-list-item-content{padding-top:16px;padding-bottom:16px}.tak-list-base[dense] .tak-list-item .tak-list-text,.tak-list-base[dense] .tak-list-option .tak-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden;padding:0}.tak-list-base[dense] .tak-list-item .tak-list-text>*,.tak-list-base[dense] .tak-list-option .tak-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.tak-list-base[dense] .tak-list-item .tak-list-text:empty,.tak-list-base[dense] .tak-list-option .tak-list-text:empty{display:none}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:0;padding-left:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:0}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-left:0;padding-right:16px}[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-item.tak-list-option .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar .tak-list-item-content-reverse .tak-list-text,[dir=rtl] .tak-list-base[dense] .tak-list-option.tak-list-option .tak-list-item-content-reverse .tak-list-text{padding-right:0;padding-left:16px}.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-item.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content-reverse .tak-list-text,.tak-list-base[dense] .tak-list-option.tak-list-item-with-avatar.tak-list-option .tak-list-item-content .tak-list-text{padding-right:16px;padding-left:16px}.tak-list-base[dense] .tak-list-item .tak-list-avatar,.tak-list-base[dense] .tak-list-option .tak-list-avatar{flex-shrink:0;width:36px;height:36px;border-radius:50%;object-fit:cover}.tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:68px;width:calc(100% - 68px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-avatar~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-avatar~.tak-divider-inset{margin-left:auto;margin-right:68px}.tak-list-base[dense] .tak-list-item .tak-list-icon,.tak-list-base[dense] .tak-list-option .tak-list-icon{flex-shrink:0;width:20px;height:20px;font-size:20px;box-sizing:content-box;border-radius:50%;padding:4px}.tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:60px;width:calc(100% - 60px)}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-list-icon~.tak-divider-inset,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-list-icon~.tak-divider-inset{margin-left:auto;margin-right:60px}.tak-list-base[dense] .tak-list-item .tak-divider,.tak-list-base[dense] .tak-list-option .tak-divider{position:absolute;bottom:0;left:0;width:100%;margin:0}[dir=rtl] .tak-list-base[dense] .tak-list-item .tak-divider,[dir=rtl] .tak-list-base[dense] .tak-list-option .tak-divider{margin-left:auto;margin-right:0}.tak-list-base[dense] .tak-list-item .tak-divider.tak-divider-inset,.tak-list-base[dense] .tak-list-option .tak-divider.tak-divider-inset{position:absolute}.tak-nav-list a{text-decoration:none;color:inherit}.tak-nav-list .tak-list-item{cursor:pointer;outline:none}tak-action-list .tak-list-item{cursor:pointer;outline:inherit}.tak-list-option:not(.tak-list-item-disabled){cursor:pointer;outline:none}.tak-list-item-disabled{pointer-events:none}.cdk-high-contrast-active .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active :host .tak-list-item-disabled{opacity:.5}.cdk-high-contrast-active .tak-list-option:hover,.cdk-high-contrast-active .tak-nav-list .tak-list-item:hover,.cdk-high-contrast-active tak-action-list .tak-list-item:hover{outline:dotted 1px;z-index:1}.cdk-high-contrast-active .tak-list-single-selected-option::after{content:"";position:absolute;top:50%;right:16px;transform:translateY(-50%);width:10px;height:0;border-bottom:solid 10px;border-radius:10px}.cdk-high-contrast-active [dir=rtl] .tak-list-single-selected-option::after{right:auto;left:16px}@media(hover: none){.tak-list-option:not(.tak-list-single-selected-option):not(.tak-list-item-disabled):hover,.tak-nav-list .tak-list-item:not(.tak-list-item-disabled):hover,.tak-action-list .tak-list-item:not(.tak-list-item-disabled):hover{background:none}}',
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [{ type: i0.ElementRef }];
  },
});
/**
 * Directive whose purpose is to add the tak- CSS styling to this selector.
 * @docs-private
 */
export class TakListAvatarCssTakStyler {}
TakListAvatarCssTakStyler.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListAvatarCssTakStyler,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakListAvatarCssTakStyler.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakListAvatarCssTakStyler,
  selector: '[tak-list-avatar], [takListAvatar]',
  host: { classAttribute: 'tak-list-avatar' },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListAvatarCssTakStyler,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[tak-list-avatar], [takListAvatar]',
          host: { class: 'tak-list-avatar' },
        },
      ],
    },
  ],
});
/**
 * Directive whose purpose is to add the tak- CSS styling to this selector.
 * @docs-private
 */
export class TakListIconCssTakStyler {}
TakListIconCssTakStyler.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListIconCssTakStyler,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakListIconCssTakStyler.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakListIconCssTakStyler,
  selector: '[tak-list-icon], [takListIcon]',
  host: { classAttribute: 'tak-list-icon' },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListIconCssTakStyler,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[tak-list-icon], [takListIcon]',
          host: { class: 'tak-list-icon' },
        },
      ],
    },
  ],
});
/**
 * Directive whose purpose is to add the tak- CSS styling to this selector.
 * @docs-private
 */
export class TakListSubheaderCssTakStyler {}
TakListSubheaderCssTakStyler.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListSubheaderCssTakStyler,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
TakListSubheaderCssTakStyler.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakListSubheaderCssTakStyler,
  selector: '[tak-subheader], [takSubheader]',
  host: { classAttribute: 'tak-subheader' },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListSubheaderCssTakStyler,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[tak-subheader], [takSubheader]',
          host: { class: 'tak-subheader' },
        },
      ],
    },
  ],
});
/** An item within a Material Design list. */
export class TakListItem extends _TakListItemMixinBase {
  constructor(_element, _changeDetectorRef, navList, list) {
    super();
    this._element = _element;
    this._isInteractiveList = false;
    this._destroyed = new Subject();
    this._disabled = false;
    this._isInteractiveList = !!(navList || (list && list._getListType() === 'action-list'));
    this._list = navList || list;
    // If no type attribute is specified for <button>, set it to "button".
    // If a type attribute is already specified, do nothing.
    const element = this._getHostElement();
    if (element.nodeName.toLowerCase() === 'button' && !element.hasAttribute('type')) {
      element.setAttribute('type', 'button');
    }
    if (this._list) {
      // React to changes in the state of the parent list since
      // some of the item's properties depend on it (e.g. `disableRipple`).
      this._list._stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
        _changeDetectorRef.markForCheck();
      });
    }
  }
  /** Whether the option is disabled. */
  get disabled() {
    return this._disabled || !!(this._list && this._list.disabled);
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  ngAfterContentInit() {
    setLines(this._lines, this._element);
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Whether this list item should show a ripple effect when clicked. */
  _isRippleDisabled() {
    return (
      !this._isInteractiveList || this.disableRipple || !!(this._list && this._list.disableRipple)
    );
  }
  /** Retrieves the DOM element of the component host. */
  _getHostElement() {
    return this._element.nativeElement;
  }
}
TakListItem.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListItem,
  deps: [
    { token: i0.ElementRef },
    { token: i0.ChangeDetectorRef },
    { token: TAK_NAV_LIST, optional: true },
    { token: TAK_LIST, optional: true },
  ],
  target: i0.ɵɵFactoryTarget.Component,
});
TakListItem.ɵcmp = i0.ɵɵngDeclareComponent({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: TakListItem,
  selector: 'tak-list-item, a[tak-list-item], button[tak-list-item]',
  inputs: { disableRipple: 'disableRipple', disabled: 'disabled' },
  host: {
    properties: {
      'class.tak-list-item-disabled': 'disabled',
      'class.tak-list-item-with-avatar': '_avatar || _icon',
    },
    classAttribute: 'tak-list-item tak-focus-indicator',
  },
  queries: [
    {
      propertyName: '_avatar',
      first: true,
      predicate: TakListAvatarCssTakStyler,
      descendants: true,
    },
    { propertyName: '_icon', first: true, predicate: TakListIconCssTakStyler, descendants: true },
    { propertyName: '_lines', predicate: TakLine, descendants: true },
  ],
  exportAs: ['takListItem'],
  usesInheritance: true,
  ngImport: i0,
  template:
    '<span class="tak-list-item-content">\n  <span class="tak-list-item-ripple" tak-ripple\n       [takRippleTrigger]="_getHostElement()"\n       [takRippleDisabled]="_isRippleDisabled()">\n  </span>\n\n  <ng-content select="[tak-list-avatar], [tak-list-icon], [takListAvatar], [takListIcon]">\n  </ng-content>\n\n  <span class="tak-list-text"><ng-content select="[tak-line], [takLine]"></ng-content></span>\n\n  <ng-content></ng-content>\n</span>\n',
  dependencies: [
    {
      kind: 'directive',
      type: i1.TakRipple,
      selector: '[tak-ripple], [takRipple]',
      inputs: [
        'takRippleColor',
        'takRippleUnbounded',
        'takRippleCentered',
        'takRippleRadius',
        'takRippleAnimation',
        'takRippleDisabled',
        'takRippleTrigger',
      ],
      exportAs: ['takRipple'],
    },
  ],
  changeDetection: i0.ChangeDetectionStrategy.OnPush,
  encapsulation: i0.ViewEncapsulation.None,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TakListItem,
  decorators: [
    {
      type: Component,
      args: [
        {
          selector: 'tak-list-item, a[tak-list-item], button[tak-list-item]',
          exportAs: 'takListItem',
          host: {
            class: 'tak-list-item tak-focus-indicator',
            '[class.tak-list-item-disabled]': 'disabled',
            '[class.tak-list-item-with-avatar]': '_avatar || _icon',
          },
          inputs: ['disableRipple'],
          encapsulation: ViewEncapsulation.None,
          changeDetection: ChangeDetectionStrategy.OnPush,
          template:
            '<span class="tak-list-item-content">\n  <span class="tak-list-item-ripple" tak-ripple\n       [takRippleTrigger]="_getHostElement()"\n       [takRippleDisabled]="_isRippleDisabled()">\n  </span>\n\n  <ng-content select="[tak-list-avatar], [tak-list-icon], [takListAvatar], [takListIcon]">\n  </ng-content>\n\n  <span class="tak-list-text"><ng-content select="[tak-line], [takLine]"></ng-content></span>\n\n  <ng-content></ng-content>\n</span>\n',
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [
      { type: i0.ElementRef },
      { type: i0.ChangeDetectorRef },
      {
        type: TakNavList,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [TAK_NAV_LIST],
          },
        ],
      },
      {
        type: TakList,
        decorators: [
          {
            type: Optional,
          },
          {
            type: Inject,
            args: [TAK_LIST],
          },
        ],
      },
    ];
  },
  propDecorators: {
    _lines: [
      {
        type: ContentChildren,
        args: [TakLine, { descendants: true }],
      },
    ],
    _avatar: [
      {
        type: ContentChild,
        args: [TakListAvatarCssTakStyler],
      },
    ],
    _icon: [
      {
        type: ContentChild,
        args: [TakListIconCssTakStyler],
      },
    ],
    disabled: [
      {
        type: Input,
      },
    ],
  },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L2xpc3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0Lmh0bWwiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC9saXN0LWl0ZW0uaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMscUJBQXFCLEVBQWUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsaUJBQWlCLEVBQ2pCLEtBQUssRUFDTCxjQUFjLEVBQ2QsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFHTCxPQUFPLEVBQ1AsUUFBUSxFQUNSLGtCQUFrQixFQUNsQixhQUFhLEdBQ2QsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBRXpDLDhDQUE4QztBQUM5QyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLGtCQUFrQixDQUFDO0NBQVEsQ0FBQyxDQUFDLENBQUM7QUFFakUsa0RBQWtEO0FBQ2xELG9CQUFvQjtBQUNwQixNQUFNLHFCQUFxQixHQUFHLGtCQUFrQixDQUFDO0NBQVEsQ0FBQyxDQUFDO0FBRTNEOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLENBQVUsU0FBUyxDQUFDLENBQUM7QUFFL0Q7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FB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QUNyQyxDQUFDOzt3R0FwRVUsV0FBVyw2RUFlQSxZQUFZLDZCQUNaLFFBQVE7NEZBaEJuQixXQUFXLHVYQVNSLHlCQUF5Qix3RUFDekIsdUJBQXVCLDREQUZwQixPQUFPLGtHRWxNMUIsNGNBYUE7MkZGNkthLFdBQVc7a0JBYnZCLFNBQVM7K0JBQ0Usd0RBQXdELFlBQ3hELGFBQWEsUUFDakI7d0JBQ0osT0FBTyxFQUFFLG1DQUFtQzt3QkFDNUMsZ0NBQWdDLEVBQUUsVUFBVTt3QkFDNUMsbUNBQW1DLEVBQUUsa0JBQWtCO3FCQUN4RCxVQUNPLENBQUMsZUFBZSxDQUFDLGlCQUVWLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07bUhBaUJELFVBQVU7MEJBQXJELFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsWUFBWTs4QkFDSyxPQUFPOzBCQUEzQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLFFBQVE7NENBUmlCLE1BQU07c0JBQXBELGVBQWU7dUJBQUMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFDSixPQUFPO3NCQUEvQyxZQUFZO3VCQUFDLHlCQUF5QjtnQkFDQSxLQUFLO3NCQUEzQyxZQUFZO3VCQUFDLHVCQUF1QjtnQkErQmpDLFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgQm9vbGVhbklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgSW5wdXQsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2FuRGlzYWJsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgTWF0TGluZSxcbiAgc2V0TGluZXMsXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgbWl4aW5EaXNhYmxlZCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRMaXN0LlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRMaXN0QmFzZSA9IG1peGluRGlzYWJsZWQobWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KSk7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0TGlzdEl0ZW0uXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdExpc3RJdGVtTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcblxuLyoqXG4gKiBJbmplY3Rpb24gdG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBpbmplY3QgaW5zdGFuY2VzIG9mIGBNYXRMaXN0YC4gSXQgc2VydmVzIGFzXG4gKiBhbHRlcm5hdGl2ZSB0b2tlbiB0byB0aGUgYWN0dWFsIGBNYXRMaXN0YCBjbGFzcyB3aGljaCBjb3VsZCBjYXVzZSB1bm5lY2Vzc2FyeVxuICogcmV0ZW50aW9uIG9mIHRoZSBjbGFzcyBhbmQgaXRzIGNvbXBvbmVudCBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9MSVNUID0gbmV3IEluamVjdGlvblRva2VuPE1hdExpc3Q+KCdNYXRMaXN0Jyk7XG5cbi8qKlxuICogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gaW5qZWN0IGluc3RhbmNlcyBvZiBgTWF0TmF2TGlzdGAuIEl0IHNlcnZlcyBhc1xuICogYWx0ZXJuYXRpdmUgdG9rZW4gdG8gdGhlIGFjdHVhbCBgTWF0TmF2TGlzdGAgY2xhc3Mgd2hpY2ggY291bGQgY2F1c2UgdW5uZWNlc3NhcnlcbiAqIHJldGVudGlvbiBvZiB0aGUgY2xhc3MgYW5kIGl0cyBjb21wb25lbnQgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTkFWX0xJU1QgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0TmF2TGlzdD4oJ01hdE5hdkxpc3QnKTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LW5hdi1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXROYXZMaXN0JyxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ25hdmlnYXRpb24nLFxuICAgICdjbGFzcyc6ICdtYXQtbmF2LWxpc3QgbWF0LWxpc3QtYmFzZScsXG4gIH0sXG4gIHRlbXBsYXRlVXJsOiAnbGlzdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2xpc3QuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJywgJ2Rpc2FibGVkJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX05BVl9MSVNULCB1c2VFeGlzdGluZzogTWF0TmF2TGlzdH1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXROYXZMaXN0XG4gIGV4dGVuZHMgX01hdExpc3RCYXNlXG4gIGltcGxlbWVudHMgQ2FuRGlzYWJsZSwgQ2FuRGlzYWJsZVJpcHBsZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3lcbntcbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHN0YXRlIG9mIHRoZSBsaXN0IGNoYW5nZXMuICovXG4gIHJlYWRvbmx5IF9zdGF0ZUNoYW5nZXMgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5uZXh0KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbGlzdCwgbWF0LWFjdGlvbi1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICdsaXN0Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1saXN0IG1hdC1saXN0LWJhc2UnLFxuICB9LFxuICBzdHlsZVVybHM6IFsnbGlzdC5jc3MnXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnLCAnZGlzYWJsZWQnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfTElTVCwgdXNlRXhpc3Rpbmc6IE1hdExpc3R9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdFxuICBleHRlbmRzIF9NYXRMaXN0QmFzZVxuICBpbXBsZW1lbnRzIENhbkRpc2FibGUsIENhbkRpc2FibGVSaXBwbGUsIE9uQ2hhbmdlcywgT25EZXN0cm95XG57XG4gIC8qKiBFbWl0cyB3aGVuIHRoZSBzdGF0ZSBvZiB0aGUgbGlzdCBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAodGhpcy5fZ2V0TGlzdFR5cGUoKSA9PT0gJ2FjdGlvbi1saXN0Jykge1xuICAgICAgX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtYWN0aW9uLWxpc3QnKTtcbiAgICAgIF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2dyb3VwJyk7XG4gICAgfVxuICB9XG5cbiAgX2dldExpc3RUeXBlKCk6ICdsaXN0JyB8ICdhY3Rpb24tbGlzdCcgfCBudWxsIHtcbiAgICBjb25zdCBub2RlTmFtZSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgaWYgKG5vZGVOYW1lID09PSAnbWF0LWxpc3QnKSB7XG4gICAgICByZXR1cm4gJ2xpc3QnO1xuICAgIH1cblxuICAgIGlmIChub2RlTmFtZSA9PT0gJ21hdC1hY3Rpb24tbGlzdCcpIHtcbiAgICAgIHJldHVybiAnYWN0aW9uLWxpc3QnO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtbGlzdC1hdmF0YXJdLCBbbWF0TGlzdEF2YXRhcl0nLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1saXN0LWF2YXRhcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0QXZhdGFyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXQtbGlzdC1pY29uXSwgW21hdExpc3RJY29uXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWxpc3QtaWNvbid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMaXN0SWNvbkNzc01hdFN0eWxlciB7fVxuXG4vKipcbiAqIERpcmVjdGl2ZSB3aG9zZSBwdXJwb3NlIGlzIHRvIGFkZCB0aGUgbWF0LSBDU1Mgc3R5bGluZyB0byB0aGlzIHNlbGVjdG9yLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXN1YmhlYWRlcl0sIFttYXRTdWJoZWFkZXJdJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtc3ViaGVhZGVyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExpc3RTdWJoZWFkZXJDc3NNYXRTdHlsZXIge31cblxuLyoqIEFuIGl0ZW0gd2l0aGluIGEgTWF0ZXJpYWwgRGVzaWduIGxpc3QuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtbGlzdC1pdGVtLCBhW21hdC1saXN0LWl0ZW1dLCBidXR0b25bbWF0LWxpc3QtaXRlbV0nLFxuICBleHBvcnRBczogJ21hdExpc3RJdGVtJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbGlzdC1pdGVtIG1hdC1mb2N1cy1pbmRpY2F0b3InLFxuICAgICdbY2xhc3MubWF0LWxpc3QtaXRlbS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LWxpc3QtaXRlbS13aXRoLWF2YXRhcl0nOiAnX2F2YXRhciB8fCBfaWNvbicsXG4gIH0sXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIHRlbXBsYXRlVXJsOiAnbGlzdC1pdGVtLmh0bWwnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGlzdEl0ZW1cbiAgZXh0ZW5kcyBfTWF0TGlzdEl0ZW1NaXhpbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBDYW5EaXNhYmxlUmlwcGxlLCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfaXNJbnRlcmFjdGl2ZUxpc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbGlzdD86IE1hdE5hdkxpc3QgfCBNYXRMaXN0O1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGluZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGluZT47XG4gIEBDb250ZW50Q2hpbGQoTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcikgX2F2YXRhcjogTWF0TGlzdEF2YXRhckNzc01hdFN0eWxlcjtcbiAgQENvbnRlbnRDaGlsZChNYXRMaXN0SWNvbkNzc01hdFN0eWxlcikgX2ljb246IE1hdExpc3RJY29uQ3NzTWF0U3R5bGVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfTkFWX0xJU1QpIG5hdkxpc3Q/OiBNYXROYXZMaXN0LFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTUFUX0xJU1QpIGxpc3Q/OiBNYXRMaXN0LFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2lzSW50ZXJhY3RpdmVMaXN0ID0gISEobmF2TGlzdCB8fCAobGlzdCAmJiBsaXN0Ll9nZXRMaXN0VHlwZSgpID09PSAnYWN0aW9uLWxpc3QnKSk7XG4gICAgdGhpcy5fbGlzdCA9IG5hdkxpc3QgfHwgbGlzdDtcblxuICAgIC8vIElmIG5vIHR5cGUgYXR0cmlidXRlIGlzIHNwZWNpZmllZCBmb3IgPGJ1dHRvbj4sIHNldCBpdCB0byBcImJ1dHRvblwiLlxuICAgIC8vIElmIGEgdHlwZSBhdHRyaWJ1dGUgaXMgYWxyZWFkeSBzcGVjaWZpZWQsIGRvIG5vdGhpbmcuXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2dldEhvc3RFbGVtZW50KCk7XG5cbiAgICBpZiAoZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJyAmJiAhZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2xpc3QpIHtcbiAgICAgIC8vIFJlYWN0IHRvIGNoYW5nZXMgaW4gdGhlIHN0YXRlIG9mIHRoZSBwYXJlbnQgbGlzdCBzaW5jZVxuICAgICAgLy8gc29tZSBvZiB0aGUgaXRlbSdzIHByb3BlcnRpZXMgZGVwZW5kIG9uIGl0IChlLmcuIGBkaXNhYmxlUmlwcGxlYCkuXG4gICAgICB0aGlzLl9saXN0Ll9zdGF0ZUNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIG9wdGlvbiBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAhISh0aGlzLl9saXN0ICYmIHRoaXMuX2xpc3QuZGlzYWJsZWQpO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHNldExpbmVzKHRoaXMuX2xpbmVzLCB0aGlzLl9lbGVtZW50KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3llZC5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBzaG91bGQgc2hvdyBhIHJpcHBsZSBlZmZlY3Qgd2hlbiBjbGlja2VkLiAqL1xuICBfaXNSaXBwbGVEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgIXRoaXMuX2lzSW50ZXJhY3RpdmVMaXN0IHx8IHRoaXMuZGlzYWJsZVJpcHBsZSB8fCAhISh0aGlzLl9saXN0ICYmIHRoaXMuX2xpc3QuZGlzYWJsZVJpcHBsZSlcbiAgICApO1xuICB9XG5cbiAgLyoqIFJldHJpZXZlcyB0aGUgRE9NIGVsZW1lbnQgb2YgdGhlIGNvbXBvbmVudCBob3N0LiAqL1xuICBfZ2V0SG9zdEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cbn1cbiIsIjxuZy1jb250ZW50PjwvbmctY29udGVudD5cblxuIiwiPHNwYW4gY2xhc3M9XCJtYXQtbGlzdC1pdGVtLWNvbnRlbnRcIj5cbiAgPHNwYW4gY2xhc3M9XCJtYXQtbGlzdC1pdGVtLXJpcHBsZVwiIG1hdC1yaXBwbGVcbiAgICAgICBbbWF0UmlwcGxlVHJpZ2dlcl09XCJfZ2V0SG9zdEVsZW1lbnQoKVwiXG4gICAgICAgW21hdFJpcHBsZURpc2FibGVkXT1cIl9pc1JpcHBsZURpc2FibGVkKClcIj5cbiAgPC9zcGFuPlxuXG4gIDxuZy1jb250ZW50IHNlbGVjdD1cIlttYXQtbGlzdC1hdmF0YXJdLCBbbWF0LWxpc3QtaWNvbl0sIFttYXRMaXN0QXZhdGFyXSwgW21hdExpc3RJY29uXVwiPlxuICA8L25nLWNvbnRlbnQ+XG5cbiAgPHNwYW4gY2xhc3M9XCJtYXQtbGlzdC10ZXh0XCI+PG5nLWNvbnRlbnQgc2VsZWN0PVwiW21hdC1saW5lXSwgW21hdExpbmVdXCI+PC9uZy1jb250ZW50Pjwvc3Bhbj5cblxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L3NwYW4+XG4iXX0=
