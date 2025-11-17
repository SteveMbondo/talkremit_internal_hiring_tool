// types
export type ConfluencePage = {
  body: {
    storage: {
      value: string
    }
  }
}

// main function
export async function fetchConfluencePage(
  pageId: string,
  baseUrl: string
): Promise<ConfluencePage> {
  // ⬅️ Fetch email + token from env
  const email = process.env.CONFLUENCE_EMAIL
  const apiToken = process.env.CONFLUENCE_API_TOKEN

  if (!email || !apiToken) {
    throw new Error("Missing CONFLUENCE_EMAIL or CONFLUENCE_API_TOKEN env variables")
  }

  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content/${pageId}?expand=body.storage`

  // Confluence REQUIRED format → email:token
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64')

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Confluence fetch failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
