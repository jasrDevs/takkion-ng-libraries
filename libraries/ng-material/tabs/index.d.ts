import { _AbstractConstructor } from '@takkion/ng-material/core';
import { AfterContentChecked } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { AnimationEvent as AnimationEvent_2 } from '@angular/animations';
import { AnimationTriggerMetadata } from '@angular/animations';
import { BooleanInput } from '@takkion/ng-cdk/coercion';
import { CanColor } from '@takkion/ng-material/core';
import { CanDisable } from '@takkion/ng-material/core';
import { CanDisableRipple } from '@takkion/ng-material/core';
import { CdkPortal } from '@takkion/ng-cdk/portal';
import { CdkPortalOutlet } from '@takkion/ng-cdk/portal';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { _Constructor } from '@takkion/ng-material/core';
import { Direction } from '@takkion/ng-cdk/bidi';
import { Directionality } from '@takkion/ng-cdk/bidi';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FocusableOption } from '@takkion/ng-cdk/a11y';
import { FocusMonitor } from '@takkion/ng-cdk/a11y';
import { FocusOrigin } from '@takkion/ng-cdk/a11y';
import { HasTabIndex } from '@takkion/ng-material/core';
import * as i0 from '@angular/core';
import * as i10 from '@angular/common';
import * as i11 from '@takkion/ng-material/core';
import * as i12 from '@takkion/ng-cdk/portal';
import * as i13 from '@takkion/ng-cdk/observers';
import * as i14 from '@takkion/ng-cdk/a11y';
import { InjectionToken } from '@angular/core';
import { NgZone } from '@angular/core';
import { NumberInput } from '@takkion/ng-cdk/coercion';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Platform } from '@takkion/ng-cdk/platform';
import { QueryList } from '@angular/core';
import { RippleConfig } from '@takkion/ng-material/core';
import { RippleGlobalOptions } from '@takkion/ng-material/core';
import { RippleTarget } from '@takkion/ng-material/core';
import { SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { TemplatePortal } from '@takkion/ng-cdk/portal';
import { TemplateRef } from '@angular/core';
import { ThemePalette } from '@takkion/ng-material/core';
import { ViewContainerRef } from '@angular/core';
import { ViewportRuler } from '@takkion/ng-cdk/scrolling';

declare namespace i1 {
  export { TakTabChangeEvent, TakTabHeaderPosition, _TakTabGroupBase, TakTabGroup };
}

declare namespace i2 {
  export { TAK_TAB_LABEL, TAK_TAB, TakTabLabel };
}

declare namespace i3 {
  export { TAK_TAB_GROUP, TakTab };
}

declare namespace i4 {
  export {
    _TAK_INK_BAR_POSITIONER_FACTORY,
    _TakInkBarPositioner,
    _TAK_INK_BAR_POSITIONER,
    TakInkBar,
  };
}

declare namespace i5 {
  export { TakTabLabelWrapper };
}

declare namespace i6 {
  export { _TakTabNavBase, TakTabNav, _TakTabLinkBase, TakTabLink, TakTabNavPanel };
}

declare namespace i7 {
  export {
    TakTabBodyPositionState,
    TakTabBodyOriginState,
    TakTabBodyPortal,
    _TakTabBodyBase,
    TakTabBody,
  };
}

declare namespace i8 {
  export { _TakTabHeaderBase, TakTabHeader };
}

declare namespace i9 {
  export { TAK_TAB_CONTENT, TakTabContent };
}

/** Injection token for the TakInkBar's Positioner. */
export declare const _TAK_INK_BAR_POSITIONER: InjectionToken<_TakInkBarPositioner>;

/**
 * The default positioner function for the TakInkBar.
 * @docs-private
 */
declare function _TAK_INK_BAR_POSITIONER_FACTORY(): _TakInkBarPositioner;

/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export declare const TAK_TAB: InjectionToken<any>;

/**
 * Injection token that can be used to reference instances of `TakTabContent`. It serves as
 * alternative token to the actual `TakTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const TAK_TAB_CONTENT: InjectionToken<TakTabContent>;

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * @docs-private
 */
export declare const TAK_TAB_GROUP: InjectionToken<any>;

/**
 * Injection token that can be used to reference instances of `TakTabLabel`. It serves as
 * alternative token to the actual `TakTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
declare const TAK_TAB_LABEL: InjectionToken<TakTabLabel>;

/** Injection token that can be used to provide the default options the tabs module. */
export declare const TAK_TABS_CONFIG: InjectionToken<TakTabsConfig>;

/**
 * The ink-bar is used to display and animate the line underneath the current active tab label.
 * @docs-private
 */
export declare class TakInkBar {
  private _elementRef;
  private _ngZone;
  private _inkBarPositioner;
  _animationMode?: string | undefined;
  constructor(
    _elementRef: ElementRef<HTMLElement>,
    _ngZone: NgZone,
    _inkBarPositioner: _TakInkBarPositioner,
    _animationMode?: string | undefined
  );
  /**
   * Calculates the styles from the provided element in order to align the ink-bar to that element.
   * Shows the ink bar if previously set as hidden.
   * @param element
   */
  alignToElement(element: HTMLElement): void;
  /** Shows the ink bar. */
  show(): void;
  /** Hides the ink bar. */
  hide(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<TakInkBar, [null, null, null, { optional: true }]>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakInkBar,
    'tak-ink-bar',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}

/**
 * Interface for a a TakInkBar positioner method, defining the positioning and width of the ink
 * bar in a set of tabs.
 */
export declare interface _TakInkBarPositioner {
  (element: HTMLElement): {
    left: string;
    width: string;
  };
}

/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
declare abstract class TakPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  protected _elementRef: ElementRef<HTMLElement>;
  protected _changeDetectorRef: ChangeDetectorRef;
  private _viewportRuler;
  private _dir;
  private _ngZone;
  private _platform;
  _animationMode?: string | undefined;
  abstract _items: QueryList<TakPaginatedTabHeaderItem>;
  abstract _inkBar: {
    hide: () => void;
    alignToElement: (element: HTMLElement) => void;
  };
  abstract _tabListContainer: ElementRef<HTMLElement>;
  abstract _tabList: ElementRef<HTMLElement>;
  abstract _tabListInner: ElementRef<HTMLElement>;
  abstract _nextPaginator: ElementRef<HTMLElement>;
  abstract _previousPaginator: ElementRef<HTMLElement>;
  /** The distance in pixels that the tab labels should be translated to the left. */
  private _scrollDistance;
  /** Whether the header should scroll to the selected index after the view has been checked. */
  private _selectedIndexChanged;
  /** Emits when the component is destroyed. */
  protected readonly _destroyed: Subject<void>;
  /** Whether the controls for pagination should be displayed */
  _showPaginationControls: boolean;
  /** Whether the tab list can be scrolled more towards the end of the tab label list. */
  _disableScrollAfter: boolean;
  /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
  _disableScrollBefore: boolean;
  /**
   * The number of tab labels that are displayed on the header. When this changes, the header
   * should re-evaluate the scroll position.
   */
  private _tabLabelCount;
  /** Whether the scroll distance has changed and should be applied after the view is checked. */
  private _scrollDistanceChanged;
  /** Used to manage focus between the tabs. */
  private _keyManager;
  /** Cached text content of the header. */
  private _currentTextContent;
  /** Stream that will stop the automated scrolling. */
  private _stopScrolling;
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  get disablePagination(): boolean;
  set disablePagination(value: BooleanInput);
  private _disablePagination;
  /** The index of the active tab. */
  get selectedIndex(): number;
  set selectedIndex(value: NumberInput);
  private _selectedIndex;
  /** Event emitted when the option is selected. */
  readonly selectFocusedIndex: EventEmitter<number>;
  /** Event emitted when a label is focused. */
  readonly indexFocused: EventEmitter<number>;
  constructor(
    _elementRef: ElementRef<HTMLElement>,
    _changeDetectorRef: ChangeDetectorRef,
    _viewportRuler: ViewportRuler,
    _dir: Directionality,
    _ngZone: NgZone,
    _platform: Platform,
    _animationMode?: string | undefined
  );
  /** Called when the user has selected an item via the keyboard. */
  protected abstract _itemSelected(event: KeyboardEvent): void;
  ngAfterViewInit(): void;
  ngAfterContentInit(): void;
  /** Sends any changes that could affect the layout of the items. */
  private _itemsResized;
  ngAfterContentChecked(): void;
  ngOnDestroy(): void;
  /** Handles keyboard events on the header. */
  _handleKeydown(event: KeyboardEvent): void;
  /**
   * Callback for when the MutationObserver detects that the content has changed.
   */
  _onContentChanges(): void;
  /**
   * Updates the view whether pagination should be enabled or not.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination(): void;
  /** Tracks which element has focus; used for keyboard navigation */
  get focusIndex(): number;
  /** When the focus index is set, we must manually send focus to the correct label */
  set focusIndex(value: number);
  /**
   * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
   * providing a valid index and return true.
   */
  _isValidIndex(index: number): boolean;
  /**
   * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
   * scrolling is enabled.
   */
  _setTabFocus(tabIndex: number): void;
  /** The layout direction of the containing app. */
  _getLayoutDirection(): Direction;
  /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
  _updateTabScrollPosition(): void;
  /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
  get scrollDistance(): number;
  set scrollDistance(value: number);
  /**
   * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
   * the end of the list, respectively). The distance to scroll is computed to be a third of the
   * length of the tab list view window.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollHeader(direction: ScrollDirection): {
    maxScrollDistance: number;
    distance: number;
  };
  /** Handles click events on the pagination arrows. */
  _handlePaginatorClick(direction: ScrollDirection): void;
  /**
   * Moves the tab list such that the desired tab label (marked by index) is moved into view.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollToLabel(labelIndex: number): void;
  /**
   * Evaluate whether the pagination controls should be displayed. If the scroll width of the
   * tab list is wider than the size of the header container, then the pagination controls should
   * be shown.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkPaginationEnabled(): void;
  /**
   * Evaluate whether the before and after controls should be enabled or disabled.
   * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
   * before button. If the header is at the end of the list (scroll distance is equal to the
   * maximum distance we can scroll), then disable the after button.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkScrollingControls(): void;
  /**
   * Determines what is the maximum length in pixels that can be set for the scroll distance. This
   * is equal to the difference in width between the tab list container and tab header container.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _getMaxScrollDistance(): number;
  /** Tells the ink-bar to align itself to the current label wrapper */
  _alignInkBarToSelectedTab(): void;
  /** Stops the currently-running paginator interval.  */
  _stopInterval(): void;
  /**
   * Handles the user pressing down on one of the paginators.
   * Starts scrolling the header after a certain amount of time.
   * @param direction In which direction the paginator should be scrolled.
   */
  _handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent): void;
  /**
   * Scrolls the header to a given position.
   * @param position Position to which to scroll.
   * @returns Information on the current scroll distance and the maximum.
   */
  private _scrollTo;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    TakPaginatedTabHeader,
    [null, null, null, { optional: true }, null, null, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakPaginatedTabHeader,
    never,
    never,
    { disablePagination: 'disablePagination' },
    {},
    never,
    never,
    false
  >;
}

/** Item inside a paginated tab header. */
declare type TakPaginatedTabHeaderItem = FocusableOption & {
  elementRef: ElementRef;
};

export declare class TakTab
  extends _TakTabBase
  implements OnInit, CanDisable, OnChanges, OnDestroy
{
  private _viewContainerRef;
  _closestTabGroup: any;
  /** Content for the tab label given by `<ng-template tak-tab-label>`. */
  get templateLabel(): TakTabLabel;
  set templateLabel(value: TakTabLabel);
  protected _templateLabel: TakTabLabel;
  /**
   * Template provided in the tab content that will be used if present, used to enable lazy-loading
   */
  _explicitContent: TemplateRef<any>;
  /** Template inside the TakTab view that contains an `<ng-content>`. */
  _implicitContent: TemplateRef<any>;
  /** Plain text label for the tab, used when there is no template label. */
  textLabel: string;
  /** Aria label for the tab. */
  ariaLabel: string;
  /**
   * Reference to the element that the tab is labelled by.
   * Will be cleared if `aria-label` is set at the same time.
   */
  ariaLabelledby: string;
  /**
   * Classes to be passed to the tab label inside the tak-tab-header container.
   * Supports string and string array values, same as `ngClass`.
   */
  labelClass: string | string[];
  /**
   * Classes to be passed to the tab tak-tab-body container.
   * Supports string and string array values, same as `ngClass`.
   */
  bodyClass: string | string[];
  /** Portal that will be the hosted content of the tab */
  private _contentPortal;
  /** @docs-private */
  get content(): TemplatePortal | null;
  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges: Subject<void>;
  /**
   * The relatively indexed position where 0 represents the center, negative is left, and positive
   * represents the right.
   */
  position: number | null;
  /**
   * The initial relatively index origin of the tab if it was created and selected after there
   * was already a selected tab. Provides context of what position the tab should originate from.
   */
  origin: number | null;
  /**
   * Whether the tab is currently active.
   */
  isActive: boolean;
  constructor(_viewContainerRef: ViewContainerRef, _closestTabGroup: any);
  ngOnChanges(changes: SimpleChanges): void;
  ngOnDestroy(): void;
  ngOnInit(): void;
  /**
   * This has been extracted to a util because of TS 4 and VE.
   * View Engine doesn't support property rename inheritance.
   * TS 4.0 doesn't allow properties to override accessors or vice-versa.
   * @docs-private
   */
  protected _setTemplateLabelInput(value: TakTabLabel | undefined): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTab, [null, { optional: true }]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTab,
    'tak-tab',
    ['takTab'],
    {
      disabled: 'disabled';
      textLabel: 'label';
      ariaLabel: 'aria-label';
      ariaLabelledby: 'aria-labelledby';
      labelClass: 'labelClass';
      bodyClass: 'bodyClass';
    },
    {},
    ['templateLabel', '_explicitContent'],
    ['*'],
    false
  >;
}

/** @docs-private */
declare const _TakTabBase: _Constructor<CanDisable> &
  _AbstractConstructor<CanDisable> & {
    new (): {};
  };

/**
 * Wrapper for the contents of a tab.
 * @docs-private
 */
export declare class TakTabBody extends _TakTabBodyBase {
  _portalHost: CdkPortalOutlet;
  constructor(
    elementRef: ElementRef<HTMLElement>,
    dir: Directionality,
    changeDetectorRef: ChangeDetectorRef
  );
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabBody, [null, { optional: true }, null]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTabBody,
    'tak-tab-body',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}

/**
 * Base class with all of the `TakTabBody` functionality.
 * @docs-private
 */
export declare abstract class _TakTabBodyBase implements OnInit, OnDestroy {
  private _elementRef;
  private _dir;
  /** Current position of the tab-body in the tab-group. Zero means that the tab is visible. */
  private _positionIndex;
  /** Subscription to the directionality change observable. */
  private _dirChangeSubscription;
  /** Tab body position state. Used by the animation trigger for the current state. */
  _position: TakTabBodyPositionState;
  /** Emits when an animation on the tab is complete. */
  readonly _translateTabComplete: Subject<AnimationEvent_2>;
  /** Event emitted when the tab begins to animate towards the center as the active tab. */
  readonly _onCentering: EventEmitter<number>;
  /** Event emitted before the centering of the tab begins. */
  readonly _beforeCentering: EventEmitter<boolean>;
  /** Event emitted before the centering of the tab begins. */
  readonly _afterLeavingCenter: EventEmitter<void>;
  /** Event emitted when the tab completes its animation towards the center. */
  readonly _onCentered: EventEmitter<void>;
  /** The portal host inside of this container into which the tab body content will be loaded. */
  abstract _portalHost: CdkPortalOutlet;
  /** The tab body content to display. */
  _content: TemplatePortal;
  /** Position that will be used when the tab is immediately becoming visible after creation. */
  origin: number | null;
  /** Duration for the tab's animation. */
  animationDuration: string;
  /** Whether the tab's content should be kept in the DOM while it's off-screen. */
  preserveContent: boolean;
  /** The shifted index position of the tab body, where zero represents the active center tab. */
  set position(position: number);
  constructor(
    _elementRef: ElementRef<HTMLElement>,
    _dir: Directionality,
    changeDetectorRef: ChangeDetectorRef
  );
  /**
   * After initialized, check if the content is centered and has an origin. If so, set the
   * special position states that transition the tab from the left or right before centering.
   */
  ngOnInit(): void;
  ngOnDestroy(): void;
  _onTranslateTabStarted(event: AnimationEvent_2): void;
  /** The text direction of the containing app. */
  _getLayoutDirection(): Direction;
  /** Whether the provided position state is considered center, regardless of origin. */
  _isCenterPosition(position: TakTabBodyPositionState | string): boolean;
  /** Computes the position state that will be used for the tab-body animation trigger. */
  private _computePositionAnimationState;
  /**
   * Computes the position state based on the specified origin position. This is used if the
   * tab is becoming visible immediately after creation.
   */
  private _computePositionFromOrigin;
  static ɵfac: i0.ɵɵFactoryDeclaration<_TakTabBodyBase, [null, { optional: true }, null]>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    _TakTabBodyBase,
    never,
    never,
    {
      _content: 'content';
      origin: 'origin';
      animationDuration: 'animationDuration';
      preserveContent: 'preserveContent';
      position: 'position';
    },
    {
      _onCentering: '_onCentering';
      _beforeCentering: '_beforeCentering';
      _afterLeavingCenter: '_afterLeavingCenter';
      _onCentered: '_onCentered';
    },
    never,
    never,
    false
  >;
}

/**
 * The origin state is an internally used state that is set on a new tab body indicating if it
 * began to the left or right of the prior selected index. For example, if the selected index was
 * set to 1, and a new tab is created and selected at index 2, then the tab body would have an
 * origin of right because its index was greater than the prior selected index.
 */
export declare type TakTabBodyOriginState = 'left' | 'right';

/**
 * The portal host directive for the contents of the tab.
 * @docs-private
 */
export declare class TakTabBodyPortal extends CdkPortalOutlet implements OnInit, OnDestroy {
  private _host;
  /** Subscription to events for when the tab body begins centering. */
  private _centeringSub;
  /** Subscription to events for when the tab body finishes leaving from center position. */
  private _leavingSub;
  constructor(
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    _host: TakTabBody,
    _document: any
  );
  /** Set initial visibility or set up subscription for changing visibility. */
  ngOnInit(): void;
  /** Clean up centering subscription. */
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabBodyPortal, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakTabBodyPortal,
    '[takTabBodyHost]',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}

/**
 * These position states are used internally as animation states for the tab body. Setting the
 * position state to left, right, or center will transition the tab body from its current
 * position to its respective state. If there is not current position (void, in the case of a new
 * tab body), then there will be no transition animation to its state.
 *
 * In the case of a new tab body that should immediately be centered with an animating transition,
 * then left-origin-center or right-origin-center can be used, which will use left or right as its
 * pseudo-prior state.
 */
export declare type TakTabBodyPositionState =
  | 'left'
  | 'center'
  | 'right'
  | 'left-origin-center'
  | 'right-origin-center';

/** A simple change event emitted on focus or selection changes. */
export declare class TakTabChangeEvent {
  /** Index of the currently-selected tab. */
  index: number;
  /** Reference to the currently-selected tab. */
  tab: TakTab;
}

/** Decorates the `ng-template` tags and reads out the template from it. */
export declare class TakTabContent {
  template: TemplateRef<any>;
  constructor(/** Content for the tab. */ template: TemplateRef<any>);
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabContent, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakTabContent,
    '[takTabContent]',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}

/**
 * Material design tab-group component. Supports basic tab pairs (label + content) and includes
 * animated ink-bar, keyboard navigation, and screen reader.
 * See: https://material.io/design/components/tabs.html
 */
export declare class TakTabGroup extends _TakTabGroupBase {
  _allTabs: QueryList<TakTab>;
  _tabBodyWrapper: ElementRef;
  _tabHeader: TakTabGroupBaseHeader;
  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    defaultConfig?: TakTabsConfig,
    animationMode?: string
  );
  static ɵfac: i0.ɵɵFactoryDeclaration<
    TakTabGroup,
    [null, null, { optional: true }, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTabGroup,
    'tak-tab-group',
    ['takTabGroup'],
    { color: 'color'; disableRipple: 'disableRipple' },
    {},
    ['_allTabs'],
    never,
    false
  >;
}

/**
 * Base class with all of the `TakTabGroupBase` functionality.
 * @docs-private
 */
export declare abstract class _TakTabGroupBase
  extends _TakTabGroupMixinBase
  implements AfterContentInit, AfterContentChecked, OnDestroy, CanColor, CanDisableRipple
{
  protected _changeDetectorRef: ChangeDetectorRef;
  _animationMode?: string | undefined;
  /**
   * All tabs inside the tab group. This includes tabs that belong to groups that are nested
   * inside the current one. We filter out only the tabs that belong to this group in `_tabs`.
   */
  abstract _allTabs: QueryList<TakTab>;
  abstract _tabBodyWrapper: ElementRef;
  abstract _tabHeader: TakTabGroupBaseHeader;
  /** All of the tabs that belong to the group. */
  _tabs: QueryList<TakTab>;
  /** The tab index that should be selected after the content has been checked. */
  private _indexToSelect;
  /** Index of the tab that was focused last. */
  private _lastFocusedTabIndex;
  /** Snapshot of the height of the tab body wrapper before another tab is activated. */
  private _tabBodyWrapperHeight;
  /** Subscription to tabs being added/removed. */
  private _tabsSubscription;
  /** Subscription to changes in the tab labels. */
  private _tabLabelSubscription;
  /** Whether the tab group should grow to the size of the active tab. */
  get dynamicHeight(): boolean;
  set dynamicHeight(value: BooleanInput);
  private _dynamicHeight;
  /** The index of the active tab. */
  get selectedIndex(): number | null;
  set selectedIndex(value: NumberInput);
  private _selectedIndex;
  /** Position of the tab header. */
  headerPosition: TakTabHeaderPosition;
  /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
  get animationDuration(): string;
  set animationDuration(value: NumberInput);
  private _animationDuration;
  /**
   * `tabindex` to be set on the inner element that wraps the tab content. Can be used for improved
   * accessibility when the tab does not have focusable elements or if it has scrollable content.
   * The `tabindex` will be removed automatically for inactive tabs.
   * Read more at https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-2/tabs.html
   */
  get contentTabIndex(): number | null;
  set contentTabIndex(value: NumberInput);
  private _contentTabIndex;
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  get disablePagination(): boolean;
  set disablePagination(value: BooleanInput);
  private _disablePagination;
  /**
   * By default tabs remove their content from the DOM while it's off-screen.
   * Setting this to `true` will keep it in the DOM which will prevent elements
   * like iframes and videos from reloading next time it comes back into the view.
   */
  get preserveContent(): boolean;
  set preserveContent(value: BooleanInput);
  private _preserveContent;
  /** Background color of the tab group. */
  get backgroundColor(): ThemePalette;
  set backgroundColor(value: ThemePalette);
  private _backgroundColor;
  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  readonly selectedIndexChange: EventEmitter<number>;
  /** Event emitted when focus has changed within a tab group. */
  readonly focusChange: EventEmitter<TakTabChangeEvent>;
  /** Event emitted when the body animation has completed */
  readonly animationDone: EventEmitter<void>;
  /** Event emitted when the tab selection has changed. */
  readonly selectedTabChange: EventEmitter<TakTabChangeEvent>;
  private _groupId;
  constructor(
    elementRef: ElementRef,
    _changeDetectorRef: ChangeDetectorRef,
    defaultConfig?: TakTabsConfig,
    _animationMode?: string | undefined
  );
  /**
   * After the content is checked, this component knows what tabs have been defined
   * and what the selected index should be. This is where we can know exactly what position
   * each tab should be in according to the new selected index, and additionally we know how
   * a new selected tab should transition in (from the left or right).
   */
  ngAfterContentChecked(): void;
  ngAfterContentInit(): void;
  /** Listens to changes in all of the tabs. */
  private _subscribeToAllTabChanges;
  ngOnDestroy(): void;
  /** Re-aligns the ink bar to the selected tab element. */
  realignInkBar(): void;
  /**
   * Recalculates the tab group's pagination dimensions.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination(): void;
  /**
   * Sets focus to a particular tab.
   * @param index Index of the tab to be focused.
   */
  focusTab(index: number): void;
  _focusChanged(index: number): void;
  private _createChangeEvent;
  /**
   * Subscribes to changes in the tab labels. This is needed, because the @Input for the label is
   * on the TakTab component, whereas the data binding is inside the TakTabGroup. In order for the
   * binding to be updated, we need to subscribe to changes in it and trigger change detection
   * manually.
   */
  private _subscribeToTabLabels;
  /** Clamps the given index to the bounds of 0 and the tabs length. */
  private _clampTabIndex;
  /** Returns a unique id for each tab label element */
  _getTabLabelId(i: number): string;
  /** Returns a unique id for each tab content element */
  _getTabContentId(i: number): string;
  /**
   * Sets the height of the body wrapper to the height of the activating tab if dynamic
   * height property is true.
   */
  _setTabBodyWrapperHeight(tabHeight: number): void;
  /** Removes the height of the tab body wrapper. */
  _removeTabBodyWrapperHeight(): void;
  /** Handle click events, setting new selected index if appropriate. */
  _handleClick(tab: TakTab, tabHeader: TakTabGroupBaseHeader, index: number): void;
  /** Retrieves the tabindex for the tab. */
  _getTabIndex(tab: TakTab, index: number): number | null;
  /** Callback for when the focused state of a tab has changed. */
  _tabFocusChanged(focusOrigin: FocusOrigin, index: number): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    _TakTabGroupBase,
    [null, null, { optional: true }, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    _TakTabGroupBase,
    never,
    never,
    {
      dynamicHeight: 'dynamicHeight';
      selectedIndex: 'selectedIndex';
      headerPosition: 'headerPosition';
      animationDuration: 'animationDuration';
      contentTabIndex: 'contentTabIndex';
      disablePagination: 'disablePagination';
      preserveContent: 'preserveContent';
      backgroundColor: 'backgroundColor';
    },
    {
      selectedIndexChange: 'selectedIndexChange';
      focusChange: 'focusChange';
      animationDone: 'animationDone';
      selectedTabChange: 'selectedTabChange';
    },
    never,
    never,
    false
  >;
}

declare interface TakTabGroupBaseHeader {
  _alignInkBarToSelectedTab(): void;
  updatePagination(): void;
  focusIndex: number;
}

/** @docs-private */
declare const _TakTabGroupMixinBase: _Constructor<CanColor> &
  _AbstractConstructor<CanColor> &
  _Constructor<CanDisableRipple> &
  _AbstractConstructor<CanDisableRipple> & {
    new (_elementRef: ElementRef): {
      _elementRef: ElementRef;
    };
  };

/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
export declare class TakTabHeader extends _TakTabHeaderBase {
  _items: QueryList<TakTabLabelWrapper>;
  _inkBar: TakInkBar;
  _tabListContainer: ElementRef;
  _tabList: ElementRef;
  _tabListInner: ElementRef;
  _nextPaginator: ElementRef<HTMLElement>;
  _previousPaginator: ElementRef<HTMLElement>;
  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    dir: Directionality,
    ngZone: NgZone,
    platform: Platform,
    animationMode?: string
  );
  static ɵfac: i0.ɵɵFactoryDeclaration<
    TakTabHeader,
    [null, null, null, { optional: true }, null, null, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTabHeader,
    'tak-tab-header',
    never,
    { selectedIndex: 'selectedIndex' },
    { selectFocusedIndex: 'selectFocusedIndex'; indexFocused: 'indexFocused' },
    ['_items'],
    ['*'],
    false
  >;
}

/**
 * Base class with all of the `TakTabHeader` functionality.
 * @docs-private
 */
export declare abstract class _TakTabHeaderBase
  extends TakPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  /** Whether the ripple effect is disabled or not. */
  get disableRipple(): boolean;
  set disableRipple(value: BooleanInput);
  private _disableRipple;
  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    dir: Directionality,
    ngZone: NgZone,
    platform: Platform,
    animationMode?: string
  );
  protected _itemSelected(event: KeyboardEvent): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    _TakTabHeaderBase,
    [null, null, null, { optional: true }, null, null, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    _TakTabHeaderBase,
    never,
    never,
    { disableRipple: 'disableRipple' },
    {},
    never,
    never,
    false
  >;
}

/** Possible positions for the tab header. */
export declare type TakTabHeaderPosition = 'above' | 'below';

/** Used to flag tab labels for use with the portal directive */
export declare class TakTabLabel extends CdkPortal {
  _closestTab: any;
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, _closestTab: any);
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabLabel, [null, null, { optional: true }]>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakTabLabel,
    '[tak-tab-label], [takTabLabel]',
    never,
    {},
    {},
    never,
    never,
    false
  >;
}

