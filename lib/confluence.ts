export async function fetchConfluencePage(
  pageId: string,
  baseUrl: string,
  apiToken: string
): Promise<ConfluencePage> {
  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content/${pageId}?expand=body.storage`
  const token = Buffer.from(`your-email@example.com:${apiToken}`).toString('base64')

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${token}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) throw new Error(`Confluence fetch failed: ${res.status} ${res.statusText}`)

  return res.json()
}
