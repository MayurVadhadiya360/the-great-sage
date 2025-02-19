class ChatNode {
    _id: string;
    chat_id: string;
    node_level: number;
    user_msg: string;
    assistant_msg: string;
    model_used: string;
    timestamp: Date;
    response_time: number;
    parent_chat_node_id: string;
    parent_chat_node?: ChatNode;
    active_child_node_index: number = -1;
    children_chat_nodes: {
        chat_node_id: string;
        node: ChatNode;
    }[] = [];

    constructor(chat_id: string, node_level: number, user_msg: string, assistant_msg: string, model_used: string, timestamp: Date, response_time: number, parent_chat_node_id: string = "parent_id") {
        this._id = chat_id;
        this.chat_id = chat_id;
        this.node_level = node_level;
        this.user_msg = user_msg;
        this.assistant_msg = assistant_msg;
        this.model_used = model_used;
        this.timestamp = timestamp;
        this.response_time = response_time;
        this.parent_chat_node_id = parent_chat_node_id;
    }

    addChildNode = (newNode: ChatNode) => {
        this.children_chat_nodes.push({
            chat_node_id: newNode._id,
            node: newNode
        });
        this.active_child_node_index = this.children_chat_nodes.length - 1;
    };
}

class Chat {
    _id: string;
    user_id: string;
    chat_title: string;
    system_msg: string | null;
    creation_time: Date;
    last_activity: Date;
    active_chat_index: number = -1;
    chat_tree_roots: {
        chat_node_id: string,
        node: ChatNode
    }[] = [];

    constructor(
        idOrChat: string | Chat,
        user_id?: string,
        chat_title?: string,
        system_msg?: string | null,
        creation_time?: Date,
        last_activity?: Date
    ) {
        if (typeof idOrChat === 'string') {
            // Regular constructor
            this._id = idOrChat;
            this.user_id = user_id!;
            this.chat_title = chat_title!;
            this.system_msg = system_msg || null;
            this.creation_time = creation_time!;
            this.last_activity = last_activity!;
        } else {
            // Copy constructor
            this._id = idOrChat._id;
            this.user_id = idOrChat.user_id;
            this.chat_title = idOrChat.chat_title;
            this.system_msg = idOrChat.system_msg;
            this.creation_time = idOrChat.creation_time;
            this.last_activity = idOrChat.last_activity;
            this.active_chat_index = idOrChat.active_chat_index;
            this.chat_tree_roots = idOrChat.chat_tree_roots;
        }
    }

    addRootNode = (newNode: ChatNode) => {
        console.log('addRootNode', newNode);
        this.chat_tree_roots.push({ chat_node_id: newNode._id, node: newNode });
        this.active_chat_index = this.chat_tree_roots.length - 1;
    };

    addConversation = (newNode: ChatNode) => {
        console.log('addConversation', newNode);
        if (!this.chat_tree_roots[this.active_chat_index].node) {
            this.addRootNode(newNode);
            return;
        }

        let currNode = this.chat_tree_roots[this.active_chat_index].node;

        while (currNode !== undefined && currNode !== null) {
            if (currNode.children_chat_nodes.length > 0) {
                currNode = currNode.children_chat_nodes[currNode.active_child_node_index].node;
            }
            else {
                currNode.addChildNode(newNode);
                break;
            }
        }
    };

    traverseActiveConversations = (mapFunc: (node: ChatNode) => any) => {
        let result: any[] = [];

        if (this.active_chat_index === -1 || this.chat_tree_roots.length === 0 || !this.chat_tree_roots[this.active_chat_index]?.node) {
            return result;
        }

        let currNode = this.chat_tree_roots[this.active_chat_index].node;

        while (currNode) {
            result.push(mapFunc(currNode));

            if (
                currNode.children_chat_nodes.length > 0 &&
                currNode.active_child_node_index >= 0 &&
                currNode.active_child_node_index < currNode.children_chat_nodes.length
            ) {
                currNode = currNode.children_chat_nodes[currNode.active_child_node_index].node;
            } else {
                break;
            }
        }
        return result;
    };
}

export { ChatNode, Chat };
