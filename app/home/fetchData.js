'use client'

import { headers } from 'next/headers'

async function fetchData() {
    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    const res = await fetch('/api/data', {
        headers: {
            Authorization: authHeader || ''
        }
    })

    const data = await res.json()
    return data
}

export default fetchData