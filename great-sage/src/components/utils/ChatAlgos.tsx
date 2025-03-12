class ChatNode {
    _id: string;
    chat_id: string;
    node_level: number;
    user_msg: string;
    assistant_msg: string;
    model_used: string;
    creation_date: Date;
    response_time: number;
    active_child_node_index: number = -1;
    children_chat_nodes: ChatNode[] = [];

    constructor(chat_id: string, node_level: number, user_msg: string, assistant_msg: string, model_used: string, creation_date: Date, response_time: number) {
        this._id = chat_id;
        this.chat_id = chat_id;
        this.node_level = node_level;
        this.user_msg = user_msg;
        this.assistant_msg = assistant_msg;
        this.model_used = model_used;
        this.creation_date = creation_date;
        this.response_time = response_time;
    }

    addChildNode = (newNode: ChatNode) => {
        this.children_chat_nodes.push(newNode);
        this.active_child_node_index = this.children_chat_nodes.length - 1;
    };
}

class Chat {
    _id: string;
    user_id: string;
    chat_title: string;
    system_msg: string | null;
    creation_date: Date;
    last_update: Date;
    active_chat_index: number = -1;
    chat_tree_roots: ChatNode[] = [];

    constructor(
        idOrChat: string | Chat,
        user_id?: string,
        chat_title?: string,
        system_msg?: string | null,
        creation_date?: Date,
        last_update?: Date
    ) {
        if (typeof idOrChat === 'string') {
            // Regular constructor
            this._id = idOrChat;
            this.user_id = user_id!;
            this.chat_title = chat_title!;
            this.system_msg = system_msg || null;
            this.creation_date = creation_date!;
            this.last_update = last_update!;
        } else {
            // Copy constructor
            this._id = idOrChat._id;
            this.user_id = idOrChat.user_id;
            this.chat_title = idOrChat.chat_title;
            this.system_msg = idOrChat.system_msg;
            this.creation_date = idOrChat.creation_date;
            this.last_update = idOrChat.last_update;
            this.active_chat_index = idOrChat.active_chat_index;
            this.chat_tree_roots = idOrChat.chat_tree_roots;
        }
    }

    isEmpty = () => {
        return this.chat_tree_roots.length === 0;
    }

    updateSystemMsg = (newSysMsg: string) => {
        this.system_msg = newSysMsg;
    };

    addRootNode = (newNode: ChatNode) => {
        console.log('addRootNode', newNode);
        this.chat_tree_roots.push(newNode);
        this.active_chat_index++;
    };

    addConversation = (newNode: ChatNode) => {
        console.log('addConversation', newNode);
        if (this.isEmpty()) {
            this.addRootNode(newNode);
        }
        else {
            let currNode = this.chat_tree_roots[this.active_chat_index];

            while (currNode !== undefined && currNode !== null) {
                if (currNode._id === newNode._id) {
                    console.warn('Node already exists. Canceling dublicate insertion!');
                    return;
                }

                if (currNode.children_chat_nodes.length > 0) {
                    let nextNode = currNode.children_chat_nodes[currNode.active_child_node_index];
                    currNode = nextNode;
                }
                else {
                    currNode.addChildNode(newNode);
                    break;
                }
            }
        }
        this.last_update = new Date();
    };

    addConversationV2 = (chatNodeId: string, userMsg: string, assistantMsg: string, currentModel: string, resTime: number) => {
        console.log('addConversationV2');
        if (this.isEmpty()) {
            const newChatNode = new ChatNode(
                chatNodeId,
                0,
                userMsg,
                assistantMsg,
                currentModel,
                new Date(),
                resTime
            );
            this.addRootNode(newChatNode);
        }
        else {
            let currNode = this.chat_tree_roots[this.active_chat_index];

            while (currNode !== undefined && currNode !== null) {
                if (currNode._id === chatNodeId) {
                    console.warn('Node already exists. Canceling dublicate insertion!');
                    return;
                }

                if (currNode.children_chat_nodes.length > 0) {
                    let nextNode = currNode.children_chat_nodes[currNode.active_child_node_index];
                    currNode = nextNode;
                }
                else {
                    const newChatNode = new ChatNode(
                        chatNodeId,
                        currNode.node_level + 1,
                        userMsg,
                        assistantMsg,
                        currentModel,
                        new Date(),
                        resTime
                    );
                    currNode.addChildNode(newChatNode);
                    break;
                }
            }
        }
        this.last_update = new Date();
    };

    getChatContext = () => {
        let chatContext: { role: string; content: string }[] = [];
        if (this.isEmpty()) {
            return chatContext;
        }
        let currNode = this.chat_tree_roots[this.active_chat_index];
        while (currNode !== undefined && currNode !== null) {
            chatContext.push({ role: 'user', content: currNode.user_msg });
            chatContext.push({ role: 'assistant', content: currNode.assistant_msg });

            if (currNode.children_chat_nodes.length > 0) {
                let nextNode = currNode.children_chat_nodes[currNode.active_child_node_index];
                currNode = nextNode;
            }
            else {
                break;
            }
        }
        return chatContext;
    };

    traverseActiveConversations = (mapFunc: (node: ChatNode) => any) => {
        let result: any[] = [];

        if (this.active_chat_index === -1 || this.chat_tree_roots.length === 0 || !this.chat_tree_roots[this.active_chat_index]) {
            return result;
        }

        let currNode = this.chat_tree_roots[this.active_chat_index];
        let visitedNodes = new Set<ChatNode>();

        while (currNode) {
            result.push(mapFunc(currNode));
            visitedNodes.add(currNode);

            if (
                currNode.children_chat_nodes.length > 0 &&
                currNode.active_child_node_index >= 0 &&
                currNode.active_child_node_index < currNode.children_chat_nodes.length
            ) {
                let nextNode = currNode.children_chat_nodes[currNode.active_child_node_index];

                // Prevent infinite loops
                if (visitedNodes.has(nextNode)) {
                    console.warn("Loop detected! Breaking out.");
                    break;
                }

                currNode = nextNode;
            } else {
                break;
            }
        }
        return result;
    };
}

enum ChatListSortBy {
    title,
    creation_date,
    last_update,
}

class ChatList {
    chatList: { chat_id: string, chat_title: string, creation_date: Date, last_update: Date }[];
    constructor(chat_list: { chat_id: string, chat_title: string, creation_date: Date, last_update: Date }[]) {
        this.chatList = chat_list;
    }

    getChatList = (filter: ChatListSortBy = ChatListSortBy.last_update, reverse: boolean = false) => {
        let sortedChatList = [...this.chatList].sort((a, b) => {
            if (filter === ChatListSortBy.title) {
                return a.chat_title.localeCompare(b.chat_title);
            }
            else if (filter === ChatListSortBy.creation_date) {
                return a.creation_date.getTime() - b.creation_date.getTime();
            }
            else if (filter === ChatListSortBy.last_update) {
                return a.last_update.getTime() - b.last_update.getTime();
            }
            else {
                return 0;
            }
        });
        if (reverse) {
            sortedChatList.reverse();
        }
        return sortedChatList;
    };
}

export { ChatNode, Chat, ChatList, ChatListSortBy };
