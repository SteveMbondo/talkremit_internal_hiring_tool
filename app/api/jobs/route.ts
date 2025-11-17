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

    if (!html) return NextResponse.json([], { status: 200 });

    const root = parse(html);

    // Find all job blocks
    const jobBlocks = root.querySelectorAll('tr, div') // adjust selector to match your HTML
      .filter((el) => el.text.includes('Job Title')); // crude filter to find table rows / divs

    const jobs: Job[] = [];

    jobBlocks.forEach((block) => {
      const text = block.text.replace(/\n\s*/g, '\n').split('\n').map(t => t.trim()).filter(Boolean);
      if (text.length < 5) return; // not enough info

      const job: Job = {
        title: text[0],
        department: text[1],
        location: text[2],
        description: text[3],
        status: text[4].toLowerCase(),
      };

      if (job.status !== 'hired') jobs.push(job);
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error('Error in /api/jobs:', err);
    return NextResponse.json([], { status: 200 });
  }
}