/**
 * Used in the `tak-tab-group` view to display tab labels.
 * @docs-private
 */
export declare class TakTabLabelWrapper extends _TakTabLabelWrapperBase implements CanDisable {
  elementRef: ElementRef;
  constructor(elementRef: ElementRef);
  /** Sets focus on the wrapper element */
  focus(): void;
  getOffsetLeft(): number;
  getOffsetWidth(): number;
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabLabelWrapper, never>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakTabLabelWrapper,
    '[takTabLabelWrapper]',
    never,
    { disabled: 'disabled' },
    {},
    never,
    never,
    false
  >;
}

/** @docs-private */
declare const _TakTabLabelWrapperBase: _Constructor<CanDisable> &
  _AbstractConstructor<CanDisable> & {
    new (): {};
  };

/**
 * Link inside of a `tak-tab-nav-bar`.
 */
export declare class TakTabLink extends _TakTabLinkBase implements OnDestroy {
  /** Reference to the RippleRenderer for the tab-link. */
  private _tabLinkRipple;
  constructor(
    tabNavBar: TakTabNav,
    elementRef: ElementRef,
    ngZone: NgZone,
    platform: Platform,
    globalRippleOptions: RippleGlobalOptions | null,
    tabIndex: string,
    focusMonitor: FocusMonitor,
    animationMode?: string
  );
  ngOnDestroy(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    TakTabLink,
    [
      null,
      null,
      null,
      null,
      { optional: true },
      { attribute: 'tabindex' },
      null,
      { optional: true },
    ]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    TakTabLink,
    '[tak-tab-link], [takTabLink]',
    ['takTabLink'],
    { disabled: 'disabled'; disableRipple: 'disableRipple'; tabIndex: 'tabIndex' },
    {},
    never,
    never,
    false
  >;
}

/** Base class with all of the `TakTabLink` functionality. */
export declare class _TakTabLinkBase
  extends _TakTabLinkMixinBase
  implements
    AfterViewInit,
    OnDestroy,
    CanDisable,
    CanDisableRipple,
    HasTabIndex,
    RippleTarget,
    FocusableOption
{
  private _tabNavBar;
  /** @docs-private */ elementRef: ElementRef;
  private _focusMonitor;
  /** Whether the tab link is active or not. */
  protected _isActive: boolean;
  /** Whether the link is active. */
  get active(): boolean;
  set active(value: BooleanInput);
  /**
   * Ripple configuration for ripples that are launched on pointer down. The ripple config
   * is set to the global ripple options since we don't have any configurable options for
   * the tab link ripples.
   * @docs-private
   */
  rippleConfig: RippleConfig & RippleGlobalOptions;
  /**
   * Whether ripples are disabled on interaction.
   * @docs-private
   */
  get rippleDisabled(): boolean;
  /** Unique id for the tab. */
  id: string;
  constructor(
    _tabNavBar: _TakTabNavBase,
    /** @docs-private */ elementRef: ElementRef,
    globalRippleOptions: RippleGlobalOptions | null,
    tabIndex: string,
    _focusMonitor: FocusMonitor,
    animationMode?: string
  );
  /** Focuses the tab link. */
  focus(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  _handleFocus(): void;
  _handleKeydown(event: KeyboardEvent): void;
  _getAriaControls(): string | null;
  _getAriaSelected(): string | null;
  _getAriaCurrent(): string | null;
  _getRole(): string | null;
  _getTabIndex(): number;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    _TakTabLinkBase,
    [null, null, { optional: true }, { attribute: 'tabindex' }, null, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    _TakTabLinkBase,
    never,
    never,
    { active: 'active'; id: 'id' },
    {},
    never,
    never,
    false
  >;
}

declare const _TakTabLinkMixinBase: _Constructor<HasTabIndex> &
  _AbstractConstructor<HasTabIndex> &
  _Constructor<CanDisableRipple> &
  _AbstractConstructor<CanDisableRipple> &
  _Constructor<CanDisable> &
  _AbstractConstructor<CanDisable> & {
    new (): {};
  };

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export declare class TakTabNav extends _TakTabNavBase {
  _items: QueryList<TakTabLink>;
  _inkBar: TakInkBar;
  _tabListContainer: ElementRef;
  _tabList: ElementRef;
  _tabListInner: ElementRef;
  _nextPaginator: ElementRef<HTMLElement>;
  _previousPaginator: ElementRef<HTMLElement>;
  constructor(
    elementRef: ElementRef,
    dir: Directionality,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    platform: Platform,
    animationMode?: string
  );
  static ɵfac: i0.ɵɵFactoryDeclaration<
    TakTabNav,
    [null, { optional: true }, null, null, null, null, { optional: true }]
  >;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTabNav,
    '[tak-tab-nav-bar]',
    ['takTabNavBar', 'takTabNav'],
    { color: 'color' },
    {},
    ['_items'],
    ['*'],
    false
  >;
}

/**
 * Base class with all of the `TakTabNav` functionality.
 * @docs-private
 */
export declare abstract class _TakTabNavBase
  extends TakPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, OnDestroy
{
  /** Query list of all tab links of the tab navigation. */
  abstract _items: QueryList<
    TakPaginatedTabHeaderItem & {
      active: boolean;
      id: string;
    }
  >;
  /** Background color of the tab nav. */
  get backgroundColor(): ThemePalette;
  set backgroundColor(value: ThemePalette);
  private _backgroundColor;
  /** Whether the ripple effect is disabled or not. */
  get disableRipple(): boolean;
  set disableRipple(value: BooleanInput);
  private _disableRipple;
  /** Theme color of the nav bar. */
  color: ThemePalette;
  /**
   * Associated tab panel controlled by the nav bar. If not provided, then the nav bar
   * follows the ARIA link / navigation landmark pattern. If provided, it follows the
   * ARIA tabs design pattern.
   */
  tabPanel?: TakTabNavPanel;
  constructor(
    elementRef: ElementRef,
    dir: Directionality,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    platform: Platform,
    animationMode?: string
  );
  protected _itemSelected(): void;
  ngAfterContentInit(): void;
  /** Notifies the component that the active link has been changed. */
  updateActiveLink(): void;
  _getRole(): string | null;
  static ɵfac: i0.ɵɵFactoryDeclaration<
    _TakTabNavBase,
    [null, { optional: true }, null, null, null, null, { optional: true }]
  >;
  static ɵdir: i0.ɵɵDirectiveDeclaration<
    _TakTabNavBase,
    never,
    never,
    {
      backgroundColor: 'backgroundColor';
      disableRipple: 'disableRipple';
      color: 'color';
      tabPanel: 'tabPanel';
    },
    {},
    never,
    never,
    false
  >;
}

/**
 * Tab panel component associated with TakTabNav.
 */
export declare class TakTabNavPanel {
  /** Unique id for the tab panel. */
  id: string;
  /** Id of the active tab in the nav bar. */
  _activeTabId?: string;
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabNavPanel, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    TakTabNavPanel,
    'tak-tab-nav-panel',
    ['takTabNavPanel'],
    { id: 'id' },
    {},
    never,
    ['*'],
    false
  >;
}

/**
 * Animations used by the Material tabs.
 * @docs-private
 */
export declare const takTabsAnimations: {
  readonly translateTab: AnimationTriggerMetadata;
};

/** Object that can be used to configure the default options for the tabs module. */
export declare interface TakTabsConfig {
  /** Duration for the tab animation. Must be a valid CSS value (e.g. 600ms). */
  animationDuration?: string;
  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   */
  disablePagination?: boolean;
  /**
   * Whether the ink bar should fit its width to the size of the tab label content.
   * This only applies to the MDC-based tabs.
   */
  fitInkBarToContent?: boolean;
  /** Whether the tab group should grow to the size of the active tab. */
  dynamicHeight?: boolean;
  /** `tabindex` to be set on the inner element that wraps the tab content. */
  contentTabIndex?: number;
  /**
   * By default tabs remove their content from the DOM while it's off-screen.
   * Setting this to `true` will keep it in the DOM which will prevent elements
   * like iframes and videos from reloading next time it comes back into the view.
   */
  preserveContent?: boolean;
}

export declare class TakTabsModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<TakTabsModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<
    TakTabsModule,
    [
      typeof i1.TakTabGroup,
      typeof i2.TakTabLabel,
      typeof i3.TakTab,
      typeof i4.TakInkBar,
      typeof i5.TakTabLabelWrapper,
      typeof i6.TakTabNav,
      typeof i6.TakTabNavPanel,
      typeof i6.TakTabLink,
      typeof i7.TakTabBody,
      typeof i7.TakTabBodyPortal,
      typeof i8.TakTabHeader,
      typeof i9.TakTabContent,
    ],
    [
      typeof i10.CommonModule,
      typeof i11.TakCommonModule,
      typeof i12.PortalModule,
      typeof i11.TakRippleModule,
      typeof i13.ObserversModule,
      typeof i14.A11yModule,
    ],
    [
      typeof i11.TakCommonModule,
      typeof i1.TakTabGroup,
      typeof i2.TakTabLabel,
      typeof i3.TakTab,
      typeof i6.TakTabNav,
      typeof i6.TakTabNavPanel,
      typeof i6.TakTabLink,
      typeof i9.TakTabContent,
    ]
  >;
  static ɵinj: i0.ɵɵInjectorDeclaration<TakTabsModule>;
}

/**
 * The directions that scrolling can go in when the header's tabs exceed the header width. 'After'
 * will scroll the header towards the end of the tabs list and 'before' will scroll towards the
 * beginning of the list.
 */
export declare type ScrollDirection = 'after' | 'before';

export {};
