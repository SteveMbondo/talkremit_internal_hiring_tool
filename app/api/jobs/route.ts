// app/api/jobs/route.ts
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

export async function GET() {
  try {
    const baseUrl = process.env.CONFLUENCE_BASE_URL;
    const pageId = process.env.CONFLUENCE_PAGE_ID;
    const apiToken = process.env.CONFLUENCE_API_TOKEN;

    if (!baseUrl || !pageId || !apiToken) {
      console.error('Missing Confluence environment variables');
      return NextResponse.json([], { status: 200 });
    }

    const data = await fetchConfluencePage(pageId, baseUrl, apiToken);

    const html = (data as any)?.body?.storage?.value;
    if (!html) return NextResponse.json([], { status: 200 });

    const root = parse(html);
    const table = root.querySelector('table');
    if (!table) return NextResponse.json([], { status: 200 });

    const rows = table.querySelectorAll('tr');
    if (rows.length < 2) return NextResponse.json([], { status: 200 });

    const headerCells = rows[0]
      .querySelectorAll('th,td')
      .map((n) => n.text.trim().toLowerCase());

    const jobs: Job[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length === 0) continue;

      const rowObj: Partial<Job> = {};

      for (let j = 0; j < headerCells.length; j++) {
        const key = headerCells[j];
        const raw = (cells[j]?.innerText || '').trim();

        if (key.includes('job')) rowObj.title = raw;
        else if (key.includes('department')) rowObj.department = raw;
        else if (key.includes('location')) rowObj.location = raw;
        else if (key.includes('description')) rowObj.description = raw;
        else if (key.includes('status')) rowObj.status = raw.toLowerCase();
      }

      if (rowObj.title) {
        jobs.push(rowObj as Job);
      }
    }

    const filtered = jobs.filter((j) => (j.status || '') !== 'hired');

    return NextResponse.json(filtered);
  } catch (err) {
    console.error('Error in /api/jobs:', err);
    // Always return an array
    return NextResponse.json([], { status: 200 });
  }
}
