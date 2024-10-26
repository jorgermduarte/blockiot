template <typename T>
class Node {
public:
    std::shared_ptr<T> value;
    std::shared_ptr<Node<T>> next;
    std::weak_ptr<Node<T>> prev;  // Usamos weak_ptr para evitar ciclos de referência

    Node(std::shared_ptr<T> value) : value(value), next(nullptr) {}
};

template <typename T>
class LinkedList {
public:
    void Add(std::shared_ptr<T> value) {
        auto newNode = std::make_shared<Node<T>>(value);
        if (!head) {
            head = newNode;
            tail = newNode;
        } else {
            newNode->prev = tail;
            tail->next = newNode;
            tail = newNode;
        }
    }

    std::shared_ptr<T> Get(int index) const {
        auto current = head;
        int i = 0;
        while (current && i < index) {
            current = current->next;
            ++i;
        }
        return current ? current->value : nullptr;
    }

    std::shared_ptr<Node<T>> Head() const { return head; }
    std::shared_ptr<Node<T>> Tail() const { return tail; }

    int Size() const {
        int count = 0;
        auto current = head;
        while (current) {
            ++count;
            current = current->next;
        }
        return count;
    }

private:
    std::shared_ptr<Node<T>> head = nullptr;
    std::shared_ptr<Node<T>> tail = nullptr;  // Mantém o último nó
};
