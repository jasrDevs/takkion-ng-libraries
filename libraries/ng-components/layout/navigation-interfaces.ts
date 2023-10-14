export type TakSnavIconsType = 'material-icon' | 'img';
export type TakSnavItemType = 'link' | 'collection' | 'dropdown';

export interface TakSnavItems {
  type: TakSnavItemType;
  icon?: string;
  name: string;
  url?: string;
  urlIsNotAutoCompleted?: boolean;
  dropdownLinks?: TakSnavDropdownLink[];
  objects?: TakSnavItems[];
  authorities?: string[];
  disableOnContexts?: string[];
  showCollectionContent?: boolean;
  forceDisabledContent?: boolean;
  disabledOnMobile?: boolean;
  disabledOnWeb?: boolean;
  isOpened?: boolean;
}

export interface TakSnavDropdownLink {
  name: string;
  url: string;
  urlIsNotAutoCompleted?: boolean;
  authorities?: string[];
  disableOnContexts?: string[];
  forceDisabledContent?: boolean;
  disabledOnMobile?: boolean;
  disabledOnWeb?: boolean;
}

export interface TakSnav {
  typeSnavIcons: TakSnavIconsType;
  items: TakSnavItems[];
}
