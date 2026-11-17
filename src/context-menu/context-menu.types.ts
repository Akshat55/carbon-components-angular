export interface ItemClickEvent {
	label: string;
	info: string;
	value: string;
	event: MouseEvent & KeyboardEvent;
}
