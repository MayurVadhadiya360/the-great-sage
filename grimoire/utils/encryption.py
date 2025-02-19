from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64
import os
import hashlib
import hmac

class Encryptor:
    def __init__(self, encryption_key: str | None = None, salt_size: int = 16):
        if not encryption_key: encryption_key = "Naruto,OnePiece,DragonBallSuper"
        # Ensure the key is 16, 24, or 32 bytes long (for AES)
        self.key = encryption_key.ljust(32, "x")[:32].encode('utf-8')
        self.salt_size = salt_size

    def encrypt(self, value: str):
        # Generate a random IV (Initialization Vector)
        iv = get_random_bytes(AES.block_size)
        
        # Create cipher object and encrypt the data
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        encrypted_value = cipher.encrypt(pad(value.encode('utf-8'), AES.block_size))
        
        # Return the IV and encrypted value, both encoded in base64
        return base64.b64encode(iv + encrypted_value).decode('utf-8')

    def decrypt(self, encrypted_value: str):
        # Decode the base64 encoded data
        encrypted_data = base64.b64decode(encrypted_value)
        
        # Extract the IV and encrypted value
        iv = encrypted_data[:AES.block_size]
        encrypted_value = encrypted_data[AES.block_size:]
        
        # Create cipher object and decrypt the data
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        decrypted_value = unpad(cipher.decrypt(encrypted_value), AES.block_size)
        
        return decrypted_value.decode('utf-8')
    
    def encrypt_salted(self, value: str):
        salt = os.urandom(self.salt_size)  # Generate a random salt based on the defined size
        iv = get_random_bytes(AES.block_size)  # Generate a random IV
        
        # Combine the salt with the value
        value_with_salt = salt + value.encode('utf-8')
        
        # Create cipher object and encrypt the data
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        encrypted_value = cipher.encrypt(pad(value_with_salt, AES.block_size))
        
        # Return the IV, salt, and encrypted value, all encoded in base64
        return base64.b64encode(iv + salt + encrypted_value).decode('utf-8')

    def decrypt_salted(self, encrypted_value: str):
        encrypted_data = base64.b64decode(encrypted_value)
        
        # Extract the IV, salt, and encrypted value
        iv = encrypted_data[:AES.block_size]
        salt = encrypted_data[AES.block_size:AES.block_size + self.salt_size]
        encrypted_value = encrypted_data[AES.block_size + self.salt_size:]
        
        # Create cipher object and decrypt the data
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        decrypted_value_with_salt = unpad(cipher.decrypt(encrypted_value), AES.block_size)
        
        # Remove the salt to get the original value
        decrypted_value = decrypted_value_with_salt[self.salt_size:]
        
        return decrypted_value.decode('utf-8')
    
    def hash_value(self, value: str) -> str:
        return hashlib.sha256(value.encode('utf-8')).hexdigest()

    def compare(self, value: str, encrypted_value: str):
        return hmac.compare_digest(self.hash_value(value), self.hash_value(self.decrypt(encrypted_value)))
    
    def compare_salted(self, value: str, encrypted_value: str):
        return hmac.compare_digest(self.hash_value(value), self.hash_value(self.decrypt_salted(encrypted_value)))


class Authenticator(Encryptor):
    def __init__(self, encryption_key: str | None = None, salt_size: int = 16):
        super().__init__(encryption_key, salt_size)
    
    def generate_auth_token(self, auth_value:str):
        return super().encrypt_salted(auth_value)
    
    def validate_auth_token(self, auth_value:str, auth_token:str):
        try:
            return super().compare_salted(auth_value, auth_token)
        except Exception as e:
            return False


# if __name__ == "__main__":
#     # Example usage
#     encryption_key = "your_secret_key"
#     value = "MySecurevalue"

#     encryptor = Encryptor()

#     encrypted = encryptor.encrypt(value)
#     print(f"Encrypted value: {encrypted}")

#     decrypted = encryptor.decrypt(encrypted)
#     print(f"Decrypted value: {decrypted}")

#     encrypted = encryptor.encrypt_salted(value)
#     print(f"Encrypted salted value: {encrypted}")

#     decrypted = encryptor.decrypt_salted(encrypted)
#     print(f"Decrypted salted value: {decrypted}")


#     value = "something2"
#     authenticator = Authenticator()
#     new_auth_token = authenticator.generate_auth_token(value)
#     print(new_auth_token)

#     auth_token = "QinWlotK/E27AL7tJOmDfMUMENAEGed8yrKoS0nZLqZzyGHPLBk5qltiJTWnFS/MXOzVUfnfdHG5PXqYVJxG+A=="
#     result = authenticator.validate_auth_token("MySecurevalue", auth_token)
#     print(result)
