import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

@Injectable()
export class TreeViewSelectionService {
	public selectionObservable: Observable<any | any[]>;
	/**
	 * @todo
	 * Do we need a replay subject? I'm pretty sure we can use a regular subject
	 */
	private selectionSubject = new ReplaySubject<any | any[]>(1);

	constructor() {
		this.selectionObservable = this.selectionSubject.asObservable();
	}

}
