"""
Quick script to generate the correct Argon2 password hash for 'password123'
Run this to get the hash that should be in the database
"""

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

password = "password123"
hashed = pwd_context.hash(password)

print(f"Password: {password}")
print(f"Hash: {hashed}")
print()

# Verify it works
is_valid = pwd_context.verify(password, hashed)
print(f"Verification test: {is_valid}")

# Test against the hash in seed data
seed_hash = "$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8"
is_seed_valid = pwd_context.verify(password, seed_hash)
print(f"Seed hash verification: {is_seed_valid}")
