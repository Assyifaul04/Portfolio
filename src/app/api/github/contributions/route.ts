// Lokasi: app/api/github/contributions/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const username = "Assyifaul04";


  if (!GITHUB_TOKEN) {
    console.error("Error: GITHUB_TOKEN tidak ditemukan di environment variables.");

    return NextResponse.json(
      { message: "Konfigurasi server tidak valid." },
      { status: 500 }
    );
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`GitHub API request failed: ${response.status}`, errorBody);
        return NextResponse.json(
            { message: `Gagal mengambil data dari GitHub. Status: ${response.status}` },
            { status: response.status }
        );
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Errors:", data.errors);
      return NextResponse.json(
        { message: data.errors[0].message || "Terjadi error pada GraphQL." },
        { status: 400 } // Bad Request
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Terjadi kesalahan pada API route:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}