import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  searchControl: FormControl = new FormControl();

  index = this.searchService.index.item;
  searchResult: {
    nbHits: number;
    hits: any[];
  };
  searchOptions = {
    page: 0,
    hitsPerPage: 20,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const searchQuery: string = params.get('q');
      this.searchControl.patchValue(searchQuery, {
        emitEvent: false,
      });
    });
  }

  routeSearch(q: string) {
    this.router.navigate(['/search'], {
      queryParamsHandling: 'merge',
      queryParams: { q },
    });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''))
      .subscribe((keyword) => {
        const searchKeyword: string = keyword;
        this.index.search(searchKeyword)
          .then((searchResult) => this.searchResult = searchResult);
      });
  }
}
