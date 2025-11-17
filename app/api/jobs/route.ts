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
  const baseUrl = process.env.CONFLUENCE_BASE_URL;
  const pageId = process.env.CONFLUENCE_PAGE_ID;

  if (!baseUrl || !pageId) {
    console.error('Missing CONFLUENCE_BASE_URL or CONFLUENCE_PAGE_ID');
    return NextResponse.json({ error: 'Missing Confluence configuration' }, { status: 500 });
  }

  try {
    const data = await fetchConfluencePage(pageId, baseUrl);
    const html = (data as any)?.body?.storage?.value;

    if (!html || typeof html !== 'string') {
      console.warn('Confluence page returned empty or invalid HTML');
      return NextResponse.json([], { status: 200 });
    }

    console.log('Raw HTML snippet:', html.substring(0, 500));

    const root = parse(html);
    const rows = root.querySelectorAll('tr');

    if (!rows || rows.length < 2) {
      console.warn('No table rows found in Confluence page');
      return NextResponse.json([], { status: 200 });
    }

    const headerCells = rows[0]
      .querySelectorAll('th, td')
      .map((n) => n.text.trim().toLowerCase());

    console.log('Parsed headers:', headerCells);

    const jobs: Job[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length === 0) continue;

      const rowObj: Partial<Job> = {};

      for (let j = 0; j < headerCells.length; j++) {
        const key = headerCells[j];
        const raw = (cells[j]?.innerText || '').trim();

        if (!key) continue;
        if (key.includes('job')) rowObj.title = raw;
        else if (key.includes('department')) rowObj.department = raw;
        else if (key.includes('location')) rowObj.location = raw;
        else if (key.includes('description')) rowObj.description = raw;
        else if (key.includes('status')) rowObj.status = raw.toLowerCase();
      }

      if (rowObj.title) jobs.push(rowObj as Job);
    }

    console.log('All parsed jobs:', jobs);

    // Consider "open" statuses
    const openJobs = jobs.filter((j) => {
      const s = j.status || '';
      return /open/i.test(s); // matches "open to application", "OPEN TO APPLICATION", etc.
    });

    console.log('Open jobs found:', openJobs.length);

    return NextResponse.json(openJobs, { status: 200 });
  } catch (err: any) {
    console.error('Error in /api/jobs:', err?.message || err);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}
