import hashlib
import time

def sha256(data):
    return hashlib.sha256(data.encode()).hexdigest()

def build_merkle_root(transactions):
    if len(transactions) == 0:
        return sha256('0')  
    
    if len(transactions) == 1:
        return sha256(transactions[0])  

    hashed_transactions = [sha256(tx) for tx in transactions]

    while len(hashed_transactions) > 1:
        if len(hashed_transactions) % 2 == 1:
            hashed_transactions.append(hashed_transactions[-1]) 
        hashed_transactions = [sha256(hashed_transactions[i] + hashed_transactions[i + 1])
                               for i in range(0, len(hashed_transactions), 2)]
    
    return hashed_transactions[0] 

class Block:
    def __init__(self, merkle_root, previous_hash, timestamp=None):
        self.merkle_root = merkle_root
        self.previous_hash = previous_hash
        self.timestamp = timestamp or time.time()
        self.block_hash = self.calculate_hash()

    def calculate_hash(self):
        block_data = self.merkle_root + self.previous_hash + str(self.timestamp)
        return sha256(block_data)

    def __str__(self):
        return f"Блок:\n- Корень Меркла: {self.merkle_root}\n- Хеш предыдущего блока: {self.previous_hash}\n- Время: {self.timestamp}\n- Хеш блока: {self.block_hash}"

def validate_block(new_block, previous_block_hash):
    return new_block.previous_hash == previous_block_hash


def add_block_to_blockchain(block, blockchain):
    if len(blockchain) == 0:
        blockchain.append(block)
    else:
        last_block = blockchain[-1]
        if validate_block(block, last_block.block_hash):
            blockchain.append(block)
        else:
            print("Неверный блок. Не может быть добавлен в блокчейн.")

transactions = [
    "From 0x8ee0B8e2...87c7A97Cd To 0xdc76A476...f73153b3E For 10 Blocks (BLK)",
    "From 0x8ee0B8e2...87c7A97Cd To 0xdc76A476...f73153b3E For 10 Blocks (BLK)",
    "From 0x8ee0B8e2...87c7A97Cd To 0xdc76A476...f73153b3E For 10 Blocks (BLK)"
]

merkle_root = build_merkle_root(transactions)
print("Корень Меркла:", merkle_root)

previous_block_hash = sha256("44844906")

new_block = Block(merkle_root=merkle_root, previous_hash=previous_block_hash)
print("\nНовый блок создан:")
print(new_block)

is_valid = validate_block(new_block, previous_block_hash)
print("\nЯвляется ли новый блок валидным?", is_valid)

blockchain = []

add_block_to_blockchain(new_block, blockchain)

print("\nБлокчейн:")
for i, block in enumerate(blockchain):
    print(f"\nБлок {i+1}:\n{block}")
