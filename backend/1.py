from .core.security import get_password_hash


a=get_password_hash('12345678')
print(a)
