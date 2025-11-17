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

    if (!baseUrl || !pageId) {
      console.error('Missing CONFLUENCE_BASE_URL or CONFLUENCE_PAGE_ID');
      return NextResponse.json([], { status: 500 });
    }

    const data = await fetchConfluencePage(pageId, baseUrl);
    const html = (data as any)?.body?.storage?.value;

    if (!html) {
      console.warn('Confluence page returned empty HTML');
      return NextResponse.json([], { status: 200 });
    }

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

        if (key.includes('job')) rowObj.title = raw;
        else if (key.includes('department')) rowObj.department = raw;
        else if (key.includes('location')) rowObj.location = raw;
        else if (key.includes('description')) rowObj.description = raw;
        else if (key.includes('status')) rowObj.status = raw.toLowerCase();
      }

      if (rowObj.title) jobs.push(rowObj as Job);
    }

    console.log('All parsed jobs:', jobs);

    const openJobs = jobs.filter((j) => {
      const status = j.status?.toLowerCase() || '';
      return status.includes('open');
    });

    console.log('Open jobs found:', openJobs.length);

    return NextResponse.json(openJobs);
  } catch (err) {
    console.error('Error in /api/jobs:', err);
    return NextResponse.json([], { status: 500 });
  }
}
