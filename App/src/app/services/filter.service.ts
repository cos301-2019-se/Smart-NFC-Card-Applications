import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  headerFilter: string;

  constructor() { }

  /**
   * Function returns the current filter string
   * @return string filter
   */
  public getFilter(): string {
    return this.headerFilter;
  }

  /**
   * Function sets the current filter string
   * @param filter string filter
   */
  public setFilter(filter: string): void {
    this.headerFilter = filter;
  }
}
