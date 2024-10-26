class Node<T> {
    value: T;
    next: Node<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

export class LinkedList<T> {
    private head: Node<T> | null = null;

    public Add(value: T): void {
        const newNode = new Node(value);
        if (this.head === null) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    public Remove(value: T): void {
        if (this.head === null) return;

        if (this.head.value === value) {
            this.head = this.head.next;
            return;
        }

        let current = this.head;
        while (current.next !== null && current.next.value !== value) {
            current = current.next;
        }

        if (current.next !== null) {
            current.next = current.next.next;
        }
    }

    public Get(index: number): Node<T> | null{
	let current = this.head;
	let i = 0;
	while( current != null){
		if(i == index){
			break;
		}
		i++;
		current = current.next;
	}
	return current;
    }

    public IsEmpty(): boolean {
        return this.head === null;
    }

    public Size(): number {
        let count = 0;
        let current = this.head;
        while (current !== null) {
            count++;
            current = current.next;
        }
        return count;
    }
}

