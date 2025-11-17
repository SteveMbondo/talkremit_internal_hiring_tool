// Type definition for a Confluence page
export type ConfluencePage = {
  body: {
    storage: {
      value: string;
    };
  };
};

export async function fetchConfluencePage(
  pageId: string,
  baseUrl: string
): Promise<ConfluencePage> {
  const email = process.env.CONFLUENCE_EMAIL;
  const apiToken = process.env.CONFLUENCE_API_TOKEN;

  if (!email || !apiToken) {
    throw new Error("Missing CONFLUENCE_EMAIL or CONFLUENCE_API_TOKEN");
  }

  const url = `${baseUrl.replace(/\/$/, '')}/rest/api/content/${pageId}?expand=body.storage`;
  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Confluence fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
