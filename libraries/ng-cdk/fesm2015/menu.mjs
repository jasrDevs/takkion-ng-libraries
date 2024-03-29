import * as i0 from '@angular/core';
import {
  Directive,
  InjectionToken,
  Optional,
  SkipSelf,
  Inject,
  Injectable,
  inject,
  Injector,
  ViewContainerRef,
  EventEmitter,
  NgZone,
  ElementRef,
  InjectFlags,
  Input,
  Output,
  ContentChildren,
  NgModule,
} from '@angular/core';
import {
  Overlay,
  OverlayConfig,
  STANDARD_DROPDOWN_BELOW_POSITIONS,
  STANDARD_DROPDOWN_ADJACENT_POSITIONS,
  OverlayModule,
} from '@takkion/ng-cdk/overlay';
import {
  UP_ARROW,
  hasModifierKey,
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  ENTER,
  SPACE,
  TAB,
  ESCAPE,
} from '@takkion/ng-cdk/keycodes';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
  mergeMap,
  mapTo,
  mergeAll,
  switchMap,
  skip,
} from 'rxjs/operators';
import { UniqueSelectionDispatcher } from '@takkion/ng-cdk/collections';
import { Subject, merge, fromEvent, defer, partition } from 'rxjs';
import { TemplatePortal } from '@takkion/ng-cdk/portal';
import { FocusKeyManager } from '@takkion/ng-cdk/a11y';
import { coerceBooleanProperty } from '@takkion/ng-cdk/coercion';
import { Directionality } from '@takkion/ng-cdk/bidi';

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A grouping container for `CdkMenuItemRadio` instances, similar to a `role="radiogroup"` element.
 */
class CdkMenuGroup {}
CdkMenuGroup.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuGroup,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuGroup.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuGroup,
  selector: '[cdkMenuGroup]',
  host: { attributes: { role: 'group' }, classAttribute: 'cdk-menu-group' },
  providers: [{ provide: UniqueSelectionDispatcher, useClass: UniqueSelectionDispatcher }],
  exportAs: ['cdkMenuGroup'],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuGroup,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuGroup]',
          exportAs: 'cdkMenuGroup',
          host: {
            role: 'group',
            class: 'cdk-menu-group',
          },
          providers: [{ provide: UniqueSelectionDispatcher, useClass: UniqueSelectionDispatcher }],
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token used to return classes implementing the Menu interface */
const CDK_MENU = new InjectionToken('cdk-menu');

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token used for an implementation of MenuStack. */
const MENU_STACK = new InjectionToken('cdk-menu-stack');
/** Provider that provides the parent menu stack, or a new menu stack if there is no parent one. */
const PARENT_OR_NEW_MENU_STACK_PROVIDER = {
  provide: MENU_STACK,
  deps: [[new Optional(), new SkipSelf(), new Inject(MENU_STACK)]],
  useFactory: parentMenuStack => parentMenuStack || new MenuStack(),
};
/** Provider that provides the parent menu stack, or a new inline menu stack if there is no parent one. */
const PARENT_OR_NEW_INLINE_MENU_STACK_PROVIDER = orientation => ({
  provide: MENU_STACK,
  deps: [[new Optional(), new SkipSelf(), new Inject(MENU_STACK)]],
  useFactory: parentMenuStack => parentMenuStack || MenuStack.inline(orientation),
});
/** The next available menu stack ID. */
let nextId$2 = 0;
/**
 * MenuStack allows subscribers to listen for close events (when a MenuStackItem is popped off
 * of the stack) in order to perform closing actions. Upon the MenuStack being empty it emits
 * from the `empty` observable specifying the next focus action which the listener should perform
 * as requested by the closer.
 */
