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

    const root = parse(html);
    const rows = root.querySelectorAll('tr');

    if (!rows || rows.length < 2) return NextResponse.json([], { status: 200 });

    // Extract header cells
    const headerCells = rows[0]
      .querySelectorAll('th, td')
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

      if (rowObj.title) jobs.push(rowObj as Job);
    }

    // Filter out roles that are "hired"
    const openJobs = jobs.filter((j) => j.status !== 'hired');

    console.log('Jobs parsed:', openJobs.length);

    return NextResponse.json(openJobs);
  } catch (err) {
    console.error('Error in /api/jobs:', err);
    return NextResponse.json([], { status: 200 });
  }
}
