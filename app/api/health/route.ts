import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'social-media-scheduler',
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        limit: 512, // MB - our configured limit
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      },
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '0.1.0',
    };

    // Warning if memory usage is high
    if (healthCheck.memory.percentage > 80) {
      healthCheck.status = 'warning';
      // @ts-ignore
      healthCheck.message = 'High memory usage detected';
    }

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}