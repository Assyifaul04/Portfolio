import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  // Jika type=profile, ambil data profile
  if (type === 'profile') {
    return getProfile();
  }
  
  // Code lama untuk contributions
  const year = searchParams.get('year') || new Date().getFullYear().toString();
  
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const username = "Assyifaul04";

  if (!GITHUB_TOKEN) {
    console.error("Error: GITHUB_TOKEN tidak ditemukan di environment variables.");
    return NextResponse.json(
      { message: "Konfigurasi server tidak valid." },
      { status: 500 }
    );
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
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
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              name
              owner {
                login
              }
            }
            contributions {
              totalCount
            }
          }
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
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
        variables: { username, from, to },
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
        { status: 400 }
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

// Fungsi baru untuk mengambil data profile
async function getProfile() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const username = "Assyifaul04";

  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { message: "Konfigurasi server tidak valid." },
      { status: 500 }
    );
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        login
        avatarUrl
        bio
        company
        email
        followers {
          totalCount
        }
        following {
          totalCount
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
      return NextResponse.json(
        { message: `Gagal mengambil data profile. Status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { message: data.errors[0].message || "Terjadi error pada GraphQL." },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Terjadi kesalahan pada getProfile:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}