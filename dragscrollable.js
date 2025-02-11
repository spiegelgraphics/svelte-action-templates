// Adapted from https://github.com/vnphanquang/svelte-put/tree/main?tab=MIT-1-ov-file#readme

export const isTouchDevice = (() => {
	const hasTouchstart = 'ontouchstart' in window;
	const maxTouchPoints = navigator['maxTouchPoints' || 'msMaxTouchPoints'];
	const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
	return hasTouchstart && hasCoarsePointer && (maxTouchPoints > 0 && maxTouchPoints < 256);
})();

const resolveConfig = (param = {}) => {
	const {
		cursor = true,
		enabled = true,
		axis = 'x',
		event,
		dragging,
		draggingEnd
	} = param;

	let eventType;
	if (!(event?.match && event.match(/^(pointer|mouse)$/i))) {
		eventType = isTouchDevice ? 'pointer' : 'mouse';
	} else {
		eventType = event;
	}

	return {
		enabled,
		axes: {
			x: axis === 'x' || axis === 'both',
			y: axis === 'y' || axis === 'both'
		},
		events:
			eventType === 'pointer'
				? {
					down: 'pointerdown',
					up: 'pointerup',
					move: 'pointermove',
					leave: 'pointerleave'
				}
				: {
					down: 'mousedown',
					up: 'mouseup',
					move: 'mousemove',
					leave: 'mouseleave'
				},
		cursor,
		dragging: dragging || (() => {}),
		draggingEnd: draggingEnd || (() => {}),
	};
};

export function dragscrollable(node, param = {}) {

	// const eventDragging = 'dragging';
	// const eventDragEnd = 'draggingend';

	let isDown = false;
	let startX;
	let startY;
	let scrollLeft;
	let scrollTop;

	const { enabled, axes, events, cursor, dragging, draggingEnd } = resolveConfig(param);

	// const fireEvent = (name) => {
	// 	const event = new CustomEvent(name, {
	// 		bubbles: true,
	// 		cancelable: true
	// 		// detail: {scrollLeft: node.scrollLeft}
	// 	});
	// 	node.dispatchEvent(event);
	// };

	// const fireDragEvent = () => {
	// 	// fireEvent(eventDragging);
	// 	if(dragging && typeof dragging === 'function') dragging();
	// };

	// const fireDragEndEvent = () => {
	// 	// fireEvent(eventDragEnd);
	// 	if(draggingEnd && typeof draggingEnd === 'function') draggingEnd();
	// };

	function handlePointerDown(e) {
		changeCursor(true);
		isDown = true;
		startX = e.pageX - node.offsetLeft;
		scrollLeft = node.scrollLeft;
		startY = e.pageY - node.offsetTop;
		scrollTop = node.scrollTop;
	}

	function handlePointerUpAndLeave() {
		changeCursor();
		isDown = false;
		node.style.setProperty('scroll-behavior', 'smooth');
		//fireDragEndEvent();
		draggingEnd();
	}

	function handlePointerMove(e) {
		if (!isDown) return;
		e.preventDefault();
		node.style.setProperty('scroll-behavior', 'auto');
		if (axes.x) {
			const x = e.pageX - node.offsetLeft;
			const walkX = x - startX;
			node.scrollLeft = scrollLeft - walkX;
			if (Math.abs(walkX) > 0) dragging(); /*fireDragEvent();*/
		}
		if (axes.y) {
			const y = e.pageY - node.offsetTop;
			const walkY = y - startY;
			node.scrollTop = scrollTop - walkY;
			if (Math.abs(walkY) > 0) dragging(); /*fireDragEvent();*/
		}
	}

	function addEvents() {
		if (!node) return;
		node.addEventListener(events.down, handlePointerDown);
		node.addEventListener(events.leave, handlePointerUpAndLeave);
		node.addEventListener(events.up, handlePointerUpAndLeave);
		node.addEventListener(events.move, handlePointerMove);
	}

	function removeEvents() {
		if (!node) return;
		node.removeEventListener(events.down, handlePointerDown);
		node.removeEventListener(events.leave, handlePointerUpAndLeave);
		node.removeEventListener(events.up, handlePointerUpAndLeave);
		node.removeEventListener(events.move, handlePointerMove);
	}

	function changeCursor(active = false) {
		if (!node) return;
		if (cursor) {
			node.style.cursor = active ? 'grabbing' : 'grab';
		} else {
			node.style.removeProperty('cursor');
		}
	}

	if (enabled) {
		changeCursor();
		addEvents();
	}

	return {
		update(update = {}) {
			removeEvents();
			({ enabled, axes, events, cursor } = resolveConfig(update));
			changeCursor();
			addEvents();
		},
		destroy() {
			removeEvents();
		}
	};
}
