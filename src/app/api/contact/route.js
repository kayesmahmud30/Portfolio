export async function POST(req) {
  const body = await req.json().catch(() => null);
  const name = body?.name?.toString?.().trim?.() ?? "";
  const email = body?.email?.toString?.().trim?.() ?? "";
  const message = body?.message?.toString?.().trim?.() ?? "";

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  // Placeholder endpoint: connect to an email provider later.
  return Response.json({ ok: true }, { status: 200 });
}

