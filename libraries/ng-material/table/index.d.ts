import { BehaviorSubject } from 'rxjs';
import { CdkCell } from '@takkion/ng-cdk/table';
import { CdkCellDef } from '@takkion/ng-cdk/table';
import { CdkColumnDef } from '@takkion/ng-cdk/table';
import { CdkFooterCell } from '@takkion/ng-cdk/table';
import { CdkFooterCellDef } from '@takkion/ng-cdk/table';
import { CdkFooterRow } from '@takkion/ng-cdk/table';
import { CdkFooterRowDef } from '@takkion/ng-cdk/table';
import { CdkHeaderCell } from '@takkion/ng-cdk/table';
import { CdkHeaderCellDef } from '@takkion/ng-cdk/table';
import { CdkHeaderRow } from '@takkion/ng-cdk/table';
import { CdkHeaderRowDef } from '@takkion/ng-cdk/table';
import { CdkNoDataRow } from '@takkion/ng-cdk/table';
import { CdkRow } from '@takkion/ng-cdk/table';
import { CdkRowDef } from '@takkion/ng-cdk/table';
import { CdkTable } from '@takkion/ng-cdk/table';
import { CdkTextColumn } from '@takkion/ng-cdk/table';
import { DataSource } from '@takkion/ng-cdk/collections';
import * as i0 from '@angular/core';
import * as i1 from '@takkion/ng-material/core';
import * as i2 from '@takkion/ng-cdk/table';
import { MatPaginator } from '@takkion/ng-material/paginator';
import { MatSort } from '@takkion/ng-material/sort';
import { Subscription } from 'rxjs';

declare namespace i3 {
    export {
        MatRecycleRows,
        MatTable
    }
}

declare namespace i4 {
    export {
        MatCellDef,
        MatHeaderCellDef,
        MatFooterCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatFooterCell,
        MatCell
    }
}

declare namespace i5 {
    export {
        MatHeaderRowDef,
        MatFooterRowDef,
        MatRowDef,
        MatHeaderRow,
        MatFooterRow,
        MatRow,
        MatNoDataRow
    }
}

declare namespace i6 {
    export {
        MatTextColumn
    }
}

/** Cell template container that adds the right classes and role. */
export declare class MatCell extends CdkCell {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCell, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCell, "mat-cell, td[mat-cell]", never, {}, {}, never, never, true, never>;
}

/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
export declare class MatCellDef extends CdkCellDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatCellDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatCellDef, "[matCellDef]", never, {}, {}, never, never, true, never>;
}

/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
export declare class MatColumnDef extends CdkColumnDef {
    /** Unique name for this column. */
    get name(): string;
    set name(name: string);
    /**
     * Add "mat-column-" prefix in addition to "cdk-column-" prefix.
     * In the future, this will only add "mat-column-" and columnCssClassName
     * will change from type string[] to string.
     * @docs-private
     */
    protected _updateColumnCssClassName(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatColumnDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatColumnDef, "[matColumnDef]", never, { "name": { "alias": "matColumnDef"; "required": false; }; }, {}, never, never, true, never>;
}

/** Footer cell template container that adds the right classes and role. */
export declare class MatFooterCell extends CdkFooterCell {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterCell, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFooterCell, "mat-footer-cell, td[mat-footer-cell]", never, {}, {}, never, never, true, never>;
}

/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
export declare class MatFooterCellDef extends CdkFooterCellDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterCellDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFooterCellDef, "[matFooterCellDef]", never, {}, {}, never, never, true, never>;
}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
export declare class MatFooterRow extends CdkFooterRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatFooterRow, "mat-footer-row, tr[mat-footer-row]", ["matFooterRow"], {}, {}, never, never, true, never>;
}

/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
export declare class MatFooterRowDef extends CdkFooterRowDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFooterRowDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatFooterRowDef, "[matFooterRowDef]", never, { "columns": { "alias": "matFooterRowDef"; "required": false; }; "sticky": { "alias": "matFooterRowDefSticky"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_sticky: unknown;
}

/** Header cell template container that adds the right classes and role. */
export declare class MatHeaderCell extends CdkHeaderCell {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderCell, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHeaderCell, "mat-header-cell, th[mat-header-cell]", never, {}, {}, never, never, true, never>;
}

/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
export declare class MatHeaderCellDef extends CdkHeaderCellDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderCellDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHeaderCellDef, "[matHeaderCellDef]", never, {}, {}, never, never, true, never>;
}

