import hashlib

class MerkleTree:
    def __init__(self):
        self.leaves = []  
        self.layers = []  

    def add_leaf(self, leaf):
        self.leaves.append(leaf)

    def build_tree(self):
        current_layer = [self.hash_leaf(leaf) for leaf in self.leaves]
        self.layers.append(current_layer)
        while len(current_layer) > 1:
            current_layer = self.hash_pairs(current_layer)
            self.layers.append(current_layer)

    def hash_leaf(self, leaf):
        return hashlib.sha256(leaf.encode()).hexdigest()

    def hash_pairs(self, pairs):
        hashed_pairs = []
        for i in range(0, len(pairs), 2):
            if i + 1 < len(pairs):
                combined = pairs[i] + pairs[i + 1]
                hashed_pairs.append(hashlib.sha256(combined.encode()).hexdigest())
            else:
                hashed_pairs.append(pairs[i]) 
        return hashed_pairs

    def get_root(self):
        if self.layers:
            return self.layers[-1][0]
        return None

def main():
    tree = MerkleTree()
    
    while True:
        data = input()
        if data.lower() == 'exit':
            break
        tree.add_leaf(data)
    
    tree.build_tree()
    root_hash = tree.get_root()
    print(f"\nКорневой хеш дерева Меркла: {root_hash}")

if __name__ == "__main__":
    main()
