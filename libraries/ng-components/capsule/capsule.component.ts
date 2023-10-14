import { Component, Input, ViewEncapsulation } from '@angular/core';

export type TakPredefinedGrid = 'small' | 'medium' | 'big' | undefined;

@Component({
  selector: 'tak-capsule',
  templateUrl: './capsule.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TakCapsule {
  @Input() predefinedGrid: TakPredefinedGrid;
  @Input() grids!: number[];

  private _gridsOnSides = '';
  private _gridPrincipal = '';

  public ngOnInit(): void {
    const gridsGenerated = this._generateGridsFromArray(this.grids, this.predefinedGrid);
    this._gridsOnSides = gridsGenerated.onSides;
    this._gridPrincipal = gridsGenerated.principal;
  }

  get gridsOnSides() {
    return this._gridsOnSides;
  }

  get gridPrincipal() {
    return this._gridPrincipal;
  }

  private _generateGridsFromArray = (grids?: number[], predefinedGrid?: TakPredefinedGrid) => {
    let onSides = '',
      principal = '',
      counter = 0,
      customizedGrids = [0];

    if (predefinedGrid) {
      if (predefinedGrid === 'small') customizedGrids = [12, 10, 8, 6, 4];
      if (predefinedGrid === 'medium') customizedGrids = [12, 10, 8, 6, 4];
      if (predefinedGrid === 'big') customizedGrids = [12, 12, 10, 10, 8, 6];
    } else customizedGrids = grids || [12, 12, 10, 8, 6, 4];

    customizedGrids.map(r => {
      if (r % 2) r++;

      if (r >= 1 && r <= 12) {
        if (counter === 0) {
          onSides = `col-t-${(12 - r) / 2}`;
          principal = `col-t-${r}`;
        }
        if (counter === 1) {
          onSides = `${onSides} col-t-sm-${(12 - r) / 2}`;
          principal = `${principal} col-t-sm-${r}`;
        }
        if (counter === 2) {
          onSides = `${onSides} col-t-md-${(12 - r) / 2}`;
          principal = `${principal} col-t-md-${r}`;
        }
        if (counter === 3) {
          onSides = `${onSides} col-t-lg-${(12 - r) / 2}`;
          principal = `${principal} col-t-lg-${r}`;
        }
        if (counter === 4) {
          onSides = `${onSides} col-t-xl-${(12 - r) / 2}`;
          principal = `${principal} col-t-xl-${r}`;
        }
        if (counter === 5) {
          onSides = `${onSides} col-t-xxl-${(12 - r) / 2}`;
          principal = `${principal} col-t-xxl-${r}`;
        }
      }
      counter++;
    });

    return {
      onSides,
      principal,
    };
  };
}
