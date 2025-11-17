import { NextResponse } from 'next/server';
import { fetchConfluencePage } from '../../../lib/confluence';
import { parse } from 'node-html-parser';

type Job = {
  title: string;
  department?: string;
  location?: string;
  description?: string;
  status?: string;
};

export async function fetchConfluencePage(pageId: string, baseUrl: string) {
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

  const text = await res.text();
  if (!res.ok) {
    console.error('Confluence fetch failed:', res.status, res.statusText, text.substring(0, 200));
    throw new Error(`Confluence fetch failed: ${res.status} ${res.statusText}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error('Invalid JSON from Confluence:', text.substring(0, 200));
    throw new Error('Invalid JSON from Confluence');
  }
}
