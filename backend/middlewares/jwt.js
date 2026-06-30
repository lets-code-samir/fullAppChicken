
const jwt =require('jsonwebtoken')

const tokens= jwt.sign(
    {
        id:1,
        role:'admin'
    },
    "MY_SECRET_KEY",
    {
        expiresIn: "1h"
    }
)

console.log(tokens)