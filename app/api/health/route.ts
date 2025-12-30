export async function GET() {
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA;
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
  const buildId = gitSha || deploymentId || process.env.NEXT_PUBLIC_BUILD_ID || 'local';

  return Response.json({
    status: 'ok',
    build: {
      id: buildId,
      short: typeof buildId === 'string' ? buildId.slice(0, 8) : 'local',
      vercelEnv: process.env.VERCEL_ENV,
      gitRef: process.env.VERCEL_GIT_COMMIT_REF,
      region: process.env.VERCEL_REGION,
    },
  });
}
