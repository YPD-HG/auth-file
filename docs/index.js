let verdict_div = document.getElementById('verdict')
async function login() {
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    if (username !== '' && password !== '') {
        console.log(JSON.stringify({ username: username, password: password }))
        let verdict = await axios.post('http://localhost:6001/users/login', {
            username: username,
            password: password
        })
        console.log("Verdict :", verdict.data)
        verdict_div.innerHTML = `<h3>${verdict.data}</h3>`
    }
    document.getElementById('username').value = ``
    document.getElementById('password').value = ``
}