class MenuStack {
  constructor() {
    /** The ID of this menu stack. */
    this.id = `${nextId$2++}`;
    /** All MenuStackItems tracked by this MenuStack. */
    this._elements = [];
    /** Emits the element which was popped off of the stack when requested by a closer. */
    this._close = new Subject();
    /** Emits once the MenuStack has become empty after popping off elements. */
    this._empty = new Subject();
    /** Emits whether any menu in the menu stack has focus. */
    this._hasFocus = new Subject();
    /** Observable which emits the MenuStackItem which has been requested to close. */
    this.closed = this._close;
    /** Observable which emits whether any menu in the menu stack has focus. */
    this.hasFocus = this._hasFocus.pipe(startWith(false), debounceTime(0), distinctUntilChanged());
    /**
     * Observable which emits when the MenuStack is empty after popping off the last element. It
     * emits a FocusNext event which specifies the action the closer has requested the listener
     * perform.
     */
    this.emptied = this._empty;
    /**
     * Whether the inline menu associated with this menu stack is vertical or horizontal.
     * `null` indicates there is no inline menu associated with this menu stack.
     */
    this._inlineMenuOrientation = null;
  }
  /** Creates a menu stack that originates from an inline menu. */
  static inline(orientation) {
    const stack = new MenuStack();
    stack._inlineMenuOrientation = orientation;
    return stack;
  }
  /**
   * Adds an item to the menu stack.
   * @param menu the MenuStackItem to put on the stack.
   */
  push(menu) {
    this._elements.push(menu);
  }
  /**
   * Pop items off of the stack up to and including `lastItem` and emit each on the close
   * observable. If the stack is empty or `lastItem` is not on the stack it does nothing.
   * @param lastItem the last item to pop off the stack.
   * @param options Options that configure behavior on close.
   */
  close(lastItem, options) {
    const { focusNextOnEmpty, focusParentTrigger } = Object.assign({}, options);
    if (this._elements.indexOf(lastItem) >= 0) {
      let poppedElement;
      do {
        poppedElement = this._elements.pop();
        this._close.next({ item: poppedElement, focusParentTrigger });
      } while (poppedElement !== lastItem);
      if (this.isEmpty()) {
        this._empty.next(focusNextOnEmpty);
      }
    }
  }
  /**
   * Pop items off of the stack up to but excluding `lastItem` and emit each on the close
   * observable. If the stack is empty or `lastItem` is not on the stack it does nothing.
   * @param lastItem the element which should be left on the stack
   * @return whether or not an item was removed from the stack
   */
  closeSubMenuOf(lastItem) {
    let removed = false;
    if (this._elements.indexOf(lastItem) >= 0) {
      removed = this.peek() !== lastItem;
      while (this.peek() !== lastItem) {
        this._close.next({ item: this._elements.pop() });
      }
    }
    return removed;
  }
  /**
   * Pop off all MenuStackItems and emit each one on the `close` observable one by one.
   * @param options Options that configure behavior on close.
   */
  closeAll(options) {
    const { focusNextOnEmpty, focusParentTrigger } = Object.assign({}, options);
    if (!this.isEmpty()) {
      while (!this.isEmpty()) {
        const menuStackItem = this._elements.pop();
        if (menuStackItem) {
          this._close.next({ item: menuStackItem, focusParentTrigger });
        }
      }
      this._empty.next(focusNextOnEmpty);
    }
  }
  /** Return true if this stack is empty. */
  isEmpty() {
    return !this._elements.length;
  }
  /** Return the length of the stack. */
  length() {
    return this._elements.length;
  }
  /** Get the top most element on the stack. */
  peek() {
    return this._elements[this._elements.length - 1];
  }
  /** Whether the menu stack is associated with an inline menu. */
  hasInlineMenu() {
    return this._inlineMenuOrientation != null;
  }
  /** The orientation of the associated inline menu. */
  inlineMenuOrientation() {
    return this._inlineMenuOrientation;
  }
  /** Sets whether the menu stack contains the focused element. */
  setHasFocus(hasFocus) {
    this._hasFocus.next(hasFocus);
  }
}
MenuStack.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: MenuStack,
  deps: [],
  target: i0.ɵɵFactoryTarget.Injectable,
});
MenuStack.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: MenuStack,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: MenuStack,
  decorators: [
    {
      type: Injectable,
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token used for an implementation of MenuStack. */
const MENU_TRIGGER = new InjectionToken('cdk-menu-trigger');
/**
 * Abstract directive that implements shared logic common to all menu triggers.
 * This class can be extended to create custom menu trigger types.
 */
class CdkMenuTriggerBase {
  constructor() {
    /** The DI injector for this component. */
    this.injector = inject(Injector);
    /** The view container ref for this component */
    this.viewContainerRef = inject(ViewContainerRef);
    /** The menu stack in which this menu resides. */
    this.menuStack = inject(MENU_STACK);
    /** Emits when the attached menu is requested to open */
    this.opened = new EventEmitter();
    /** Emits when the attached menu is requested to close */
    this.closed = new EventEmitter();
    /** A reference to the overlay which manages the triggered menu */
    this.overlayRef = null;
    /** Emits when this trigger is destroyed. */
    this.destroyed = new Subject();
    /** Emits when the outside pointer events listener on the overlay should be stopped. */
    this.stopOutsideClicksListener = merge(this.closed, this.destroyed);
  }
  ngOnDestroy() {
    this._destroyOverlay();
    this.destroyed.next();
    this.destroyed.complete();
  }
  /** Whether the attached menu is open. */
  isOpen() {
    var _a;
    return !!((_a = this.overlayRef) === null || _a === void 0 ? void 0 : _a.hasAttached());
  }
  /** Registers a child menu as having been opened by this trigger. */
  registerChildMenu(child) {
    this.childMenu = child;
  }
  /**
   * Get the portal to be attached to the overlay which contains the menu. Allows for the menu
   * content to change dynamically and be reflected in the application.
   */
  getMenuContentPortal() {
    var _a;
    const hasMenuContentChanged =
      this.menuTemplateRef !==
      ((_a = this._menuPortal) === null || _a === void 0 ? void 0 : _a.templateRef);
    if (this.menuTemplateRef && (!this._menuPortal || hasMenuContentChanged)) {
      this._menuPortal = new TemplatePortal(
        this.menuTemplateRef,
        this.viewContainerRef,
        undefined,
        this._getChildMenuInjector()
      );
    }
    return this._menuPortal;
  }
  /**
   * Whether the given element is inside the scope of this trigger's menu stack.
   * @param element The element to check.
   * @return Whether the element is inside the scope of this trigger's menu stack.
   */
  isElementInsideMenuStack(element) {
    var _a;
    for (
      let el = element;
      el;
      el =
        (_a = el === null || el === void 0 ? void 0 : el.parentElement) !== null && _a !== void 0
          ? _a
          : null
    ) {
      if (el.getAttribute('data-cdk-menu-stack-id') === this.menuStack.id) {
        return true;
      }
    }
    return false;
  }
  /** Destroy and unset the overlay reference it if exists */
  _destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
  /** Gets the injector to use when creating a child menu. */
  _getChildMenuInjector() {
    this._childMenuInjector =
      this._childMenuInjector ||
      Injector.create({
        providers: [
          { provide: MENU_TRIGGER, useValue: this },
          { provide: MENU_STACK, useValue: this.menuStack },
        ],
        parent: this.injector,
      });
    return this._childMenuInjector;
  }
}
CdkMenuTriggerBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuTriggerBase,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuTriggerBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuTriggerBase,
  host: {
    properties: {
      'attr.aria-controls': 'childMenu?.id',
      'attr.data-cdk-menu-stack-id': 'menuStack.id',
    },
  },
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuTriggerBase,
  decorators: [
    {
      type: Directive,
      args: [
        {
          host: {
            '[attr.aria-controls]': 'childMenu?.id',
            '[attr.data-cdk-menu-stack-id]': 'menuStack.id',
          },
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Throws an exception when an instance of the PointerFocusTracker is not provided.
 * @docs-private
 */
function throwMissingPointerFocusTracker() {
  throw Error('expected an instance of PointerFocusTracker to be provided');
}
/**
 * Throws an exception when a reference to the parent menu is not provided.
 * @docs-private
 */
function throwMissingMenuReference() {
  throw Error('expected a reference to the parent menu');
}

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Injection token used for an implementation of MenuAim. */
const MENU_AIM = new InjectionToken('cdk-menu-aim');
/** Capture every nth mouse move event. */
const MOUSE_MOVE_SAMPLE_FREQUENCY = 3;
/** The number of mouse move events to track. */
const NUM_POINTS = 5;
/**
 * How long to wait before closing a sibling menu if a user stops short of the submenu they were
 * predicted to go into.
 */
const CLOSE_DELAY = 300;
/** Calculate the slope between point a and b. */
function getSlope(a, b) {
  return (b.y - a.y) / (b.x - a.x);
}
/** Calculate the y intercept for the given point and slope. */
function getYIntercept(point, slope) {
  return point.y - slope * point.x;
}
/**
 * Whether the given mouse trajectory line defined by the slope and y intercept falls within the
 * submenu as defined by `submenuPoints`
 * @param submenuPoints the submenu DOMRect points.
 * @param m the slope of the trajectory line.
 * @param b the y intercept of the trajectory line.
 * @return true if any point on the line falls within the submenu.
 */
function isWithinSubmenu(submenuPoints, m, b) {
  const { left, right, top, bottom } = submenuPoints;
  // Check for intersection with each edge of the submenu (left, right, top, bottom)
  // by fixing one coordinate to that edge's coordinate (either x or y) and checking if the
  // other coordinate is within bounds.
  return (
    (m * left + b >= top && m * left + b <= bottom) ||
    (m * right + b >= top && m * right + b <= bottom) ||
    ((top - b) / m >= left && (top - b) / m <= right) ||
    ((bottom - b) / m >= left && (bottom - b) / m <= right)
  );
}
/**
 * TargetMenuAim predicts if a user is moving into a submenu. It calculates the
 * trajectory of the user's mouse movement in the current menu to determine if the
 * mouse is moving towards an open submenu.
 *
 * The determination is made by calculating the slope of the users last NUM_POINTS moves where each
 * pair of points determines if the trajectory line points into the submenu. It uses consensus
 * approach by checking if at least NUM_POINTS / 2 pairs determine that the user is moving towards
 * to submenu.
 */
class TargetMenuAim {
  constructor() {
    /** The Angular zone. */
    this._ngZone = inject(NgZone);
    /** The last NUM_POINTS mouse move events. */
    this._points = [];
    /** Emits when this service is destroyed. */
    this._destroyed = new Subject();
  }
  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Set the Menu and its PointerFocusTracker.
   * @param menu The menu that this menu aim service controls.
   * @param pointerTracker The `PointerFocusTracker` for the given menu.
   */
  initialize(menu, pointerTracker) {
    this._menu = menu;
    this._pointerTracker = pointerTracker;
    this._subscribeToMouseMoves();
  }
  /**
   * Calls the `doToggle` callback when it is deemed that the user is not moving towards
   * the submenu.
   * @param doToggle the function called when the user is not moving towards the submenu.
   */
  toggle(doToggle) {
    // If the menu is horizontal the sub-menus open below and there is no risk of premature
    // closing of any sub-menus therefore we automatically resolve the callback.
    if (this._menu.orientation === 'horizontal') {
      doToggle();
    }
    this._checkConfigured();
    const siblingItemIsWaiting = !!this._timeoutId;
    const hasPoints = this._points.length > 1;
    if (hasPoints && !siblingItemIsWaiting) {
      if (this._isMovingToSubmenu()) {
        this._startTimeout(doToggle);
      } else {
        doToggle();
      }
    } else if (!siblingItemIsWaiting) {
      doToggle();
    }
  }
  /**
   * Start the delayed toggle handler if one isn't running already.
   *
   * The delayed toggle handler executes the `doToggle` callback after some period of time iff the
   * users mouse is on an item in the current menu.
   *
   * @param doToggle the function called when the user is not moving towards the submenu.
   */
  _startTimeout(doToggle) {
    // If the users mouse is moving towards a submenu we don't want to immediately resolve.
    // Wait for some period of time before determining if the previous menu should close in
    // cases where the user may have moved towards the submenu but stopped on a sibling menu
    // item intentionally.
    const timeoutId = setTimeout(() => {
      // Resolve if the user is currently moused over some element in the root menu
      if (this._pointerTracker.activeElement && timeoutId === this._timeoutId) {
        doToggle();
      }
      this._timeoutId = null;
    }, CLOSE_DELAY);
    this._timeoutId = timeoutId;
  }
  /** Whether the user is heading towards the open submenu. */
  _isMovingToSubmenu() {
    const submenuPoints = this._getSubmenuBounds();
    if (!submenuPoints) {
      return false;
    }
    let numMoving = 0;
    const currPoint = this._points[this._points.length - 1];
    // start from the second last point and calculate the slope between each point and the last
    // point.
    for (let i = this._points.length - 2; i >= 0; i--) {
      const previous = this._points[i];
      const slope = getSlope(currPoint, previous);
      if (isWithinSubmenu(submenuPoints, slope, getYIntercept(currPoint, slope))) {
        numMoving++;
      }
    }
    return numMoving >= Math.floor(NUM_POINTS / 2);
  }
  /** Get the bounding DOMRect for the open submenu. */
  _getSubmenuBounds() {
    var _a, _b, _c;
    return (_c =
      (_b = (_a = this._pointerTracker) === null || _a === void 0 ? void 0 : _a.previousElement) ===
        null || _b === void 0
        ? void 0
        : _b.getMenu()) === null || _c === void 0
      ? void 0
      : _c.nativeElement.getBoundingClientRect();
  }
  /**
   * Check if a reference to the PointerFocusTracker and menu element is provided.
   * @throws an error if neither reference is provided.
   */
  _checkConfigured() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!this._pointerTracker) {
        throwMissingPointerFocusTracker();
      }
      if (!this._menu) {
        throwMissingMenuReference();
      }
    }
  }
  /** Subscribe to the root menus mouse move events and update the tracked mouse points. */
  _subscribeToMouseMoves() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this._menu.nativeElement, 'mousemove')
        .pipe(
          filter((_, index) => index % MOUSE_MOVE_SAMPLE_FREQUENCY === 0),
          takeUntil(this._destroyed)
        )
        .subscribe(event => {
          this._points.push({ x: event.clientX, y: event.clientY });
          if (this._points.length > NUM_POINTS) {
            this._points.shift();
          }
        });
    });
  }
}
TargetMenuAim.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TargetMenuAim,
  deps: [],
  target: i0.ɵɵFactoryTarget.Injectable,
});
TargetMenuAim.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TargetMenuAim,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: TargetMenuAim,
  decorators: [
    {
      type: Injectable,
    },
  ],
});
/**
 * CdkTargetMenuAim is a provider for the TargetMenuAim service. It can be added to an
 * element with either the `cdkMenu` or `cdkMenuBar` directive and child menu items.
 */
