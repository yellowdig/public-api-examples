import { config } from "dotenv";
import { EventApiResponse } from "./types";

// Load environment variables
config();

const baseUrl = "https://data.yellowdig.app";
const apiKey = process.env.API_KEY!;
const networkName = process.env.ROOT_NETWORK_NAME!;

interface FetchEventsPageOptions {
  start?: number;
  limit?: number;
  cursor?: string;
}

async function fetchEventsPage(
  options: FetchEventsPageOptions
): Promise<EventApiResponse> {
  const url = new URL(`${baseUrl}/root-network/${networkName}/events`);

  // Add query parameters to the URL
  if (options.cursor) {
    url.searchParams.set("cursor", options.cursor);
  }
  if (options.start) {
    url.searchParams.set("start", options.start.toString());
  }
  if (options.limit) {
    url.searchParams.set("limit", options.limit.toString());
  }

  console.log("URI", url.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      apikey: apiKey,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      `API request failed with status ${response.status}: ${
        errorData ? JSON.stringify(errorData) : response.statusText
      }`
    );
  }

  const data = (await response.json()) as EventApiResponse;

  return data;
}

async function fetchPages({
  initialCursor,
  numPages,
  limit,
}: {
  initialCursor: string;
  numPages: number;
  limit: number;
}) {
  const pages: EventApiResponse[] = [];
  let cursor = initialCursor;

  for (let i = 0; i < numPages; i++) {
    const page = await fetchEventsPage({
      cursor: cursor,
      limit: limit,
    });

    // "at-end" indicates all pages have been exhausted
    if (page["at-end"]) break;

    pages.push(page);

    // Update cursor for next iteration
    cursor = page.cursor;
  }

  return pages;
}

// Example usage function
async function main() {
  if (!networkName) {
    throw new Error("ROOT_NETWORK_NAME environment variable is required");
  }

  if (!apiKey) {
    throw new Error("API_KEY environment variable is required");
  }

  const pages = [];

  // Fetch first page with start timestamp (no cursor needed)
  const startTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago

  const firstPage = await fetchEventsPage({
    start: startTimestamp,
    limit: 15,
  });

  pages.push(firstPage);

  const additionalPages = await fetchPages({
    // pass in cursor from initial request
    initialCursor: firstPage.cursor,
    numPages: 4,
    limit: 15,
  });

  console.log("got back", additionalPages);

  pages.push(...additionalPages);

  // Count the total number of records
  const allData = pages.flatMap((page) => page.data ?? []);
  const totalRecords = allData.length;
  console.log(`Total number of records: ${totalRecords}`);

  console.log(JSON.stringify(pages));
}

main().catch(console.error);
