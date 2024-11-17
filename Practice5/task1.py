import hashlib
import time

block_data = "0xd1fd225a1cbbe922044433220890f30b9201cac61b679c3746483a402f4c13d7"

def mine_block(data, difficulty):
    nonce = 0
    prefix = '0' * difficulty
    while True:
        hash_result = hashlib.sha256((data + str(nonce)).encode()).hexdigest()
        if hash_result.startswith(prefix):
            return nonce, hash_result
        nonce += 1

start_time = time.time()

nonce, hash_result = mine_block(block_data, 5)

end_time = time.time()
time_taken = end_time - start_time

print(nonce)
print(hash_result)
print(time_taken)