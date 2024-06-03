import { readFileSync } from 'fs'

const oldFile = JSON.parse(readFileSync('old.lock', 'utf8'))
const newFile = JSON.parse(readFileSync('composer.lock', 'utf8'))

let text = '';

for (const p of oldFile.packages) {
    const newP = newFile.packages.find(p2 => p2.name === p.name)
    if (newP && newP.version !== p.version) {
        text += `Package ${p.name} version has been changed from ${p.version} to ${newP.version}\n`
    }
}

for (const p of oldFile.packages) {
    if (!newFile.packages.find(p2 => p2.name === p.name)) {
        text += `Package ${p.name} has been removed\n`
    }
}

for (const p of newFile.packages) {
    if (!oldFile.packages.find(p2 => p2.name === p.name)) {
        text += `Package ${p.name} has been added\n`
    }
}

if (text.length) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    })
}
