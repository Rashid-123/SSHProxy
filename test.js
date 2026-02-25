const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbW0xNGQwancwMDAwbXEwMThhZmUxanR4IiwiaWF0IjoxNzcyMDEwMjg5LCJleHAiOjE3NzIwOTY2ODl9.avnZ9kZMoMIDdfNWtVOFiOLbUXroPVFkJ1qhYXoQXXg'; // Your full token
const SERVER_URL = 'http://YOUR_EC2_IP:5000/api/machine/create';

async function testCreate() {
    console.log("🚀 Starting Fetch request to:", SERVER_URL);

    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Your middleware 'authenticateFromCookie' looks for this
                'Cookie': `token=${TOKEN}` 
            },
            body: JSON.stringify({
                name: "EC2-Test-Machine",
                hostname: "127.0.0.1",
                port: 22,
                username: "root",
                privateKey: "---BEGIN RSA---\nFakeKey\n---END RSA---",
                passphrase: "",
                password: "your-db-encryption-password"
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("✅ SUCCESS!");
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log(`❌ FAILED (Status: ${response.status})`);
            console.log("Error Detail:", data);
        }
    } catch (err) {
        console.error("🌐 Network/System Error:", err.message);
    }
}

testCreate();