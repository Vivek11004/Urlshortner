import string

BASE62 = string.digits + string.ascii_lowercase + string.ascii_uppercase

def encode_base62(num: int) -> str:
    if num == 0:
        return BASE62[0]

    base = len(BASE62)
    res = []
    while num:
        res.append(BASE62[num % base])
        num //= base
    return "".join(reversed(res))