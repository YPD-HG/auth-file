const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()
const bcrypt = require('bcrypt')

const port = 6001;

app.use(express.json())
app.use(cors())

app.get('/users', async (req, res) => {
    console.log("users :", users)
    res.json(users)
})

// Loginning the user
app.post('/users/login', async (req, res) => {
    let user_entry = null;
    let user = null;

    let file_content = fs.readFileSync('server.json', 'utf-8')

    let parsed_file = JSON.parse(file_content)
    if (!file_content.trim()) {
        user_entry = null;
    } else {
        user_entry = parsed_file.find(element => element.username == req.body.username)
        // if we are in this else implued, that we can either have undefined or a value an json obj.

        // if undefined, implies that the username is not in the file hence, user can create one with that usermame. so we will proceed with the creating account for him.

        // if null, implied this is the first user, and we will create account for him.
    }


    if (user_entry === null || user_entry === undefined) {
        try {
            console.log(" ****** Creating Account ... *******")
            // const salt = await bcrypt.genSalt(), No need for this step, directly use on hash

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            user = { username: req.body.username, password: hashedPassword }
            // users.push(user)

            // vomiting all file content on array.

            if (file_content.trim()) {
                let data = JSON.parse(file_content);
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    users.push(element)
                }
                // The content of file will be json string so we will parse it into JSON obj.
                // Then we will vomit the entire file content onto the users array.
            }

            // push new entry on array
            users.push(user) // Then we will push the current user data as well

            // stringify array content and put back in file

            fs.writeFileSync('server.json', JSON.stringify(users))
            let content = fs.readFileSync('server.json', 'utf-8')
            res.status(201).send('Account created!')
        } catch (error) {
            console.error(error);
            res.status(500).send()
        }
    } else {
        try {
            if (await bcrypt.compare(req.body.password, user_entry.password)) {
                res.send('Yeah, get in !')
            } else {
                res.send('Old guy? Wrong password boy!, New guy? Username taken, choose another')
            }
        } catch {
            res.status(500).send()
        }
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// This basically saves the new user data, and stores the credentials after encryption.

// app.post('/users', async (req, res) => {
//     try {
//         // const salt = await bcrypt.genSalt() Now need for this step, directly use on hash

//         console.log("req.body", req.body)
//         console.log("req.body.username", req.body.username)
//         console.log("req.body.password", req.body.password)

//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         console.log("hashPassword :", hashedPassword)
//         const user = {username: req.body.username, password: hashedPassword}
//         console.log("user :", user)
//         users.push(user)
//         res.status(201).send()
//     }catch{
//         console.log("in Catch")
//         res.status(500).send()
//     }
// })