/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class MatHeaderRow extends CdkHeaderRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatHeaderRow, "mat-header-row, tr[mat-header-row]", ["matHeaderRow"], {}, {}, never, never, true, never>;
}

/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class MatHeaderRowDef extends CdkHeaderRowDef {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatHeaderRowDef, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatHeaderRowDef, "[matHeaderRowDef]", never, { "columns": { "alias": "matHeaderRowDef"; "required": false; }; "sticky": { "alias": "matHeaderRowDefSticky"; "required": false; }; }, {}, never, never, true, never>;
    static ngAcceptInputType_sticky: unknown;
}

/** Row that can be used to display a message when no data is shown in the table. */
export declare class MatNoDataRow extends CdkNoDataRow {
    _contentClassName: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatNoDataRow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatNoDataRow, "ng-template[matNoDataRow]", never, {}, {}, never, never, true, never>;
}

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
export declare class MatRecycleRows {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRecycleRows, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatRecycleRows, "mat-table[recycleRows], table[mat-table][recycleRows]", never, {}, {}, never, never, true, never>;
}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class MatRow extends CdkRow {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatRow, "mat-row, tr[mat-row]", ["matRow"], {}, {}, never, never, true, never>;
}

/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
export declare class MatRowDef<T> extends CdkRowDef<T> {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatRowDef<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatRowDef<any>, "[matRowDef]", never, { "columns": { "alias": "matRowDefColumns"; "required": false; }; "when": { "alias": "matRowDefWhen"; "required": false; }; }, {}, never, never, true, never>;
}

export declare class MatTable<T> extends CdkTable<T> {
    /** Overrides the sticky CSS class set by the `CdkTable`. */
    protected stickyCssClass: string;
    /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
    protected needsPositionStickyOnElement: boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTable<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTable<any>, "mat-table, table[mat-table]", ["matTable"], {}, {}, never, ["caption", "colgroup, col", "*"], true, never>;
}

/**
 * Data source that accepts a client-side data array and includes native support of filtering,
 * sorting (using MatSort), and pagination (using MatPaginator).
 *
 * Allows for sort customization by overriding sortingDataAccessor, which defines how data
 * properties are accessed. Also allows for filter customization by overriding filterPredicate,
 * which defines how row data is converted to a string for filter matching.
 *
 * **Note:** This class is meant to be a simple data source to help you get started. As such
 * it isn't equipped to handle some more advanced cases like robust i18n support or server-side
 * interactions. If your app needs to support more advanced use cases, consider implementing your
 * own `DataSource`.
 */