class CdkTargetMenuAim {}
CdkTargetMenuAim.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTargetMenuAim,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkTargetMenuAim.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkTargetMenuAim,
  selector: '[cdkTargetMenuAim]',
  providers: [{ provide: MENU_AIM, useClass: TargetMenuAim }],
  exportAs: ['cdkTargetMenuAim'],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkTargetMenuAim,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkTargetMenuAim]',
          exportAs: 'cdkTargetMenuAim',
          providers: [{ provide: MENU_AIM, useClass: TargetMenuAim }],
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A directive that turns its host element into a trigger for a popup menu.
 * It can be combined with cdkMenuItem to create sub-menus. If the element is in a top level
 * MenuBar it will open the menu on click, or if a sibling is already opened it will open on hover.
 * If it is inside of a Menu it will open the attached Submenu on hover regardless of its sibling
 * state.
 */
class CdkMenuTrigger extends CdkMenuTriggerBase {
  constructor() {
    super();
    /** The host element. */
    this._elementRef = inject(ElementRef);
    /** The CDK overlay service. */
    this._overlay = inject(Overlay);
    /** The Angular zone. */
    this._ngZone = inject(NgZone);
    /** The parent menu this trigger belongs to. */
    this._parentMenu = inject(CDK_MENU, InjectFlags.Optional);
    /** The menu aim service used by this menu. */
    this._menuAim = inject(MENU_AIM, InjectFlags.Optional);
    /** The directionality of the page. */
    this._directionality = inject(Directionality, InjectFlags.Optional);
    this._setRole();
    this._registerCloseHandler();
    this._subscribeToMenuStackClosed();
    this._subscribeToMouseEnter();
    this._subscribeToMenuStackHasFocus();
    this._setType();
  }
  /** Toggle the attached menu. */
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }
  /** Open the attached menu. */
  open() {
    if (!this.isOpen()) {
      this.opened.next();
      this.overlayRef = this.overlayRef || this._overlay.create(this._getOverlayConfig());
      this.overlayRef.attach(this.getMenuContentPortal());
      this._subscribeToOutsideClicks();
    }
  }
  /** Close the opened menu. */
  close() {
    if (this.isOpen()) {
      this.closed.next();
      this.overlayRef.detach();
    }
    this._closeSiblingTriggers();
  }
  /**
   * Get a reference to the rendered Menu if the Menu is open and rendered in the DOM.
   */
  getMenu() {
    return this.childMenu;
  }
  /**
   * Handles keyboard events for the menu item.
   * @param event The keyboard event to handle
   */
  _toggleOnKeydown(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const isParentVertical =
      ((_a = this._parentMenu) === null || _a === void 0 ? void 0 : _a.orientation) === 'vertical';
    const keyCode = event.keyCode;
    switch (keyCode) {
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event)) {
          this.toggle();
          (_b = this.childMenu) === null || _b === void 0 ? void 0 : _b.focusFirstItem('keyboard');
        }
        break;
      case RIGHT_ARROW:
        if (!hasModifierKey(event)) {
          if (
            this._parentMenu &&
            isParentVertical &&
            ((_c = this._directionality) === null || _c === void 0 ? void 0 : _c.value) !== 'rtl'
          ) {
            event.preventDefault();
            this.open();
            (_d = this.childMenu) === null || _d === void 0
              ? void 0
              : _d.focusFirstItem('keyboard');
          }
        }
        break;
      case LEFT_ARROW:
        if (!hasModifierKey(event)) {
          if (
            this._parentMenu &&
            isParentVertical &&
            ((_e = this._directionality) === null || _e === void 0 ? void 0 : _e.value) === 'rtl'
          ) {
            event.preventDefault();
            this.open();
            (_f = this.childMenu) === null || _f === void 0
              ? void 0
              : _f.focusFirstItem('keyboard');
          }
        }
        break;
      case DOWN_ARROW:
      case UP_ARROW:
        if (!hasModifierKey(event)) {
          if (!isParentVertical) {
            event.preventDefault();
            this.open();
            keyCode === DOWN_ARROW
              ? (_g = this.childMenu) === null || _g === void 0
                ? void 0
                : _g.focusFirstItem('keyboard')
              : (_h = this.childMenu) === null || _h === void 0
              ? void 0
              : _h.focusLastItem('keyboard');
          }
        }
        break;
    }
  }
  /**
   * Sets whether the trigger's menu stack has focus.
   * @param hasFocus Whether the menu stack has focus.
   */
  _setHasFocus(hasFocus) {
    if (!this._parentMenu) {
      this.menuStack.setHasFocus(hasFocus);
    }
  }
  /**
   * Subscribe to the mouseenter events and close any sibling menu items if this element is moused
   * into.
   */
  _subscribeToMouseEnter() {
    // Closes any sibling menu items and opens the menu associated with this trigger.
    const toggleMenus = () =>
      this._ngZone.run(() => {
        this._closeSiblingTriggers();
        this.open();
      });
    this._ngZone.runOutsideAngular(() => {
      fromEvent(this._elementRef.nativeElement, 'mouseenter')
        .pipe(
          filter(() => !this.menuStack.isEmpty() && !this.isOpen()),
          takeUntil(this.destroyed)
        )
        .subscribe(() => {
          if (this._menuAim) {
            this._menuAim.toggle(toggleMenus);
          } else {
            toggleMenus();
          }
        });
    });
  }
  /** Close out any sibling menu trigger menus. */
  _closeSiblingTriggers() {
    if (this._parentMenu) {
      // If nothing was removed from the stack and the last element is not the parent item
      // that means that the parent menu is a menu bar since we don't put the menu bar on the
      // stack
      const isParentMenuBar =
        !this.menuStack.closeSubMenuOf(this._parentMenu) &&
        this.menuStack.peek() !== this._parentMenu;
      if (isParentMenuBar) {
        this.menuStack.closeAll();
      }
    } else {
      this.menuStack.closeAll();
    }
  }
  /** Get the configuration object used to create the overlay. */
  _getOverlayConfig() {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      direction: this._directionality || undefined,
    });
  }
  /** Build the position strategy for the overlay which specifies where to place the menu. */
  _getOverlayPositionStrategy() {
    return this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withLockedPosition()
      .withGrowAfterOpen()
      .withPositions(this._getOverlayPositions());
  }
  /** Get the preferred positions for the opened menu relative to the menu item. */
  _getOverlayPositions() {
    var _a;
    return (_a = this.menuPosition) !== null && _a !== void 0
      ? _a
      : !this._parentMenu || this._parentMenu.orientation === 'horizontal'
      ? STANDARD_DROPDOWN_BELOW_POSITIONS
      : STANDARD_DROPDOWN_ADJACENT_POSITIONS;
  }
  /**
   * Subscribe to the MenuStack close events if this is a standalone trigger and close out the menu
   * this triggers when requested.
   */
  _registerCloseHandler() {
    if (!this._parentMenu) {
      this.menuStack.closed.pipe(takeUntil(this.destroyed)).subscribe(({ item }) => {
        if (item === this.childMenu) {
          this.close();
        }
      });
    }
  }
  /**
   * Subscribe to the overlays outside pointer events stream and handle closing out the stack if a
   * click occurs outside the menus.
   */
  _subscribeToOutsideClicks() {
    if (this.overlayRef) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(
          filter(
            e =>
              e.target != this._elementRef.nativeElement &&
              !this._elementRef.nativeElement.contains(e.target)
          ),
          takeUntil(this.stopOutsideClicksListener)
        )
        .subscribe(event => {
          if (!this.isElementInsideMenuStack(event.target)) {
            this.menuStack.closeAll();
          } else {
            this._closeSiblingTriggers();
          }
        });
    }
  }
  /** Subscribe to the MenuStack hasFocus events. */
  _subscribeToMenuStackHasFocus() {
    if (!this._parentMenu) {
      this.menuStack.hasFocus.pipe(takeUntil(this.destroyed)).subscribe(hasFocus => {
        if (!hasFocus) {
          this.menuStack.closeAll();
        }
      });
    }
  }
  /** Subscribe to the MenuStack closed events. */
  _subscribeToMenuStackClosed() {
    if (!this._parentMenu) {
      this.menuStack.closed.subscribe(({ focusParentTrigger }) => {
        if (focusParentTrigger && !this.menuStack.length()) {
          this._elementRef.nativeElement.focus();
        }
      });
    }
  }
  /** Sets the role attribute for this trigger if needed. */
  _setRole() {
    // If this trigger is part of another menu, the cdkMenuItem directive will handle setting the
    // role, otherwise this is a standalone trigger, and we should ensure it has role="button".
    if (!this._parentMenu) {
      this._elementRef.nativeElement.setAttribute('role', 'button');
    }
  }
  /** Sets thte `type` attribute of the trigger. */
  _setType() {
    const element = this._elementRef.nativeElement;
    if (element.nodeName === 'BUTTON' && !element.getAttribute('type')) {
      // Prevents form submissions.
      element.setAttribute('type', 'button');
    }
  }
}
CdkMenuTrigger.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuTrigger,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuTrigger.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuTrigger,
  selector: '[cdkMenuTriggerFor]',
  inputs: {
    menuTemplateRef: ['cdkMenuTriggerFor', 'menuTemplateRef'],
    menuPosition: ['cdkMenuPosition', 'menuPosition'],
  },
  outputs: { opened: 'cdkMenuOpened', closed: 'cdkMenuClosed' },
  host: {
    attributes: { 'aria-haspopup': 'menu' },
    listeners: {
      focusin: '_setHasFocus(true)',
      focusout: '_setHasFocus(false)',
      keydown: '_toggleOnKeydown($event)',
      click: 'toggle()',
    },
    properties: { 'attr.aria-expanded': 'isOpen()' },
    classAttribute: 'cdk-menu-trigger',
  },
  providers: [
    { provide: MENU_TRIGGER, useExisting: CdkMenuTrigger },
    PARENT_OR_NEW_MENU_STACK_PROVIDER,
  ],
  exportAs: ['cdkMenuTriggerFor'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuTrigger,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuTriggerFor]',
          exportAs: 'cdkMenuTriggerFor',
          host: {
            class: 'cdk-menu-trigger',
            'aria-haspopup': 'menu',
            '[attr.aria-expanded]': 'isOpen()',
            '(focusin)': '_setHasFocus(true)',
            '(focusout)': '_setHasFocus(false)',
            '(keydown)': '_toggleOnKeydown($event)',
            '(click)': 'toggle()',
          },
          inputs: ['menuTemplateRef: cdkMenuTriggerFor', 'menuPosition: cdkMenuPosition'],
          outputs: ['opened: cdkMenuOpened', 'closed: cdkMenuClosed'],
          providers: [
            { provide: MENU_TRIGGER, useExisting: CdkMenuTrigger },
            PARENT_OR_NEW_MENU_STACK_PROVIDER,
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [];
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Directive which provides the ability for an element to be focused and navigated to using the
 * keyboard when residing in a CdkMenu, CdkMenuBar, or CdkMenuGroup. It performs user defined
 * behavior when clicked.
 */
class CdkMenuItem {
  constructor() {
    /** The directionality (text direction) of the current page. */
    this._dir = inject(Directionality, InjectFlags.Optional);
    /** The menu's native DOM host element. */
    this._elementRef = inject(ElementRef);
    /** The Angular zone. */
    this._ngZone = inject(NgZone);
    /** The menu aim service used by this menu. */
    this._menuAim = inject(MENU_AIM, InjectFlags.Optional);
    /** The stack of menus this menu belongs to. */
    this._menuStack = inject(MENU_STACK);
    /** The parent menu in which this menuitem resides. */
    this._parentMenu = inject(CDK_MENU, InjectFlags.Optional);
    /** Reference to the CdkMenuItemTrigger directive if one is added to the same element */
    this._menuTrigger = inject(CdkMenuTrigger, InjectFlags.Optional | InjectFlags.Self);
    this._disabled = false;
    /**
     * If this MenuItem is a regular MenuItem, outputs when it is triggered by a keyboard or mouse
     * event.
     */
    this.triggered = new EventEmitter();
    /** Whether the menu item opens a menu. */
    this.hasMenu = !!this._menuTrigger;
    /**
     * The tabindex for this menu item managed internally and used for implementing roving a
     * tab index.
     */
    this._tabindex = -1;
    /** Whether the item should close the menu if triggered by the spacebar. */
    this.closeOnSpacebarTrigger = true;
    /** Emits when the menu item is destroyed. */
    this.destroyed = new Subject();
    this._setupMouseEnter();
    this._setType();
    if (this._isStandaloneItem()) {
      this._tabindex = 0;
    }
  }
  /**  Whether the CdkMenuItem is disabled - defaults to false */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  /** Place focus on the element. */
  focus() {
    this._elementRef.nativeElement.focus();
  }
  /**
   * If the menu item is not disabled and the element does not have a menu trigger attached, emit
   * on the cdkMenuItemTriggered emitter and close all open menus.
   * @param options Options the configure how the item is triggered
   *   - keepOpen: specifies that the menu should be kept open after triggering the item.
   */
  trigger(options) {
    const { keepOpen } = Object.assign({}, options);
    if (!this.disabled && !this.hasMenu) {
      this.triggered.next();
      if (!keepOpen) {
        this._menuStack.closeAll({ focusParentTrigger: true });
      }
    }
  }
  /** Return true if this MenuItem has an attached menu and it is open. */
  isMenuOpen() {
    var _a;
    return !!((_a = this._menuTrigger) === null || _a === void 0 ? void 0 : _a.isOpen());
  }
  /**
   * Get a reference to the rendered Menu if the Menu is open and it is visible in the DOM.
   * @return the menu if it is open, otherwise undefined.
   */
  getMenu() {
    var _a;
    return (_a = this._menuTrigger) === null || _a === void 0 ? void 0 : _a.getMenu();
  }
  /** Get the CdkMenuTrigger associated with this element. */
  getMenuTrigger() {
    return this._menuTrigger;
  }
  /** Get the label for this element which is required by the FocusableOption interface. */
  getLabel() {
    var _a;
    return (
      this.typeaheadLabel ||
      ((_a = this._elementRef.nativeElement.textContent) === null || _a === void 0
        ? void 0
        : _a.trim()) ||
      ''
    );
  }
  /** Reset the tabindex to -1. */
  _resetTabIndex() {
    if (!this._isStandaloneItem()) {
      this._tabindex = -1;
    }
  }
  /**
   * Set the tab index to 0 if not disabled and it's a focus event, or a mouse enter if this element
   * is not in a menu bar.
   */
  _setTabIndex(event) {
    if (this.disabled) {
      return;
    }
    // don't set the tabindex if there are no open sibling or parent menus
    if (!event || !this._menuStack.isEmpty()) {
      this._tabindex = 0;
    }
  }
  /**
   * Handles keyboard events for the menu item, specifically either triggering the user defined
   * callback or opening/closing the current menu based on whether the left or right arrow key was
   * pressed.
   * @param event the keyboard event to handle
   */
  _onKeydown(event) {
    var _a, _b;
    switch (event.keyCode) {
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event)) {
          this.trigger({ keepOpen: event.keyCode === SPACE && !this.closeOnSpacebarTrigger });
        }
        break;
      case RIGHT_ARROW:
        if (!hasModifierKey(event)) {
          if (this._parentMenu && this._isParentVertical()) {
            if (((_a = this._dir) === null || _a === void 0 ? void 0 : _a.value) !== 'rtl') {
              this._forwardArrowPressed(event);
            } else {
              this._backArrowPressed(event);
            }
          }
        }
        break;
      case LEFT_ARROW:
        if (!hasModifierKey(event)) {
          if (this._parentMenu && this._isParentVertical()) {
            if (((_b = this._dir) === null || _b === void 0 ? void 0 : _b.value) !== 'rtl') {
              this._backArrowPressed(event);
            } else {
              this._forwardArrowPressed(event);
            }
          }
        }
        break;
    }
  }
  /** Whether this menu item is standalone or within a menu or menu bar. */
  _isStandaloneItem() {
    return !this._parentMenu;
  }
  /**
   * Handles the user pressing the back arrow key.
   * @param event The keyboard event.
   */
  _backArrowPressed(event) {
    const parentMenu = this._parentMenu;
    if (this._menuStack.hasInlineMenu() || this._menuStack.length() > 1) {
      event.preventDefault();
      this._menuStack.close(parentMenu, {
        focusNextOnEmpty:
          this._menuStack.inlineMenuOrientation() === 'horizontal'
            ? 1 /* FocusNext.previousItem */
            : 2 /* FocusNext.currentItem */,
        focusParentTrigger: true,
      });
    }
  }
  /**
   * Handles the user pressing the forward arrow key.
   * @param event The keyboard event.
   */
  _forwardArrowPressed(event) {
    if (!this.hasMenu && this._menuStack.inlineMenuOrientation() === 'horizontal') {
      event.preventDefault();
      this._menuStack.closeAll({
        focusNextOnEmpty: 0 /* FocusNext.nextItem */,
        focusParentTrigger: true,
      });
    }
  }
  /**
   * Subscribe to the mouseenter events and close any sibling menu items if this element is moused
   * into.
   */
  _setupMouseEnter() {
    if (!this._isStandaloneItem()) {
      const closeOpenSiblings = () =>
        this._ngZone.run(() => this._menuStack.closeSubMenuOf(this._parentMenu));
      this._ngZone.runOutsideAngular(() =>
        fromEvent(this._elementRef.nativeElement, 'mouseenter')
          .pipe(
            filter(() => !this._menuStack.isEmpty() && !this.hasMenu),
            takeUntil(this.destroyed)
          )
          .subscribe(() => {
            if (this._menuAim) {
              this._menuAim.toggle(closeOpenSiblings);
            } else {
              closeOpenSiblings();
            }
          })
      );
    }
  }
  /**
   * Return true if the enclosing parent menu is configured in a horizontal orientation, false
   * otherwise or if no parent.
   */
  _isParentVertical() {
    var _a;
    return (
      ((_a = this._parentMenu) === null || _a === void 0 ? void 0 : _a.orientation) === 'vertical'
    );
  }
  /** Sets the `type` attribute of the menu item. */
  _setType() {
    const element = this._elementRef.nativeElement;
    if (element.nodeName === 'BUTTON' && !element.getAttribute('type')) {
      // Prevent form submissions.
      element.setAttribute('type', 'button');
    }
  }
}
CdkMenuItem.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItem,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuItem.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuItem,
  selector: '[cdkMenuItem]',
  inputs: {
    disabled: ['cdkMenuItemDisabled', 'disabled'],
    typeaheadLabel: ['cdkMenuitemTypeaheadLabel', 'typeaheadLabel'],
  },
  outputs: { triggered: 'cdkMenuItemTriggered' },
  host: {
    attributes: { role: 'menuitem' },
    listeners: {
      blur: '_resetTabIndex()',
      focus: '_setTabIndex()',
      click: 'trigger()',
      keydown: '_onKeydown($event)',
    },
    properties: { tabindex: '_tabindex', 'attr.aria-disabled': 'disabled || null' },
    classAttribute: 'cdk-menu-item',
  },
  exportAs: ['cdkMenuItem'],
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItem,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuItem]',
          exportAs: 'cdkMenuItem',
          host: {
            role: 'menuitem',
            class: 'cdk-menu-item',
            '[tabindex]': '_tabindex',
            '[attr.aria-disabled]': 'disabled || null',
            '(blur)': '_resetTabIndex()',
            '(focus)': '_setTabIndex()',
            '(click)': 'trigger()',
            '(keydown)': '_onKeydown($event)',
          },
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [];
  },
  propDecorators: {
    disabled: [
      {
        type: Input,
        args: ['cdkMenuItemDisabled'],
      },
    ],
    typeaheadLabel: [
      {
        type: Input,
        args: ['cdkMenuitemTypeaheadLabel'],
      },
    ],
    triggered: [
      {
        type: Output,
        args: ['cdkMenuItemTriggered'],
      },
    ],
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * PointerFocusTracker keeps track of the currently active item under mouse focus. It also has
 * observables which emit when the users mouse enters and leaves a tracked element.
 */
class PointerFocusTracker {
  constructor(
    /** The list of items being tracked. */
    _items
  ) {
    this._items = _items;
    /** Emits when an element is moused into. */
    this.entered = this._getItemPointerEntries();
    /** Emits when an element is moused out. */
    this.exited = this._getItemPointerExits();
    /** Emits when this is destroyed. */
    this._destroyed = new Subject();
    this.entered.subscribe(element => (this.activeElement = element));
    this.exited.subscribe(() => {
      this.previousElement = this.activeElement;
      this.activeElement = undefined;
    });
  }
  /** Stop the managers listeners. */
  destroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Gets a stream of pointer (mouse) entries into the given items.
   * This should typically run outside the Angular zone.
   */
  _getItemPointerEntries() {
    return defer(() =>
      this._items.changes.pipe(
        startWith(this._items),
        mergeMap(list =>
          list.map(element =>
            fromEvent(element._elementRef.nativeElement, 'mouseenter').pipe(
              mapTo(element),
              takeUntil(this._items.changes)
            )
          )
        ),
        mergeAll()
      )
    );
  }
  /**
   * Gets a stream of pointer (mouse) exits out of the given items.
   * This should typically run outside the Angular zone.
   */
  _getItemPointerExits() {
    return defer(() =>
      this._items.changes.pipe(
        startWith(this._items),
        mergeMap(list =>
          list.map(element =>
            fromEvent(element._elementRef.nativeElement, 'mouseout').pipe(
              mapTo(element),
              takeUntil(this._items.changes)
            )
          )
        ),
        mergeAll()
      )
    );
  }
}

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Counter used to create unique IDs for menus. */
let nextId$1 = 0;
/**
 * Abstract directive that implements shared logic common to all menus.
 * This class can be extended to create custom menu types.
 */
class CdkMenuBase extends CdkMenuGroup {
  constructor() {
    super(...arguments);
    /** The menu's native DOM host element. */
    this.nativeElement = inject(ElementRef).nativeElement;
    /** The Angular zone. */
    this.ngZone = inject(NgZone);
    /** The stack of menus this menu belongs to. */
    this.menuStack = inject(MENU_STACK);
    /** The menu aim service used by this menu. */
    this.menuAim = inject(MENU_AIM, InjectFlags.Optional | InjectFlags.Self);
    /** The directionality (text direction) of the current page. */
    this.dir = inject(Directionality, InjectFlags.Optional);
    /** The id of the menu's host element. */
    this.id = `cdk-menu-${nextId$1++}`;
    /** The direction items in the menu flow. */
    this.orientation = 'vertical';
    /**
     * Whether the menu is displayed inline (i.e. always present vs a conditional popup that the
     * user triggers with a trigger element).
     */
    this.isInline = false;
    /** Emits when the MenuBar is destroyed. */
    this.destroyed = new Subject();
    /** Whether this menu's menu stack has focus. */
    this._menuStackHasFocus = false;
  }
  ngAfterContentInit() {
    if (!this.isInline) {
      this.menuStack.push(this);
    }
    this._setKeyManager();
    this._subscribeToMenuStackHasFocus();
    this._subscribeToMenuOpen();
    this._subscribeToMenuStackClosed();
    this._setUpPointerTracker();
  }
  ngOnDestroy() {
    var _a;
    this.destroyed.next();
    this.destroyed.complete();
    (_a = this.pointerTracker) === null || _a === void 0 ? void 0 : _a.destroy();
  }
  /**
   * Place focus on the first MenuItem in the menu and set the focus origin.
   * @param focusOrigin The origin input mode of the focus event.
   */
  focusFirstItem(focusOrigin = 'program') {
    this.keyManager.setFocusOrigin(focusOrigin);
    this.keyManager.setFirstItemActive();
  }
  /**
   * Place focus on the last MenuItem in the menu and set the focus origin.
   * @param focusOrigin The origin input mode of the focus event.
   */
  focusLastItem(focusOrigin = 'program') {
    this.keyManager.setFocusOrigin(focusOrigin);
    this.keyManager.setLastItemActive();
  }
  /** Gets the tabindex for this menu. */
  _getTabIndex() {
    const tabindexIfInline = this._menuStackHasFocus ? -1 : 0;
    return this.isInline ? tabindexIfInline : null;
  }
  /**
   * Close the open menu if the current active item opened the requested MenuStackItem.
   * @param menu The menu requested to be closed.
   * @param options Options to configure the behavior on close.
   *   - `focusParentTrigger` Whether to focus the parent trigger after closing the menu.
   */
  closeOpenMenu(menu, options) {
    var _a, _b;
    const { focusParentTrigger } = Object.assign({}, options);
    const keyManager = this.keyManager;
    const trigger = this.triggerItem;
    if (
      menu ===
      ((_a = trigger === null || trigger === void 0 ? void 0 : trigger.getMenuTrigger()) === null ||
      _a === void 0
        ? void 0
        : _a.getMenu())
    ) {
      (_b = trigger === null || trigger === void 0 ? void 0 : trigger.getMenuTrigger()) === null ||
      _b === void 0
        ? void 0
        : _b.close();
      // If the user has moused over a sibling item we want to focus the element under mouse focus
      // not the trigger which previously opened the now closed menu.
      if (focusParentTrigger) {
        if (trigger) {
          keyManager.setActiveItem(trigger);
        } else {
          keyManager.setFirstItemActive();
        }
      }
    }
  }
  /** Setup the FocusKeyManager with the correct orientation for the menu. */
  _setKeyManager() {
    var _a;
    this.keyManager = new FocusKeyManager(this.items).withWrap().withTypeAhead().withHomeAndEnd();
    if (this.orientation === 'horizontal') {
      this.keyManager.withHorizontalOrientation(
        ((_a = this.dir) === null || _a === void 0 ? void 0 : _a.value) || 'ltr'
      );
    } else {
      this.keyManager.withVerticalOrientation();
    }
  }
  /**
   * Subscribe to the menu trigger's open events in order to track the trigger which opened the menu
   * and stop tracking it when the menu is closed.
   */
  _subscribeToMenuOpen() {
    const exitCondition = merge(this.items.changes, this.destroyed);
    this.items.changes
      .pipe(
        startWith(this.items),
        mergeMap(list =>
          list
            .filter(item => item.hasMenu)
            .map(item => item.getMenuTrigger().opened.pipe(mapTo(item), takeUntil(exitCondition)))
        ),
        mergeAll(),
        switchMap(item => {
          this.triggerItem = item;
          return item.getMenuTrigger().closed;
        }),
        takeUntil(this.destroyed)
      )
      .subscribe(() => (this.triggerItem = undefined));
  }
  /** Subscribe to the MenuStack close events. */
  _subscribeToMenuStackClosed() {
    this.menuStack.closed
      .pipe(takeUntil(this.destroyed))
      .subscribe(({ item, focusParentTrigger }) =>
        this.closeOpenMenu(item, { focusParentTrigger })
      );
  }
  /** Subscribe to the MenuStack hasFocus events. */
  _subscribeToMenuStackHasFocus() {
    if (this.isInline) {
      this.menuStack.hasFocus.pipe(takeUntil(this.destroyed)).subscribe(hasFocus => {
        this._menuStackHasFocus = hasFocus;
      });
    }
  }
  /**
   * Set the PointerFocusTracker and ensure that when mouse focus changes the key manager is updated
   * with the latest menu item under mouse focus.
   */
  _setUpPointerTracker() {
    if (this.menuAim) {
      this.ngZone.runOutsideAngular(() => {
        this.pointerTracker = new PointerFocusTracker(this.items);
      });
      this.menuAim.initialize(this, this.pointerTracker);
    }
  }
}
CdkMenuBase.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBase,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuBase.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuBase,
  inputs: { id: 'id' },
  host: {
    attributes: { role: 'menu' },
    listeners: {
      focus: 'focusFirstItem()',
      focusin: 'menuStack.setHasFocus(true)',
      focusout: 'menuStack.setHasFocus(false)',
    },
    properties: {
      tabindex: '_getTabIndex()',
      id: 'id',
      'attr.aria-orientation': 'orientation',
      'attr.data-cdk-menu-stack-id': 'menuStack.id',
    },
  },
  queries: [{ propertyName: 'items', predicate: CdkMenuItem, descendants: true }],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBase,
  decorators: [
    {
      type: Directive,
      args: [
        {
          host: {
            role: 'menu',
            class: '',
            '[tabindex]': '_getTabIndex()',
            '[id]': 'id',
            '[attr.aria-orientation]': 'orientation',
            '[attr.data-cdk-menu-stack-id]': 'menuStack.id',
            '(focus)': 'focusFirstItem()',
            '(focusin)': 'menuStack.setHasFocus(true)',
            '(focusout)': 'menuStack.setHasFocus(false)',
          },
        },
      ],
    },
  ],
  propDecorators: {
    id: [
      {
        type: Input,
      },
    ],
    items: [
      {
        type: ContentChildren,
        args: [CdkMenuItem, { descendants: true }],
      },
    ],
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Directive which configures the element as a Menu which should contain child elements marked as
 * CdkMenuItem or CdkMenuGroup. Sets the appropriate role and aria-attributes for a menu and
 * contains accessible keyboard and mouse handling logic.
 *
 * It also acts as a RadioGroup for elements marked with role `menuitemradio`.
 */
class CdkMenu extends CdkMenuBase {
  constructor() {
    var _a;
    super();
    this._parentTrigger = inject(MENU_TRIGGER, InjectFlags.Optional);
    /** Event emitted when the menu is closed. */
    this.closed = new EventEmitter();
    /** The direction items in the menu flow. */
    this.orientation = 'vertical';
    /** Whether the menu is displayed inline (i.e. always present vs a conditional popup that the user triggers with a trigger element). */
    this.isInline = !this._parentTrigger;
    this.destroyed.subscribe(this.closed);
    (_a = this._parentTrigger) === null || _a === void 0 ? void 0 : _a.registerChildMenu(this);
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._subscribeToMenuStackEmptied();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.closed.complete();
  }
  /**
   * Handle keyboard events for the Menu.
   * @param event The keyboard event to be handled.
   */
  _handleKeyEvent(event) {
    const keyManager = this.keyManager;
    switch (event.keyCode) {
      case LEFT_ARROW:
      case RIGHT_ARROW:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          keyManager.setFocusOrigin('keyboard');
          keyManager.onKeydown(event);
        }
        break;
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.menuStack.close(this, {
            focusNextOnEmpty: 2 /* FocusNext.currentItem */,
            focusParentTrigger: true,
          });
        }
        break;
      case TAB:
        if (!hasModifierKey(event, 'altKey', 'metaKey', 'ctrlKey')) {
          this.menuStack.closeAll({ focusParentTrigger: true });
        }
        break;
      default:
        keyManager.onKeydown(event);
    }
  }
  /**
   * Set focus the either the current, previous or next item based on the FocusNext event.
   * @param focusNext The element to focus.
   */
  _toggleMenuFocus(focusNext) {
    const keyManager = this.keyManager;
    switch (focusNext) {
      case 0 /* FocusNext.nextItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setNextItemActive();
        break;
      case 1 /* FocusNext.previousItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setPreviousItemActive();
        break;
      case 2 /* FocusNext.currentItem */:
        if (keyManager.activeItem) {
          keyManager.setFocusOrigin('keyboard');
          keyManager.setActiveItem(keyManager.activeItem);
        }
        break;
    }
  }
  /** Subscribe to the MenuStack emptied events. */
  _subscribeToMenuStackEmptied() {
    this.menuStack.emptied
      .pipe(takeUntil(this.destroyed))
      .subscribe(event => this._toggleMenuFocus(event));
  }
}
CdkMenu.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenu,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenu.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenu,
  selector: '[cdkMenu]',
  outputs: { closed: 'closed' },
  host: {
    attributes: { role: 'menu' },
    listeners: { keydown: '_handleKeyEvent($event)' },
    properties: { 'class.cdk-menu-inline': 'isInline' },
    classAttribute: 'cdk-menu',
  },
  providers: [
    { provide: CdkMenuGroup, useExisting: CdkMenu },
    { provide: CDK_MENU, useExisting: CdkMenu },
    PARENT_OR_NEW_INLINE_MENU_STACK_PROVIDER('vertical'),
  ],
  exportAs: ['cdkMenu'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenu,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenu]',
          exportAs: 'cdkMenu',
          host: {
            role: 'menu',
            class: 'cdk-menu',
            '[class.cdk-menu-inline]': 'isInline',
            '(keydown)': '_handleKeyEvent($event)',
          },
          providers: [
            { provide: CdkMenuGroup, useExisting: CdkMenu },
            { provide: CDK_MENU, useExisting: CdkMenu },
            PARENT_OR_NEW_INLINE_MENU_STACK_PROVIDER('vertical'),
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [];
  },
  propDecorators: {
    closed: [
      {
        type: Output,
      },
    ],
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Directive applied to an element which configures it as a MenuBar by setting the appropriate
 * role, aria attributes, and accessible keyboard and mouse handling logic. The component that
 * this directive is applied to should contain components marked with CdkMenuItem.
 *
 */
class CdkMenuBar extends CdkMenuBase {
  constructor() {
    super(...arguments);
    /** The direction items in the menu flow. */
    this.orientation = 'horizontal';
    /** Whether the menu is displayed inline (i.e. always present vs a conditional popup that the user triggers with a trigger element). */
    this.isInline = true;
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._subscribeToMenuStackEmptied();
  }
  /**
   * Handle keyboard events for the Menu.
   * @param event The keyboard event to be handled.
   */
  _handleKeyEvent(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const keyManager = this.keyManager;
    switch (event.keyCode) {
      case UP_ARROW:
      case DOWN_ARROW:
      case LEFT_ARROW:
      case RIGHT_ARROW:
        if (!hasModifierKey(event)) {
          const horizontalArrows = event.keyCode === LEFT_ARROW || event.keyCode === RIGHT_ARROW;
          // For a horizontal menu if the left/right keys were clicked, or a vertical menu if the
          // up/down keys were clicked: if the current menu is open, close it then focus and open the
          // next  menu.
          if (horizontalArrows) {
            event.preventDefault();
            const prevIsOpen =
              (_a = keyManager.activeItem) === null || _a === void 0 ? void 0 : _a.isMenuOpen();
            (_c =
              (_b = keyManager.activeItem) === null || _b === void 0
                ? void 0
                : _b.getMenuTrigger()) === null || _c === void 0
              ? void 0
              : _c.close();
            keyManager.setFocusOrigin('keyboard');
            keyManager.onKeydown(event);
            if (prevIsOpen) {
              (_e =
                (_d = keyManager.activeItem) === null || _d === void 0
                  ? void 0
                  : _d.getMenuTrigger()) === null || _e === void 0
                ? void 0
                : _e.open();
            }
          }
        }
        break;
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          (_g =
            (_f = keyManager.activeItem) === null || _f === void 0
              ? void 0
              : _f.getMenuTrigger()) === null || _g === void 0
            ? void 0
            : _g.close();
        }
        break;
      case TAB:
        if (!hasModifierKey(event, 'altKey', 'metaKey', 'ctrlKey')) {
          (_j =
            (_h = keyManager.activeItem) === null || _h === void 0
              ? void 0
              : _h.getMenuTrigger()) === null || _j === void 0
            ? void 0
            : _j.close();
        }
        break;
      default:
        keyManager.onKeydown(event);
    }
  }
  /**
   * Set focus to either the current, previous or next item based on the FocusNext event, then
   * open the previous or next item.
   * @param focusNext The element to focus.
   */
  _toggleOpenMenu(focusNext) {
    var _a, _b, _c, _d;
    const keyManager = this.keyManager;
    switch (focusNext) {
      case 0 /* FocusNext.nextItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setNextItemActive();
        (_b =
          (_a = keyManager.activeItem) === null || _a === void 0 ? void 0 : _a.getMenuTrigger()) ===
          null || _b === void 0
          ? void 0
          : _b.open();
        break;
      case 1 /* FocusNext.previousItem */:
        keyManager.setFocusOrigin('keyboard');
        keyManager.setPreviousItemActive();
        (_d =
          (_c = keyManager.activeItem) === null || _c === void 0 ? void 0 : _c.getMenuTrigger()) ===
          null || _d === void 0
          ? void 0
          : _d.open();
        break;
      case 2 /* FocusNext.currentItem */:
        if (keyManager.activeItem) {
          keyManager.setFocusOrigin('keyboard');
          keyManager.setActiveItem(keyManager.activeItem);
        }
        break;
    }
  }
  /** Subscribe to the MenuStack emptied events. */
  _subscribeToMenuStackEmptied() {
    var _a;
    (_a = this.menuStack) === null || _a === void 0
      ? void 0
      : _a.emptied.pipe(takeUntil(this.destroyed)).subscribe(event => this._toggleOpenMenu(event));
  }
}
CdkMenuBar.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBar,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuBar.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuBar,
  selector: '[cdkMenuBar]',
  host: {
    attributes: { role: 'menubar' },
    listeners: { keydown: '_handleKeyEvent($event)' },
    classAttribute: 'cdk-menu-bar',
  },
  providers: [
    { provide: CdkMenuGroup, useExisting: CdkMenuBar },
    { provide: CDK_MENU, useExisting: CdkMenuBar },
    { provide: MENU_STACK, useFactory: () => MenuStack.inline('horizontal') },
  ],
  exportAs: ['cdkMenuBar'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuBar,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuBar]',
          exportAs: 'cdkMenuBar',
          host: {
            role: 'menubar',
            class: 'cdk-menu-bar',
            '(keydown)': '_handleKeyEvent($event)',
          },
          providers: [
            { provide: CdkMenuGroup, useExisting: CdkMenuBar },
            { provide: CDK_MENU, useExisting: CdkMenuBar },
            { provide: MENU_STACK, useFactory: () => MenuStack.inline('horizontal') },
          ],
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Base class providing checked state for selectable MenuItems. */
class CdkMenuItemSelectable extends CdkMenuItem {
  constructor() {
    super(...arguments);
    this._checked = false;
    /** Whether the item should close the menu if triggered by the spacebar. */
    this.closeOnSpacebarTrigger = false;
  }
  /** Whether the element is checked */
  get checked() {
    return this._checked;
  }
  set checked(value) {
    this._checked = coerceBooleanProperty(value);
  }
}
CdkMenuItemSelectable.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemSelectable,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuItemSelectable.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuItemSelectable,
  inputs: { checked: ['cdkMenuItemChecked', 'checked'] },
  host: {
    properties: { 'attr.aria-checked': '!!checked', 'attr.aria-disabled': 'disabled || null' },
  },
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemSelectable,
  decorators: [
    {
      type: Directive,
      args: [
        {
          host: {
            '[attr.aria-checked]': '!!checked',
            '[attr.aria-disabled]': 'disabled || null',
          },
        },
      ],
    },
  ],
  propDecorators: {
    checked: [
      {
        type: Input,
        args: ['cdkMenuItemChecked'],
      },
    ],
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Counter used to set a unique id and name for a selectable item */
let nextId = 0;
/**
 * A directive providing behavior for the "menuitemradio" ARIA role, which behaves similarly to
 * a conventional radio-button. Any sibling `CdkMenuItemRadio` instances within the same `CdkMenu`
 * or `CdkMenuGroup` comprise a radio group with unique selection enforced.
 */
class CdkMenuItemRadio extends CdkMenuItemSelectable {
  constructor() {
    super();
    /** The unique selection dispatcher for this radio's `CdkMenuGroup`. */
    this._selectionDispatcher = inject(UniqueSelectionDispatcher);
    /** An ID to identify this radio item to the `UniqueSelectionDispatcher`. */
    this._id = `${nextId++}`;
    this._registerDispatcherListener();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._removeDispatcherListener();
  }
  /**
   * Toggles the checked state of the radio-button.
   * @param options Options the configure how the item is triggered
   *   - keepOpen: specifies that the menu should be kept open after triggering the item.
   */
  trigger(options) {
    super.trigger(options);
    if (!this.disabled) {
      this._selectionDispatcher.notify(this._id, '');
    }
  }
  /** Configure the unique selection dispatcher listener in order to toggle the checked state  */
  _registerDispatcherListener() {
    this._removeDispatcherListener = this._selectionDispatcher.listen(id => {
      this.checked = this._id === id;
    });
  }
}
CdkMenuItemRadio.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemRadio,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuItemRadio.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuItemRadio,
  selector: '[cdkMenuItemRadio]',
  host: {
    attributes: { role: 'menuitemradio' },
    properties: { 'class.cdk-menu-item-radio': 'true' },
  },
  providers: [
    { provide: CdkMenuItemSelectable, useExisting: CdkMenuItemRadio },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
  exportAs: ['cdkMenuItemRadio'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemRadio,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuItemRadio]',
          exportAs: 'cdkMenuItemRadio',
          host: {
            role: 'menuitemradio',
            '[class.cdk-menu-item-radio]': 'true',
          },
          providers: [
            { provide: CdkMenuItemSelectable, useExisting: CdkMenuItemRadio },
            { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [];
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A directive providing behavior for the "menuitemcheckbox" ARIA role, which behaves similarly to a
 * conventional checkbox.
 */
class CdkMenuItemCheckbox extends CdkMenuItemSelectable {
  /**
   * Toggle the checked state of the checkbox.
   * @param options Options the configure how the item is triggered
   *   - keepOpen: specifies that the menu should be kept open after triggering the item.
   */
  trigger(options) {
    super.trigger(options);
    if (!this.disabled) {
      this.checked = !this.checked;
    }
  }
}
CdkMenuItemCheckbox.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemCheckbox,
  deps: null,
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkMenuItemCheckbox.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkMenuItemCheckbox,
  selector: '[cdkMenuItemCheckbox]',
  host: {
    attributes: { role: 'menuitemcheckbox' },
    properties: { 'class.cdk-menu-item-checkbox': 'true' },
  },
  providers: [
    { provide: CdkMenuItemSelectable, useExisting: CdkMenuItemCheckbox },
    { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
  ],
  exportAs: ['cdkMenuItemCheckbox'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuItemCheckbox,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkMenuItemCheckbox]',
          exportAs: 'cdkMenuItemCheckbox',
          host: {
            role: 'menuitemcheckbox',
            '[class.cdk-menu-item-checkbox]': 'true',
          },
          providers: [
            { provide: CdkMenuItemSelectable, useExisting: CdkMenuItemCheckbox },
            { provide: CdkMenuItem, useExisting: CdkMenuItemSelectable },
          ],
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The preferred menu positions for the context menu. */
const CONTEXT_MENU_POSITIONS = STANDARD_DROPDOWN_BELOW_POSITIONS.map(position => {
  // In cases where the first menu item in the context menu is a trigger the submenu opens on a
  // hover event. We offset the context menu 2px by default to prevent this from occurring.
  const offsetX = position.overlayX === 'start' ? 2 : -2;
  const offsetY = position.overlayY === 'top' ? 2 : -2;
  return Object.assign(Object.assign({}, position), { offsetX, offsetY });
});
/** Tracks the last open context menu trigger across the entire application. */
class ContextMenuTracker {
  /**
   * Close the previous open context menu and set the given one as being open.
   * @param trigger The trigger for the currently open Context Menu.
   */
  update(trigger) {
    var _a;
    if (ContextMenuTracker._openContextMenuTrigger !== trigger) {
      (_a = ContextMenuTracker._openContextMenuTrigger) === null || _a === void 0
        ? void 0
        : _a.close();
      ContextMenuTracker._openContextMenuTrigger = trigger;
    }
  }
}
ContextMenuTracker.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: ContextMenuTracker,
  deps: [],
  target: i0.ɵɵFactoryTarget.Injectable,
});
ContextMenuTracker.ɵprov = i0.ɵɵngDeclareInjectable({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: ContextMenuTracker,
  providedIn: 'root',
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: ContextMenuTracker,
  decorators: [
    {
      type: Injectable,
      args: [{ providedIn: 'root' }],
    },
  ],
});
/**
 * A directive that opens a menu when a user right-clicks within its host element.
 * It is aware of nested context menus and will trigger only the lowest level non-disabled context menu.
 */
class CdkContextMenuTrigger extends CdkMenuTriggerBase {
  constructor() {
    super();
    /** The CDK overlay service. */
    this._overlay = inject(Overlay);
    /** The directionality of the page. */
    this._directionality = inject(Directionality, InjectFlags.Optional);
    /** The app's context menu tracking registry */
    this._contextMenuTracker = inject(ContextMenuTracker);
    this._disabled = false;
    this._setMenuStackCloseListener();
  }
  /** Whether the context menu is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
  }
  /**
   * Open the attached menu at the specified location.
   * @param coordinates where to open the context menu
   */
  open(coordinates) {
    this._open(coordinates, false);
  }
  /** Close the currently opened context menu. */
  close() {
    this.menuStack.closeAll();
  }
  /**
   * Open the context menu and closes any previously open menus.
   * @param event the mouse event which opens the context menu.
   */
  _openOnContextMenu(event) {
    var _a, _b, _c;
    if (!this.disabled) {
      // Prevent the native context menu from opening because we're opening a custom one.
      event.preventDefault();
      // Stop event propagation to ensure that only the closest enabled context menu opens.
      // Otherwise, any context menus attached to containing elements would *also* open,
      // resulting in multiple stacked context menus being displayed.
      event.stopPropagation();
      this._contextMenuTracker.update(this);
      this._open({ x: event.clientX, y: event.clientY }, true);
      // A context menu can be triggered via a mouse right click or a keyboard shortcut.
      if (event.button === 2) {
        (_a = this.childMenu) === null || _a === void 0 ? void 0 : _a.focusFirstItem('mouse');
      } else if (event.button === 0) {
        (_b = this.childMenu) === null || _b === void 0 ? void 0 : _b.focusFirstItem('keyboard');
      } else {
        (_c = this.childMenu) === null || _c === void 0 ? void 0 : _c.focusFirstItem('program');
      }
    }
  }
  /**
   * Get the configuration object used to create the overlay.
   * @param coordinates the location to place the opened menu
   */
  _getOverlayConfig(coordinates) {
    return new OverlayConfig({
      positionStrategy: this._getOverlayPositionStrategy(coordinates),
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      direction: this._directionality || undefined,
    });
  }
  /**
   * Get the position strategy for the overlay which specifies where to place the menu.
   * @param coordinates the location to place the opened menu
   */
  _getOverlayPositionStrategy(coordinates) {
    var _a;
    return this._overlay
      .position()
      .flexibleConnectedTo(coordinates)
      .withLockedPosition()
      .withGrowAfterOpen()
      .withPositions(
        (_a = this.menuPosition) !== null && _a !== void 0 ? _a : CONTEXT_MENU_POSITIONS
      );
  }
  /** Subscribe to the menu stack close events and close this menu when requested. */
  _setMenuStackCloseListener() {
    this.menuStack.closed.pipe(takeUntil(this.destroyed)).subscribe(({ item }) => {
      if (item === this.childMenu && this.isOpen()) {
        this.closed.next();
        this.overlayRef.detach();
      }
    });
  }
  /**
   * Subscribe to the overlays outside pointer events stream and handle closing out the stack if a
   * click occurs outside the menus.
   * @param ignoreFirstAuxClick Whether to ignore the first auxclick event outside the menu.
   */
  _subscribeToOutsideClicks(ignoreFirstAuxClick) {
    if (this.overlayRef) {
      let outsideClicks = this.overlayRef.outsidePointerEvents();
      // If the menu was triggered by the `contextmenu` event, skip the first `auxclick` event
      // because it fires when the mouse is released on the same click that opened the menu.
      if (ignoreFirstAuxClick) {
        const [auxClicks, nonAuxClicks] = partition(
          outsideClicks,
          ({ type }) => type === 'auxclick'
        );
        outsideClicks = merge(nonAuxClicks, auxClicks.pipe(skip(1)));
      }
      outsideClicks.pipe(takeUntil(this.stopOutsideClicksListener)).subscribe(event => {
        if (!this.isElementInsideMenuStack(event.target)) {
          this.menuStack.closeAll();
        }
      });
    }
  }
  /**
   * Open the attached menu at the specified location.
   * @param coordinates where to open the context menu
   * @param ignoreFirstOutsideAuxClick Whether to ignore the first auxclick outside the menu after opening.
   */
  _open(coordinates, ignoreFirstOutsideAuxClick) {
    if (this.disabled) {
      return;
    }
    if (this.isOpen()) {
      // since we're moving this menu we need to close any submenus first otherwise they end up
      // disconnected from this one.
      this.menuStack.closeSubMenuOf(this.childMenu);
      this.overlayRef.getConfig().positionStrategy.setOrigin(coordinates);
      this.overlayRef.updatePosition();
    } else {
      this.opened.next();
      if (this.overlayRef) {
        this.overlayRef.getConfig().positionStrategy.setOrigin(coordinates);
        this.overlayRef.updatePosition();
      } else {
        this.overlayRef = this._overlay.create(this._getOverlayConfig(coordinates));
      }
      this.overlayRef.attach(this.getMenuContentPortal());
      this._subscribeToOutsideClicks(ignoreFirstOutsideAuxClick);
    }
  }
}
CdkContextMenuTrigger.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkContextMenuTrigger,
  deps: [],
  target: i0.ɵɵFactoryTarget.Directive,
});
CdkContextMenuTrigger.ɵdir = i0.ɵɵngDeclareDirective({
  minVersion: '14.0.0',
  version: '14.2.0',
  type: CdkContextMenuTrigger,
  selector: '[cdkContextMenuTriggerFor]',
  inputs: {
    menuTemplateRef: ['cdkContextMenuTriggerFor', 'menuTemplateRef'],
    menuPosition: ['cdkContextMenuPosition', 'menuPosition'],
    disabled: ['cdkContextMenuDisabled', 'disabled'],
  },
  outputs: { opened: 'cdkContextMenuOpened', closed: 'cdkContextMenuClosed' },
  host: {
    listeners: { contextmenu: '_openOnContextMenu($event)' },
    properties: { 'attr.data-cdk-menu-stack-id': 'null' },
  },
  providers: [
    { provide: MENU_TRIGGER, useExisting: CdkContextMenuTrigger },
    { provide: MENU_STACK, useClass: MenuStack },
  ],
  exportAs: ['cdkContextMenuTriggerFor'],
  usesInheritance: true,
  ngImport: i0,
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkContextMenuTrigger,
  decorators: [
    {
      type: Directive,
      args: [
        {
          selector: '[cdkContextMenuTriggerFor]',
          exportAs: 'cdkContextMenuTriggerFor',
          host: {
            '[attr.data-cdk-menu-stack-id]': 'null',
            '(contextmenu)': '_openOnContextMenu($event)',
          },
          inputs: [
            'menuTemplateRef: cdkContextMenuTriggerFor',
            'menuPosition: cdkContextMenuPosition',
          ],
          outputs: ['opened: cdkContextMenuOpened', 'closed: cdkContextMenuClosed'],
          providers: [
            { provide: MENU_TRIGGER, useExisting: CdkContextMenuTrigger },
            { provide: MENU_STACK, useClass: MenuStack },
          ],
        },
      ],
    },
  ],
  ctorParameters: function () {
    return [];
  },
  propDecorators: {
    disabled: [
      {
        type: Input,
        args: ['cdkContextMenuDisabled'],
      },
    ],
  },
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** The list of components and directives that should be declared and exported from this module. */
const EXPORTED_DECLARATIONS = [
  CdkMenuBar,
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
  CdkMenuGroup,
  CdkContextMenuTrigger,
  CdkTargetMenuAim,
];
/** Module that declares components and directives for the CDK menu. */
class CdkMenuModule {}
CdkMenuModule.ɵfac = i0.ɵɵngDeclareFactory({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuModule,
  deps: [],
  target: i0.ɵɵFactoryTarget.NgModule,
});
CdkMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({
  minVersion: '14.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuModule,
  declarations: [
    CdkMenuBar,
    CdkMenu,
    CdkMenuItem,
    CdkMenuItemRadio,
    CdkMenuItemCheckbox,
    CdkMenuTrigger,
    CdkMenuGroup,
    CdkContextMenuTrigger,
    CdkTargetMenuAim,
  ],
  imports: [OverlayModule],
  exports: [
    CdkMenuBar,
    CdkMenu,
    CdkMenuItem,
    CdkMenuItemRadio,
    CdkMenuItemCheckbox,
    CdkMenuTrigger,
    CdkMenuGroup,
    CdkContextMenuTrigger,
    CdkTargetMenuAim,
  ],
});
CdkMenuModule.ɵinj = i0.ɵɵngDeclareInjector({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuModule,
  imports: [OverlayModule],
});
i0.ɵɵngDeclareClassMetadata({
  minVersion: '12.0.0',
  version: '14.2.0',
  ngImport: i0,
  type: CdkMenuModule,
  decorators: [
    {
      type: NgModule,
      args: [
        {
          imports: [OverlayModule],
          exports: EXPORTED_DECLARATIONS,
          declarations: EXPORTED_DECLARATIONS,
        },
      ],
    },
  ],
});

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Developed by Google LLC but not supported.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export {
  CDK_MENU,
  CdkContextMenuTrigger,
  CdkMenu,
  CdkMenuBar,
  CdkMenuBase,
  CdkMenuGroup,
  CdkMenuItem,
  CdkMenuItemCheckbox,
  CdkMenuItemRadio,
  CdkMenuItemSelectable,
  CdkMenuModule,
  CdkMenuTrigger,
  CdkMenuTriggerBase,
  CdkTargetMenuAim,
  ContextMenuTracker,
  MENU_AIM,
  MENU_STACK,
  MENU_TRIGGER,
  MenuStack,
  PARENT_OR_NEW_INLINE_MENU_STACK_PROVIDER,
  PARENT_OR_NEW_MENU_STACK_PROVIDER,
  PointerFocusTracker,
  TargetMenuAim,
};
//# sourceMappingURL=menu.mjs.map
