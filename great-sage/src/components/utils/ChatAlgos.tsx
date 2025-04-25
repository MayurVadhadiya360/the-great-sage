class ChatNode {
    _id: string;
    chat_id: string;
    node_level: number;
    user_msg: string;
    assistant_msg: string;
    model_used: string;
    creation_date: Date;
    response_time: number;
    active_child_node_index: number;
    child_chat_nodes: ChatNode[] = [];

    constructor(chat_id: string, node_level: number, user_msg: string, assistant_msg: string, model_used: string, creation_date: Date, response_time: number, active_child_node_index: number = -1) {
        this._id = chat_id;
        this.chat_id = chat_id;
        this.node_level = node_level;
        this.user_msg = user_msg;
        this.assistant_msg = assistant_msg;
        this.model_used = model_used;
        this.creation_date = creation_date;
        this.response_time = response_time;
        this.active_child_node_index = active_child_node_index;
    }

    addChildNode = (newNode: ChatNode, update_active_index: boolean = true) => {
        this.child_chat_nodes.push(newNode);
        if (update_active_index) {
            this.active_child_node_index = this.child_chat_nodes.length - 1;
        }
    };

    setActiveChildNodeIndex = (newIndex: number) => {
        this.active_child_node_index = newIndex;
    };
}

class Chat {
    chat_id: string;
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
            this.chat_id = idOrChat;
            this.user_id = user_id!;
            this.chat_title = chat_title!;
            this.system_msg = system_msg || null;
            this.creation_date = creation_date!;
            this.last_update = last_update!;
        } else {
            // Copy constructor
            this.chat_id = idOrChat.chat_id;
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

    newLastUpdate = (newDateTime: Date) => {
        this.last_update = newDateTime;
    };

    addRootNode = (newNode: ChatNode, update_active_index: boolean = true) => {
        this.chat_tree_roots.push(newNode);
        if (update_active_index) {
            this.active_chat_index++;
        }
    };

    addConversation = (newNode: ChatNode) => {
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

                if (currNode.child_chat_nodes.length > 0) {
                    let nextNode = currNode.child_chat_nodes[currNode.active_child_node_index];
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

    addConversationV2 = (chatNodeId: string, userMsg: string, assistantMsg: string, currentModel: string, resTime: number, creation_date?: Date) => {
        if (this.isEmpty()) {
            const newChatNode = new ChatNode(
                chatNodeId,
                0,
                userMsg,
                assistantMsg,
                currentModel,
                creation_date ? creation_date : new Date(),
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

                if (currNode.child_chat_nodes.length > 0) {
                    let nextNode = currNode.child_chat_nodes[currNode.active_child_node_index];
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
        if (this.system_msg && this.system_msg !== "") {
            chatContext.push({ role: "system", content: this.system_msg });
        }
        if (this.isEmpty()) {
            return chatContext;
        }
        let currNode = this.chat_tree_roots[this.active_chat_index];
        while (currNode !== undefined && currNode !== null) {
            chatContext.push({ role: 'user', content: currNode.user_msg });
            chatContext.push({ role: 'assistant', content: currNode.assistant_msg });

            if (currNode.child_chat_nodes.length > 0) {
                let nextNode = currNode.child_chat_nodes[currNode.active_child_node_index];
                currNode = nextNode;
            }
            else {
                break;
            }
        }
        return chatContext;
    };

    getActiveLeafChatNodeId = () => {
        if (this.isEmpty()) {
            return null;
        }
        let currNode = this.chat_tree_roots[this.active_chat_index];
        while (currNode !== undefined && currNode !== null) {
            if (currNode.child_chat_nodes.length > 0) {
                let nextNode = currNode.child_chat_nodes[currNode.active_child_node_index];
                currNode = nextNode;
            }
            else {
                return currNode._id;
            }
        }
        return null;
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
                currNode.child_chat_nodes.length > 0 &&
                currNode.active_child_node_index >= 0 &&
                currNode.active_child_node_index < currNode.child_chat_nodes.length
            ) {
                let nextNode = currNode.child_chat_nodes[currNode.active_child_node_index];

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

    dfsBuildTreeNodes = (chatNodeId: string, node_level: number, chatTreeNodes: { _id: string, user_id: string, user_msg: string, assistant_msg: string, model_used: string, response_time: number, active_child_node_index: number, child_chat_nodes: string[], creation_date: string }[], visited = new Set<string>()): ChatNode | null => {

        if (visited.has(chatNodeId)) {
            console.warn("Cycle detected while building tree! Skipping node:", chatNodeId);
            return null;
        }
        visited.add(chatNodeId);

        const currentChatNodeData = chatTreeNodes.find((node) => node._id === chatNodeId);
        if (!currentChatNodeData) {
            console.error("Node not found");
            return null;
        }

        const currentChatNode = new ChatNode(currentChatNodeData._id, node_level, currentChatNodeData.user_msg, currentChatNodeData.assistant_msg, currentChatNodeData.model_used, new Date(currentChatNodeData.creation_date), currentChatNodeData.response_time);

        for (const childChatNodesId of currentChatNodeData.child_chat_nodes) {
            const childChatNode = this.dfsBuildTreeNodes(childChatNodesId, currentChatNode.node_level + 1, chatTreeNodes, visited);
            if (childChatNode) {
                currentChatNode.addChildNode(childChatNode, false);
            }
        }
        currentChatNode.setActiveChildNodeIndex(currentChatNodeData.active_child_node_index);

        return currentChatNode;
    };

    buildChatTree = (rootNodeIds: string[], active_chat_index: number, chatTreeNodes: { _id: string, user_id: string, user_msg: string, assistant_msg: string, model_used: string, response_time: number, active_child_node_index: number, child_chat_nodes: string[], creation_date: string }[]) => {

        for (const rootNodeId of rootNodeIds) {
            let rootNodeData = chatTreeNodes.find((node) => node._id === rootNodeId);
            if (!rootNodeData) {
                console.error(`Root node with id ${rootNodeId} not found in chatTreeNodes array`);
            }
            else {
                const rootNode = new ChatNode(rootNodeData._id, 0, rootNodeData.user_msg, rootNodeData.assistant_msg, rootNodeData.model_used, new Date(rootNodeData.creation_date), rootNodeData.response_time);

                for (const childChatNodesId of rootNodeData.child_chat_nodes) {
                    const childChatNode = this.dfsBuildTreeNodes(childChatNodesId, rootNode.node_level + 1, chatTreeNodes);
                    if (childChatNode) {
                        rootNode.addChildNode(childChatNode, false);
                    }
                }
                rootNode.setActiveChildNodeIndex(rootNodeData.active_child_node_index);
                this.addRootNode(rootNode);
            }
        }
        this.active_chat_index = active_chat_index;
    };
}

enum ChatListSortBy {
    title,
    creation_date,
    last_update,
}

class ChatList {
    chatList: { chat_id: string, chat_title: string, creation_date: Date, last_update: Date }[];
    constructor(chat_list: any[] | ChatList) {
        if (chat_list instanceof ChatList) {
            this.chatList = chat_list.chatList.slice();
        }
        else {
            this.chatList = chat_list.map((chat: any) => {
                return {
                    chat_id: chat.chat_id,
                    chat_title: chat.chat_title,
                    creation_date: new Date(chat.creation_date),
                    last_update: new Date(chat.last_update)
                }
            });
        }
    }

    isEmpty = () => {
        return this.chatList.length === 0;
    };

    addChatData = (chat_id: string, chat_title: string, creation_date: Date, last_update: Date) => {
        this.chatList.push({ chat_id, chat_title, creation_date, last_update });
    };

    updateChatTitle = (chat_id: string, chat_title: string) => {
        this.chatList = this.chatList.map(chatData => chatData.chat_id === chat_id ? { ...chatData, chat_title } : chatData);
    };

    deleteChatData = (chat_id: string) => {
        this.chatList = this.chatList.filter(chatData => chatData.chat_id !== chat_id);
    };

    getChatList = (filter: string | null = null, sort_by: ChatListSortBy = ChatListSortBy.last_update, reverse: boolean = false) => {
        let filteredChatList = this.chatList;
        if (filter) {
            filteredChatList = this.chatList.filter(chat => chat.chat_title.toLowerCase().includes(filter.toLowerCase()));
        }
        let sortedChatList = [...filteredChatList].sort((a, b) => {
            if (sort_by === ChatListSortBy.title) {
                return a.chat_title.localeCompare(b.chat_title);
            }
            else if (sort_by === ChatListSortBy.creation_date) {
                return a.creation_date.getTime() - b.creation_date.getTime();
            }
            else if (sort_by === ChatListSortBy.last_update) {
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