export declare class MatTableDataSource<T, P extends MatPaginator = MatPaginator> extends DataSource<T> {
    /** Stream that emits when a new data array is set on the data source. */
    private readonly _data;
    /** Stream emitting render data to the table (depends on ordered data changes). */
    private readonly _renderData;
    /** Stream that emits when a new filter string is set on the data source. */
    private readonly _filter;
    /** Used to react to internal changes of the paginator that are made by the data source itself. */
    private readonly _internalPageChanges;
    /**
     * Subscription to the changes that should trigger an update to the table's rendered rows, such
     * as filtering, sorting, pagination, or base data changes.
     */
    _renderChangesSubscription: Subscription | null;
    /**
     * The filtered set of data that has been matched by the filter string, or all the data if there
     * is no filter. Useful for knowing the set of data the table represents.
     * For example, a 'selectAll()' function would likely want to select the set of filtered data
     * shown to the user rather than all the data.
     */
    filteredData: T[];
    /** Array of data that should be rendered by the table, where each object represents one row. */
    get data(): T[];
    set data(data: T[]);
    /**
     * Filter term that should be used to filter out objects from the data array. To override how
     * data objects match to this filter string, provide a custom function for filterPredicate.
     */
    get filter(): string;
    set filter(filter: string);
    /**
     * Instance of the MatSort directive used by the table to control its sorting. Sort changes
     * emitted by the MatSort will trigger an update to the table's rendered data.
     */
    get sort(): MatSort | null;
    set sort(sort: MatSort | null);
    private _sort;
    /**
     * Instance of the paginator component used by the table to control what page of the data is
     * displayed. Page changes emitted by the paginator will trigger an update to the
     * table's rendered data.
     *
     * Note that the data source uses the paginator's properties to calculate which page of data
     * should be displayed. If the paginator receives its properties as template inputs,
     * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
     * initialized before assigning it to this data source.
     */
    get paginator(): P | null;
    set paginator(paginator: P | null);
    private _paginator;
    /**
     * Data accessor function that is used for accessing data properties for sorting through
     * the default sortData function.
     * This default function assumes that the sort header IDs (which defaults to the column name)
     * matches the data's properties (e.g. column Xyz represents data['Xyz']).
     * May be set to a custom function for different behavior.
     * @param data Data object that is being accessed.
     * @param sortHeaderId The name of the column that represents the data.
     */
    sortingDataAccessor: (data: T, sortHeaderId: string) => string | number;
    /**
     * Gets a sorted copy of the data array based on the state of the MatSort. Called
     * after changes are made to the filtered data or when sort changes are emitted from MatSort.
     * By default, the function retrieves the active sort and its direction and compares data
     * by retrieving data using the sortingDataAccessor. May be overridden for a custom implementation
     * of data ordering.
     * @param data The array of data that should be sorted.
     * @param sort The connected MatSort that holds the current sort state.
     */
    sortData: (data: T[], sort: MatSort) => T[];
    /**
     * Checks if a data object matches the data source's filter string. By default, each data object
     * is converted to a string of its properties and returns true if the filter has
     * at least one occurrence in that string. By default, the filter string has its whitespace
     * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
     * filter matching.
     * @param data Data object used to check against the filter.
     * @param filter Filter string that has been set on the data source.
     * @returns Whether the filter matches against the data
     */
    filterPredicate: (data: T, filter: string) => boolean;
    constructor(initialData?: T[]);
    /**
     * Subscribe to changes that should trigger an update to the table's rendered rows. When the
     * changes occur, process the current state of the filter, sort, and pagination along with
     * the provided base data and send it to the table for rendering.
     */
    _updateChangeSubscription(): void;
    /**
     * Returns a filtered data array where each filter object contains the filter string within
     * the result of the filterPredicate function. If no filter is set, returns the data array
     * as provided.
     */
    _filterData(data: T[]): T[];
    /**
     * Returns a sorted copy of the data if MatSort has a sort applied, otherwise just returns the
     * data array as provided. Uses the default data accessor for data lookup, unless a
     * sortDataAccessor function is defined.
     */
    _orderData(data: T[]): T[];
    /**
     * Returns a paged slice of the provided data array according to the provided paginator's page
     * index and length. If there is no paginator provided, returns the data array as provided.
     */
    _pageData(data: T[]): T[];
    /**
     * Updates the paginator to reflect the length of the filtered data, and makes sure that the page
     * index does not exceed the paginator's last page. Values are changed in a resolved promise to
     * guard against making property changes within a round of change detection.
     */
    _updatePaginator(filteredDataLength: number): void;
    /**
     * Used by the MatTable. Called when it connects to the data source.
     * @docs-private
     */
    connect(): BehaviorSubject<T[]>;
    /**
     * Used by the MatTable. Called when it disconnects from the data source.
     * @docs-private
     */
    disconnect(): void;
}

export declare class MatTableModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTableModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatTableModule, never, [typeof i1.MatCommonModule, typeof i2.CdkTableModule, typeof i3.MatTable, typeof i3.MatRecycleRows, typeof i4.MatHeaderCellDef, typeof i5.MatHeaderRowDef, typeof i4.MatColumnDef, typeof i4.MatCellDef, typeof i5.MatRowDef, typeof i4.MatFooterCellDef, typeof i5.MatFooterRowDef, typeof i4.MatHeaderCell, typeof i4.MatCell, typeof i4.MatFooterCell, typeof i5.MatHeaderRow, typeof i5.MatRow, typeof i5.MatFooterRow, typeof i5.MatNoDataRow, typeof i6.MatTextColumn], [typeof i1.MatCommonModule, typeof i3.MatTable, typeof i3.MatRecycleRows, typeof i4.MatHeaderCellDef, typeof i5.MatHeaderRowDef, typeof i4.MatColumnDef, typeof i4.MatCellDef, typeof i5.MatRowDef, typeof i4.MatFooterCellDef, typeof i5.MatFooterRowDef, typeof i4.MatHeaderCell, typeof i4.MatCell, typeof i4.MatFooterCell, typeof i5.MatHeaderRow, typeof i5.MatRow, typeof i5.MatFooterRow, typeof i5.MatNoDataRow, typeof i6.MatTextColumn]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatTableModule>;
}

/**
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
export declare class MatTextColumn<T> extends CdkTextColumn<T> {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatTextColumn<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatTextColumn<any>, "mat-text-column", never, {}, {}, never, never, true, never>;
}

export { }
