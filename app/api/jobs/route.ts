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
    const baseUrl = process.env.CONFLUENCE_BASE_URL!;
    const pageId = process.env.CONFLUENCE_PAGE_ID!;

    const data = await fetchConfluencePage(pageId, baseUrl);
    const html = (data as any)?.body?.storage?.value;

    if (!html) {
      console.warn('Confluence page returned empty HTML');
      return NextResponse.json([], { status: 200 });
    }

    // Debug: log snippet of HTML
    console.log('Raw Confluence HTML snippet:', html.substring(0, 300));

    const root = parse(html);

    // Look specifically inside tables
    const rows = root.querySelectorAll('table tr');

    if (!rows || rows.length < 2) {
      console.warn('No table rows found in Confluence page');
      return NextResponse.json([], { status: 200 });
    }

    // Extract header names
    const headerCells = rows[0]
      .querySelectorAll('th, td')
      .map((cell) => cell.text.replace(/\s+/g, ' ').trim().toLowerCase());

    console.log('Parsed headers:', headerCells);

    const jobs: Job[] = [];

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      if (!cells || cells.length === 0) continue;

      const rowObj: Partial<Job> = {};

      for (let j = 0; j < headerCells.length; j++) {
        const key = headerCells[j];
        const raw = (cells[j]?.innerText || '')
          .replace(/\s+/g, ' ')
          .trim();

        if (!key || !raw) continue;

        if (key.includes('job')) rowObj.title = raw;
        else if (key.includes('department')) rowObj.department = raw;
        else if (key.includes('location')) rowObj.location = raw;
        else if (key.includes('description')) rowObj.description = raw;
        else if (key.includes('status')) rowObj.status = raw.toLowerCase();
      }

      if (rowObj.title) jobs.push(rowObj as Job);
    }

    console.log('All parsed jobs:', jobs);

    // Filter for open jobs
    const openJobs = jobs.filter((job) => {
      const status = job.status || '';
      return status.includes('open'); // matches "open to application"
    });

    console.log('Open jobs found:', openJobs.length);

    return NextResponse.json(openJobs, { status: 200 });
  } catch (err) {
    console.error('Error in /api/jobs:', err);
    return NextResponse.json([], { status: 200 });
  }
}
